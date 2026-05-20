import { AuthService } from '@modules/auth/service/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateLocalUser({ email, password });
    if (!user) {
      throw new UnauthorizedException(
        'Unauthorized please check your email or password',
      );
    }
    return user;
  }
}
