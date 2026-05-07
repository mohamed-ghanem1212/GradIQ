import { DB_PROVIDER } from '@db/provider/db.provider';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../db/schema';
import { eq } from 'drizzle-orm';
@Injectable()
export class UsersService {
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
}
