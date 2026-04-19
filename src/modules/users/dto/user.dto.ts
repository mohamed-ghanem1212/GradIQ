import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import type { Role } from '../interface/user.interface';
export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty()
  @IsEnum(['USER', 'ADMIN'])
  role: Role;
  @ApiProperty()
  @IsEnum(['EMPLOYER', 'JOB_SEEKER', 'FRESHER'])
  accountType: Role;

  @ApiProperty()
  @IsString()
  position: string;

  @ApiProperty()
  @IsString()
  college: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  address: string;
}
export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @IsEnum(['USER', 'ADMIN'])
  role: Role;
  @ApiProperty()
  @IsEnum(['EMPLOYER', 'JOB_SEEKER', 'FRESHER'])
  accountType: Role;

  @ApiProperty()
  @IsString()
  position: string;

  @ApiProperty()
  @IsString()
  college: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  address: string;
}
