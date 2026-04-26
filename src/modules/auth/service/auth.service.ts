import * as schema from '../../../db/schema';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER } from '../../../db/provider/db.provider';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateUserDto } from '../../users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { insertUserSchema, users } from '../../../db/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser } from '../interface/auth.interface';
import { eq } from 'drizzle-orm';
import { Profile } from 'passport-github2';
import { User } from '@modules/users/interface/user.interface';
export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;
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

  async validateGithubUser(profile: Profile): Promise<User> {
    const email = profile.emails[0]?.value;
    if (!email) {
      throw new BadRequestException('GitHub profile does not contain an email');
    }
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return existingUser;
  }
}
