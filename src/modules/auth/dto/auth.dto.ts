import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDTOLogIn {
  @ApiProperty()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class AuthDTOResetPassword {
  @ApiProperty()
  @IsEmail()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  newPassword: string;

  @ApiProperty()
  @IsString()
  confirmPassword: string;
}

export class OAuthProvider {
  provider: string;
  providerId: string;
}
