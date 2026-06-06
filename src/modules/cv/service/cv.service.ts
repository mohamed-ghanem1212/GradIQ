import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateCvDto } from '../dto/cv.dto';
import { UsersService } from '@modules/users/service/users.service';
import { DB_PROVIDER } from '@db/provider/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../db/schema';
import { UserRequest } from '@modules/users/interface/user.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CloudinaryService } from '../../../config/cloudinary/service/cloudinary.service';
import { downLoadFile } from '../pipeline/downloadFile.pipeline';
import { analyzeFile } from '../pipeline/analyzeFile.pipeline';
import { and, eq } from 'drizzle-orm';
import { BadRequestError } from 'groq-sdk';
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
      `cv_uploads/`,
      req.user.id,
      req.file.originalname,
    );
    if (!uploadFile) {
      this.logger.error('Failed to upload CV to Cloudinary');
      throw new NotFoundException('Failed to upload CV');
    }
    const signedUrl = this.cloudinaryService.getSignedUrl(uploadFile.public_id);
    const cv = await this.db
      .insert(schema.cv)
      .values({
        user_id: req.user.id,
        title: CvData.title,
        summary: CvData.summary,
        note: CvData.note,
        file_path: signedUrl,
        format: CvData.format,
      })
      .returning();
    const job = await this.cvQueue.add(
      'process-cv',
      {
        userId: req.user.id,
        cvId: cv[0].id,
        filename: req.file.originalname,
        fileUrl: signedUrl,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },

        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
    const waitingCount = await this.cvQueue.getWaitingCount();
    if (waitingCount > 100) {
      throw new ServiceUnavailableException('Server is busy, try again later');
    }
    return { cv: cv[0], jobId: job.data.userId };
  }
  async getCvById(cvId: string) {
    const cv = await this.db.query.cv.findFirst({
      where: eq(schema.cv.id, cvId),
    });
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    return cv;
  }
  async getAllCvsForUser(userId: string) {
    if (userId === undefined || userId === null) {
      throw new BadRequestException('User ID is required');
    }
    const cvs = await this.db.query.cv.findMany({
      where: eq(schema.cv.user_id, userId),
    });
    if (cvs.length === 0) {
      throw new NotFoundException('No CVs found for this user');
    }
    return cvs;
  }
  async getAllCvs() {
    const cvs = await this.db.query.cv.findMany();
    if (cvs.length === 0) {
      throw new NotFoundException('No CVs found');
    }
    return cvs;
  }
  async deleteCv(cvId: string, userId: string) {
    const cv = await this.db
      .update(schema.cv)
      .set({ isDeleted: true })
      .where(and(eq(schema.cv.id, cvId), eq(schema.cv.user_id, userId)))
      .returning();
    if (!cv || cv.length === 0) {
      throw new NotFoundException(
        'CV not found or you do not have permission to delete this CV',
      );
    }
    return { message: 'CV deleted successfully', cv: cv[0].isDeleted };
  }
}
