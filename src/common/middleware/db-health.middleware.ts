import { DB_PROVIDER } from '@db/provider/db.provider';
import { NestMiddleware, Logger, Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@db/schema';
@Injectable()
export class DbHealthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(DbHealthMiddleware.name);
  constructor(@Inject(DB_PROVIDER) private db: NodePgDatabase<typeof schema>) {}
  use(req: Request, res: Response, next: Function) {
    this.db.query.users
      .findFirst()
      .then(() => {
        this.logger.log('Database connection is healthy');
        next();
      })
      .catch((error) => {
        this.logger.error('Database connection failed', error);
      });
    this.logger.log('Checking database health...');
  }
}
