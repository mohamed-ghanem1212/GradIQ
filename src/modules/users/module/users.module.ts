import { Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { JwtStrategy } from '../../../common/strategy/jwt.strategy';
import { GitHubGuard } from '../../../common/guards/github.guard';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { RedisModule } from '@modules/redis/redis.module';
import Redis from 'ioredis';

@Module({
  imports: [
    PassportModule,
    RedisModule,
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
  controllers: [UsersController],
  providers: [UsersService, GitHubGuard, JwtGuard, JwtStrategy, Redis],
  exports: [UsersModule],
})
export class UsersModule {}
