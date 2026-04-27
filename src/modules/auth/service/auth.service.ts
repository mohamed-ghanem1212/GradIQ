import * as schema from '../../../db/schema';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DB_PROVIDER } from '../../../db/provider/db.provider';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateUserDto } from '../../users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { insertUserSchema, users } from '../../../db/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser } from '../interface/auth.interface';
import { and, eq } from 'drizzle-orm';
import { Profile } from 'passport-github2';
import { userAccounts } from '@db/schema/userProvider.schema';
import { User } from '@modules/users/interface/user.interface';
import { jwt } from 'zod';
export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;
type GithubCallbackResult =
  | { type: 'existing'; accessToken: string }
  | { type: 'new'; tempToken: string };
@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_PROVIDER) private db: NodePgDatabase<typeof schema>,
    private readonly configService: ConfigService,
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
        role: user.role,
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

  async extistEmail(email: string) {
    const findUser = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (findUser) {
      return { exists: true };
    }
  }

  async validateGithubUser(profile: Profile): Promise<GithubCallbackResult> {
    //Does this email exist in github??
    const email = profile.emails[0]?.value;
    if (!email) {
      throw new BadRequestException('GitHub profile does not contain an email');
    }
    //check if the user does exist in DB and if yes we generate an
    // access token and he's verified to use the platform
    const existingUser = await this.db.query.userAccounts.findFirst({
      where: and(
        eq(userAccounts.provider, 'github'),
        eq(userAccounts.providerAccountId, profile.id),
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
      where: eq(users.email, email),
    });

    if (emailExists) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'This email is already registered with another provider.',
      });
    }
    const tempToken = this.jwtService.sign(
      {
        sub: profile.id,
        email,
        username: profile.username,
        fullName: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value,
        provider: 'github',
        providerAccountId: profile.id,
        isTemp: true,
      },
      { expiresIn: '10m' },
    );

    return {
      type: 'new',
      tempToken,
    };
  }
  // auth.service.ts
  // // async completeRegistration(tempUser: any, dto: CompleteRegistrationDto) {
  // //   return await this.db.transaction(async (tx) => {
  // //     // Create users row with GitHub data + user filled data combined
  // //     const [newUser] = await tx
  // //       .insert(users)
  // //       .values({
  // //         email: tempUser.email,
  // //         username: tempUser.username,
  // //         fullName: tempUser.fullName,
  // //         avatarUrl: tempUser.avatarUrl,
  // //         phone: dto.phone,
  // //         college: dto.college,
  // //         lastLoginAt: new Date(),
  // //         status: 'active',
  // //       })
  // //       .returning();

  // //     // Create user_accounts row
  // //     await tx.insert(userAccounts).values({
  // //       userId: newUser.id,
  // //       provider: tempUser.provider,
  // //       providerAccountId: tempUser.providerAccountId,
  // //     });

  // //     // Return real JWT now
  // //     return {
  // //       accessToken: this.jwtService.sign({ sub: newUser.id }),
  // //     };
  // //   });
  // }
}
