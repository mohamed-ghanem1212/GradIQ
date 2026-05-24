import { Job } from 'bullmq';
import { AtsService } from '../service/ats.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@Processor('cv-processing')
export class AtsProcessor extends WorkerHost {
  private logger = new Logger(AtsProcessor.name);

  constructor(private readonly atsService: AtsService) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing job ${job.id}`);
    this.logger.log(`Processing job ${job.data.filename}`);

    try {
      await this.atsService.processCv(job);
    } catch (error: any) {
      this.logger.error(`Job ${job.id} failed: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }
}
