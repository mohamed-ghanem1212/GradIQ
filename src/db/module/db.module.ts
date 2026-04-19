import { Global, Module } from '@nestjs/common';
import { DB_PROVIDER, dbProvider } from '../provider/db.provider';
@Global()
@Module({
  providers: [...dbProvider],
  exports: [DB_PROVIDER],
})
export class DbModule {}
