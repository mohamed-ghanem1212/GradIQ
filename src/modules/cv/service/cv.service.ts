import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCvDto } from '../dto/cv.dto';
import { UsersService } from '@modules/users/service/users.service';
import { AnyARecord } from 'node:dns';
import { DB_PROVIDER } from '@db/provider/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../db/schema';
import { UserRequest } from '@modules/users/interface/user.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import cloudinary from 'cloudinary';
import { uploadFromBuffer } from '../../../utils/uploadFile';
import { CloudinaryService } from '../../../config/cloudinary/service/cloudinary.service';
@Injectable()
export class CvService {
  private logger = new Logger(CvService.name);
  constructor(
    private readonly userService: UsersService,
    @Inject(DB_PROVIDER) private readonly db: NodePgDatabase<typeof schema>,
    private readonly cloudinaryService: CloudinaryService,
    @InjectQueue('cv-processing') private cvQueue: Queue,
  ) {}
  async uploadUserCv(CvData: CreateCvDto, req: UserRequest) {
    this.logger.log(
      `Starting CV upload process for user ${req.user.id} data: ${CvData}`,
    );
    if (!CvData) {
      this.logger.error('CV data is missing');
      throw new NotFoundException('CV data is required');
    }
    const user = await this.userService.getUserByToken(req);
    if (!user) {
      this.logger.error('User not found for CV upload');
      throw new NotFoundException('User not found');
    }

    const uploadFile = await this.cloudinaryService.uploadFromBuffer(
      req.file.buffer,
      `cv_uploads/${req.user.id}/${Date.now()}_${req.file.originalname}`,
    );
    if (!uploadFile) {
      this.logger.error('Failed to upload CV to Cloudinary');
      throw new NotFoundException('Failed to upload CV');
    }
    const newCv = await this.db
      .insert(schema.cv)
      .values({
        user_id: req.user.id,
        title: CvData.title,
        summary: CvData.summary,
        note: CvData.note,
        file_path: uploadFile.secure_url,
        format: CvData.format,
      })
      .returning();
    return newCv;
  }
}
