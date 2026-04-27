import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { DB_PROVIDER } from '../../../db/provider/db.provider';
import { GithubStrategy } from '../../../common/strategy/github.strategy';
import { PassportModule } from '@nestjs/passport';

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
  ],

  providers: [AuthService, GithubStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
