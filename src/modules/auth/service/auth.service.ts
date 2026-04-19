import * as schema from '@db/schema';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER } from '../../../db/provider/db.provider';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateUserDto } from '@modules/users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { InsertUser, insertUserSchema, users } from '@db/schema/user.schema';
export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;
@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_PROVIDER) private db: NodePgDatabase<typeof schema>,
    private readonly configService: ConfigService,
  ) {}

  async register(user: CreateUserDto) {
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
    const newUser = await this.db
      .insert(users)
      .values({
        password: hashPassword,
        ...user,
      })
      .returning();
    if (!newUser) {
      throw new BadRequestException('Failed to create user');
    }
  }
}
