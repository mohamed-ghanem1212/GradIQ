import { Injectable } from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  StrategyOptionsWithRequest,
} from 'passport-github2';
import { config } from '../../config/config.singleton';
import { AuthService } from '@modules/auth/service/auth.service';

const githubOptions: StrategyOptionsWithRequest = {
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackurl,
  passReqToCallback: true,
  scope: ['user:email'],
};
type VerifyCallback = (error: any, user?: any, info?: any) => void;
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {
    super(githubOptions);
  }

  async validate(
    req: Request,
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      console.log('GitHub Profile:', profile);
      const user = await this.authService.validateGithubUser(profile);
      console.log('User object from AuthService:', user);
      if (!user) {
        console.log('No user found');
        return done(null, false);
      }
      console.log('User object passed to done callback:', user);
      return done(null, user);
    } catch (err: any) {
      this.logger.error('Failed to validate github authentication', {
        error: err,
      });
      throw new Error(err);
    }
  }
}
