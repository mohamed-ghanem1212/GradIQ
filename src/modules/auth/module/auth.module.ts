import { Module } from '@nestjs/common';
import { DbModule } from '../../../db/module/db.module';
import { dbProvider } from '../../../db/provider/db.provider';

@Module({
  imports: [],
  providers: [],
})
export class AuthModule {}
