import {
  Body,
  Controller,
  FileTypeValidator,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Multer } from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCvDto } from '../dto/cv.dto';
import { CvService } from '../service/cv.service';
import type { UserRequest } from '@modules/users/interface/user.interface';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
@ApiTags('CV')
@Controller('cv')
export class CvController {
  private logger = new Logger(CvController.name);
  constructor(private readonly cvService: CvService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Upload a CV for the authenticated user' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        summary: { type: 'string' },
        note: { type: 'string' },
        format: { type: 'string', enum: ['PDF', 'DOCX'] },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadCv(
    @Req() req: UserRequest,
    @Body() cvData: CreateCvDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    this.logger.log(
      `Received CV upload request from user ${req.user.id} with file ${cvData}, `,
    );

    const cv = await this.cvService.uploadUserCv(cvData, req);

    return {
      message: 'CV uploaded',
      filename: file.buffer.toString('base64'),
      cv,
    };
  }
}
