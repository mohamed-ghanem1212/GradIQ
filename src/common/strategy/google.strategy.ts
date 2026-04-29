import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@modules/auth/service/auth.service';
import { config } from '../../config/config.singleton';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackurl,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(null, false);
      console.log(`Google-profile: ${profile.emails?.[0]?.value}`);

      const user = await this.authService.validateOAuthUser({
        email,
        pfp: profile.photos?.[0]?.value,
        provider: 'google',
        providerAccountId: profile.id,
        username: profile.name.givenName,
      });
      console.log(`Google-profile: ${profile.emails?.[0]?.value}`);
      done(null, user);
    } catch (error) {
      return done(null, false);
    }
  }
}
