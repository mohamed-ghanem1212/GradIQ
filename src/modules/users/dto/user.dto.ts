import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { AccountType, Role } from '../interface/user.interface';
import { accountTypeEnum, roleEnum } from '../../../db/schema/user.schema';
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
  @IsOptional()
  confirmPassword: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  pfp: string;
  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;
  @ApiProperty({ enum: AccountType })
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiProperty()
  @IsString()
  position: string;

  @ApiProperty()
  @IsString()
  college: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\+?[0-9\s\-\(\)]{7,20}$/, {
    message: 'Phone number is invalid',
  })
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
