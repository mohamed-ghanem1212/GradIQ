import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto, UserOauthDTO } from '@modules/users/dto/user.dto';
import { AuthenticatedUser } from '../interface/auth.interface';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TempJwtGuard } from '../../../common/guards/tempJwt.guard';
import { GoogleOAuthGuard } from '../../../common/guards/google.guard';
import { LocalAuthDTO } from '../dto/auth.dto';
import type { User } from '@modules/users/interface/user.interface';

// @ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
  async googleAuthRedirect(@Req() req) {
    return req.user;
  }

  @Post('signIn')
  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LocalAuthDTO })
  async login(@Req() req: any) {
    const { user, token } = await this.authService.logIn(req.user);
    return { user, token };
  }
}
