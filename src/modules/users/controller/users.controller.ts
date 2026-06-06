import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../../../common/decorators/role.decorator';
import { RolesGuard } from '../../../common/guards/role.guard';
import { Role } from '../interface/user.interface';
import { JwtGuard } from '../../../common/guards/jwt.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('allUsers')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
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

  @Get('getUserByToken')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getUserByToken(@Req() req: any) {
    console.log('Request user object:', req.user);
    return await this.userService.getUserByToken(req);
  }

  @Patch('changeRole/:id')
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiBody({
    description: 'New role for the user',
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: ['USER', 'ADMIN'],
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard) // Ensure the user is authenticated
  @ApiBearerAuth()
  async changeRole(
    @Param() params: { id: string },
    @Body() body: { role: 'USER' | 'ADMIN' },
  ) {
    return await this.userService.changeRole(params.id, body.role);
  }

  @Get('fetchAllUsersProviders')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async fetchAllUsersProviders() {
    return await this.userService.fetchAllUsersProviders();
  }

  @Get('fetchAllUserProviders/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async fetchAllUserProviders(@Param('userId') userId: string) {
    return await this.userService.fetchAllUserProviders(userId);
  }
  @Get('fetchUserProviderById/:providerId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async fetchUserProviderById(@Param('providerId') providerId: string) {
    return await this.userService.fetchUserProviderById(providerId);
  }
}
