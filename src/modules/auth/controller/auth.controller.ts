import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto, UserOauthDTO } from '@modules/users/dto/user.dto';
import { AuthenticatedUser } from '../interface/auth.interface';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TempJwtGuard } from '../../../common/guards/tempJwt.guard';
import { GoogleOAuthGuard } from '../../../common/guards/google.guard';
import { LocalAuthDTO } from '../dto/auth.dto';
import type { User } from '@modules/users/interface/user.interface';
import Redis from 'ioredis';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly redisClient: Redis,
  ) {}
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() user: CreateUserDto): Promise<AuthenticatedUser> {
    return await this.authService.register(user);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    // nothing here — Passport handles the redirect automatically
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Register with github' })
  async registerOauth(@Req() req: any): Promise<any> {
    return req.user;
  }

  @Post('complete-registration')
  @UseGuards(TempJwtGuard)
  @ApiBearerAuth() // guard that validates the temp token
  completeRegistration(@Req() req, @Body() dto: UserOauthDTO) {
    return this.authService.completeRegistration(req.user, dto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any) {
    return req.user;
  }

  @Post('signIn')
  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LocalAuthDTO })
  async login(@Req() req: any) {
    const { user, accessToken } = await this.authService.logIn(req.user);
    return { user, accessToken };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async logout(@Req() req: any) {
    if (req.user.isTemp) {
      this.logger.log(
        `Logging out temp user with providerAccountId ${req.user.sub}`,
      );
      await this.redisClient.del(`temp_token:${req.user.sub}`);
      return {
        message: 'Logged out successfully... Temporary session ended',
      };
    }
    const log = await this.authService.logout(req.user.id);
    return { message: 'Logged out successfully' };
  }
}
