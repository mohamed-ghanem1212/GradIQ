import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/module/db.module';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/config.env';
import appConfig from './config/config-register/app.config';
import jwtConfig from './config/config-register/jwt.config';
import databaseConfig from './config/config-register/database.config';
import { AuthModule } from '@modules/auth/module/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: envValidationSchema,
      load: [appConfig, jwtConfig, databaseConfig],
    }),
    DbModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
