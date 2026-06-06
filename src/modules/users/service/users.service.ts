import { DB_PROVIDER } from '@db/provider/db.provider';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from '../dto/user.dto';
import { Request } from 'express';
@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(
    @Inject(DB_PROVIDER) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    const users = await this.db.query.users.findMany({
      columns: { password: false },
      with: {
        accounts: true,
        cvs: true,
      },
    });

    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  async findUserById(id: string) {
    this.logger.error(`Finding user with ID: ${id}`);
    if (!id) {
      throw new BadRequestException('User ID is required');
    }
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
      columns: { password: false },
      with: {
        accounts: true,
        cvs: true,
        ats: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async updateUser(id: string, updateData: UpdateUserDto) {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }
    const updatedUser = await this.db
      .update(schema.users)
      .set(updateData)
      .where(eq(schema.users.id, id))
      .returning();
    if (updatedUser.length === 0) {
      throw new NotFoundException('User not found');
    }
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
      with: {
        accounts: true,
        cvs: true,
        ats: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async changeRole(id: string, newRole: 'USER' | 'ADMIN') {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }
    const updatedUser = await this.db
      .update(schema.users)
      .set({ role: newRole })
      .where(eq(schema.users.id, id))
      .returning();
    if (updatedUser.length === 0) {
      throw new NotFoundException('User not found');
    }
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
      columns: { password: false },
      with: {
        accounts: true,
        cvs: true,
        ats: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return updatedUser[0];
  }
  async getUserByToken(req: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
      columns: { password: false },
      with: {
        accounts: true,
        cvs: true,
        ats: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async fetchAllUsersProviders() {
    const users = await this.db.query.userAccounts.findMany();
    if (users.length === 0) {
      throw new NotFoundException('No user accounts found');
    }
    return users;
  }
  async fetchAllUserProviders(userId: string) {
    const users = await this.db.query.userAccounts.findMany({
      where: eq(schema.userAccounts.userId, userId),
    });
    if (users.length === 0) {
      throw new NotFoundException('No user accounts found');
    }
    return users;
  }
  async fetchUserProviderById(providerId: string) {
    const user = await this.db.query.userAccounts.findMany({
      where: eq(schema.userAccounts.id, providerId),
    });
    if (user.length === 0) {
      throw new NotFoundException('No user account found');
    }
    return user;
  }
}
