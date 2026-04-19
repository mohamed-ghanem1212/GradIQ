import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatejobOfferDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;
}
