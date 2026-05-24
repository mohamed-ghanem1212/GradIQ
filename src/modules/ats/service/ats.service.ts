import { DB_PROVIDER } from '@db/provider/db.provider';
import { Processor } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../db/schema';
import { CvService } from '@modules/cv/service/cv.service';
import { downLoadFile } from '@modules/cv/pipeline/downloadFile.pipeline';
import { analyzeFile } from '@modules/cv/pipeline/analyzeFile.pipeline';
import { GroqService } from '../groq-ai/groq.service';
@Injectable()
@Processor('cv-processing')
export class AtsService {
  private logger = new Logger(AtsService.name);
  constructor(
    @Inject(DB_PROVIDER) private db: NodePgDatabase<typeof schema>,
    private readonly cvService: CvService,
    private readonly groqService: GroqService,
  ) {}

  async processCv(job: any) {
    const { userId, cvId, filename } = job.data;

    const cv = await this.cvService.getCvById(cvId);
    this.logger.log(
      `Processing CV ${cvId} for user ${userId} with filename ${filename}`,
    );
    const tempPath = await downLoadFile(cv.file_path);
    if (!tempPath) {
      this.logger.error(`Failed to download CV file from ${cv.file_path}`);
      throw new Error('Failed to download CV file');
    }
    this.logger.log(`Successfully downloaded CV file to ${tempPath}`);
    const textResult = await analyzeFile(tempPath);
    if (!textResult) {
      this.logger.error(`Failed to analyze CV file at ${tempPath}`);
      throw new Error('Failed to analyze CV file');
    }
    this.logger.log(
      `Successfully analyzed CV file at ${tempPath} with result: ${JSON.stringify(textResult)}`,
    );
    const analysis = await this.groqService.analyzeWithAI(textResult);
    if (!analysis) {
      this.logger.error(`Failed to analyze CV with AI for file at ${tempPath}`);
      throw new Error('Failed to analyze CV with AI');
    }
    this.logger.log(
      `Successfully analyzed CV with AI for file at ${tempPath} with feedback: ${JSON.stringify(analysis)}`,
    );
    const ats = await this.db
      .insert(schema.ats)
      .values({
        userId,
        cv_id: cvId,
        score: analysis.score,
        suggestions: analysis.suggestions.join(', '),
        vulnerabilities: analysis.weaknesses.join(', '),
      })
      .returning();
    return ats[0];
  }
}
