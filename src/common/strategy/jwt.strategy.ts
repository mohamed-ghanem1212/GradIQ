import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '@modules/users/interface/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(user: User) {
    console.log('JWT payload:', user);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}
