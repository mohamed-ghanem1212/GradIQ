import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import type { Format } from '../interface/cv.interface';

export class CreateCvDto {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  summary: string;
  @ApiProperty()
  @IsString()
  note: string;
  @ApiProperty()
  @IsEnum(['PDF', 'DOCX'])
  format: Format;
}
export class UpdateCvDto {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  summary: string;
  @ApiProperty()
  @IsString()
  note: string;
}
