import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import type { AccountType, Role } from '../interface/user.interface';
import { accountTypeEnum, roleEnum } from '@db/schema/user.schema';
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
  @IsString()
  @MinLength(4)
  confirmPassword: string;

  @ApiProperty({ enum: roleEnum })
  @IsEnum(roleEnum)
  role: Role;
  @ApiProperty(accountTypeEnum)
  @IsEnum(accountTypeEnum)
  accountType: AccountType;

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
