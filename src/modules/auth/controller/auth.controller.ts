import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '@modules/users/dto/user.dto';
import { AuthenticatedUser } from '../interface/auth.interface';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

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
}
