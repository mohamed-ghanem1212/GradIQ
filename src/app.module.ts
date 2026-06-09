import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/module/db.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidationSchema } from './config/config.env';
import appConfig from './config/config-register/app.config';
import jwtConfig from './config/config-register/jwt.config';
import databaseConfig from './config/config-register/database.config';
import { AuthModule } from '@modules/auth/module/auth.module';
import { UsersModule } from '@modules/users/module/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { CvModule } from '@modules/cv/module/cv.module';
import { BullModule } from '@nestjs/bullmq';
import redisConfig from './config/config-register/redis.config';
import { AtsModule } from '@modules/ats/module/ats.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST_DEV', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: envValidationSchema,
      load: [appConfig, jwtConfig, databaseConfig, redisConfig],
    }),

    DbModule,
    AuthModule,
    UsersModule,
    CvModule,
    AtsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
