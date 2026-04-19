import { Module } from '@nestjs/common';
import { dbProvider } from '../provider/db.provider';

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule {}
