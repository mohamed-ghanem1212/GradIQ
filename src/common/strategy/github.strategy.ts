import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(GithubStrategy.name);
  constructor(private readonly authService: AuthService) {
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
      const email = await this.getGithubEmail(accessToken);
      if (!email) return done(null, false);
      console.log('GitHub Profile:', profile);
      const user = await this.authService.validateGithubUser(profile, email);
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

  private async getGithubEmail(accessToken: string): Promise<string | null> {
    const response = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });
    if (!response.ok) return null;
    const emails: { email: string; primary: boolean; verified: boolean }[] =
      await response.json();

    return emails.find((e) => e.primary && e.verified)?.email ?? null;
  }
}
