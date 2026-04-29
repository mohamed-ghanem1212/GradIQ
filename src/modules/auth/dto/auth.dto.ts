import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LocalAuthDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

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
