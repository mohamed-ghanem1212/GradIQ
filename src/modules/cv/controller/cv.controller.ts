import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Logger,
  MaxFileSizeValidator,
  Param,
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
import {
  Role,
  type UserRequest,
} from '@modules/users/interface/user.interface';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../../../common/guards/role.guard';
import { Roles } from '../../../common/decorators/role.decorator';
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

      cv,
    };
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async fetchAllCvs() {
    return await this.cvService.getAllCvs();
  }
  @Get(':cvId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getCvById(@Param('cvId') cvId: string) {
    return await this.cvService.getCvById(cvId);
  }
  @Delete(':cvId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async deleteCv(@Param('cvId') cvId: string, @Req() req: UserRequest) {
    return await this.cvService.deleteCv(cvId, req.user.id);
  }
  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getAllCvsForUser(@Param('userId') userId: string) {
    return await this.cvService.getAllCvsForUser(userId);
  }
}
