import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('allUsers')
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Get('getUserById/:id')
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  async getUserById(@Param() params: { id: string }) {
    return await this.userService.findUserById(params.id);
  }
  @Patch('updateUser/:id')
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiBody({ description: 'Data to update the user', type: UpdateUserDto })
  async updateUser(
    @Param() params: { id: string },
    @Body() updateData: UpdateUserDto,
  ) {
    return await this.userService.updateUser(params.id, updateData);
  }
}
