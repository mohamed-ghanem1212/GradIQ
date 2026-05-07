import * as schema from '../../../db/schema';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DB_PROVIDER } from '../../../db/provider/db.provider';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateUserDto, UserOauthDTO } from '../../users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { insertUserSchema, users } from '../../../db/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser, OAuthProfile } from '../interface/auth.interface';
import { and, eq } from 'drizzle-orm';
import { userAccounts } from '@db/schema/userProvider.schema';
import { LocalAuthDTO } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    @Inject(DB_PROVIDER) private db: NodePgDatabase<typeof schema>,

    private readonly jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto): Promise<AuthenticatedUser> {
    const passConfirmed = user.password === user.confirmPassword;
    if (!passConfirmed) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }
    const hashPassword = await bcrypt.hash(user.password, 10);
    const validated = insertUserSchema.safeParse(user);
    if (!validated.success) {
      throw new BadRequestException(validated.error.message);
    }
    const existingUser = await this.extistEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const newUser = await this.db
      .insert(users)
      .values({
        username: user.username,
        email: user.email,
        password: hashPassword,
        position: user.position,
        college: user.college,
        phone: user.phone,
        address: user.address,

        accountType: user.accountType,
      })

      .returning();
    if (!newUser) {
      throw new BadRequestException('Failed to create user');
    }
    const payload = {
      sub: newUser[0].id,
      username: newUser[0].username,
      email: newUser[0].email,
      role: newUser[0].role,
    };

    const token = await this.jwtService.signAsync(payload);
    const { password: hashedPassword, ...userWithoutPassword } = newUser[0];
    return {
      user: userWithoutPassword,
      token,
    };
  }
  async validateLocalUser(auth: LocalAuthDTO) {
    if (!auth) {
      throw new BadRequestException('Please insert your data for verfication');
    }
    this.logger.log('Validating local user with email: ' + auth.email);

    const findUser = await this.db.query.users.findFirst({
      where: eq(users.email, auth.email),
    });
    this.logger.log('Found user: ' + findUser);
    if (!findUser) {
      throw new NotFoundException('Email not found');
    }
    if (!findUser.password) {
      throw new BadRequestException(
        'This email is registered with OAuth. Please log in with your provider.',
      );
    }
    const verifyPass = await bcrypt.compare(auth.password, findUser.password);
    if (!verifyPass) {
      throw new BadRequestException('email or password incorrect');
    }
    const { password: _, ...user } = findUser;
    return user;
  }
  async extistEmail(email: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user;
  }
  async logIn(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      isVerified: user.isVerified,
      lastLoginAt: user.lastLoginAt,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }
  async validateOAuthUser(profile: OAuthProfile): Promise<any> {
    const existingUser = await this.db.query.userAccounts.findFirst({
      where: and(
        eq(userAccounts.provider, profile.provider),
        eq(userAccounts.providerAccountId, profile.providerAccountId),
      ),
      with: { user: true },
    });

    if (existingUser) {
      await this.db
        .update(users)
        .set({
          lastLoginAt: new Date(),
        })
        .where(eq(users.id, existingUser.user.id));
      return {
        type: 'existing',
        accessToken: this.jwtService.sign({ sub: existingUser.user.id }),
      };
    }
    // in case the user wants to register for the first time
    // we check first on the email
    const emailExists = await this.db.query.users.findFirst({
      where: eq(users.email, profile.email),
    });

    console.log('hello');
    if (emailExists) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'This email is already registered with another provider.',
      });
    }
    const tempToken = this.jwtService.sign(
      {
        sub: profile.providerAccountId,
        email: profile.email,
        username: profile.username,
        pfp: profile.pfp,
        provider: profile.provider,
        providerAccountId: profile.providerAccountId,
        isTemp: true,
      },
      { expiresIn: '10m' },
    );

    return {
      type: 'new',
      tempToken,
    };
  }

  async completeRegistration(tempUser: any, dto: UserOauthDTO) {
    return await this.db.transaction(async (tx) => {
      // Create users row with GitHub data + user filled data combined
      const [newUser] = await tx
        .insert(users)
        .values({
          email: tempUser.email,
          username: tempUser.username,
          pfp: tempUser.pfp,
          phone: dto.phone,
          college: dto.college,
          position: dto.position,
          address: dto.address,
          accountType: dto.accountType,
          isVerified: true,
          lastLoginAt: new Date(),
        })
        .returning();

      // Create user_accounts row
      await tx.insert(userAccounts).values({
        userId: newUser.id,
        provider: tempUser.provider,
        providerAccountId: tempUser.providerAccountId,
      });
      const { password: pwd, ...userData } = newUser;
      // Return real JWT now
      return {
        accessToken: this.jwtService.sign({ sub: newUser.id }),
        userData,
      };
    });
  }
}
