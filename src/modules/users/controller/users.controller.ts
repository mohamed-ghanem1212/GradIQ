import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('allUsers')
  async getAllUsers() {
    return this.userService.findAll();
  }
}
