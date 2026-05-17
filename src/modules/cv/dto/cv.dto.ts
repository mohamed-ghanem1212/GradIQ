import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import type { Format } from '../interface/cv.interface';

export class CreateCvDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  title: string;
  @ApiProperty({ type: 'string' })
  @IsString()
  summary: string;
  @ApiProperty({ type: 'string' })
  @IsString()
  note: string;
  @ApiProperty({ enum: ['PDF', 'DOCX'] })
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
