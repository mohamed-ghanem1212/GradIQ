import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { DB_PROVIDER } from '../../../db/provider/db.provider';
import { GithubStrategy } from '../../../common/strategy/github.strategy';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from '../../../common/strategy/google.strategy';
import { LocalAuthStrategy } from '../../../common/strategy/local.strategy';
import { RedisModule } from '@modules/redis/redis.module';
import Redis from 'ioredis';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn') as StringValue,
        },
      }),
    }),
    RedisModule,
  ],

  providers: [
    AuthService,
    GithubStrategy,
    GoogleStrategy,
    LocalAuthStrategy,
    Redis,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
