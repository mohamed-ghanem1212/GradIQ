import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from '@modules/users/interface/user.interface';
import Redis from 'ioredis';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private logger = new Logger(JwtStrategy.name);
  constructor(private readonly redisClient: Redis) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET as string,
      passReqToCallback: true,
    });
  }

  async validate(req: any, user: any) {
    const payLoad = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isVerified: user.isVerified,
    };
    this.logger.log(
      `Temp token found for providerAccountId ${JSON.stringify(user)}`,
    );
    const accessToken = await this.redisClient.get(`accessToken:${user.id}`);
    if (accessToken) {
      this.logger.log(
        `access token found for providerAccountId ${user.id}: ${accessToken}`,
      );

      return payLoad;
    }
    const tempToken = await this.redisClient.get(
      `temp_token:${user.providerAccountId}`,
    );
    if (tempToken) {
      this.logger.log(
        `Temp token found for providerAccountId ${user.providerAccountId}: ${tempToken}`,
      );
      return {
        sub: user.sub,
        email: user.email,
        isTemp: true,
      };
    }
    throw new UnauthorizedException('Session expired, please login again');
  }
}
