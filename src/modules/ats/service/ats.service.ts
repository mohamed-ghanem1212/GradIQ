import { DB_PROVIDER } from '@db/provider/db.provider';
import { Processor } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../db/schema';
import { config } from '../../../config/config.singleton';
import { downLoadFile } from '@modules/cv/pipeline/downloadFile.pipeline';
import { analyzeFile } from '@modules/cv/pipeline/analyzeFile.pipeline';
import { GroqService } from '../groq-ai/groq.service';
import * as fs from 'fs';
import { eq } from 'drizzle-orm';
import { log } from 'console';
@Injectable()
export class AtsService {
  private logger = new Logger(AtsService.name);
  constructor(
    @Inject(DB_PROVIDER) private db: NodePgDatabase<typeof schema>,

    private readonly groqService: GroqService,
  ) {}

  async processCv(job: any) {
    let tmpPath: string;
    this.logger.log(
      `Starting CV processing for job ${job.id} with data: ${JSON.stringify(job.data)}`,
    );
    const { userId, cvId, fileUrl } = job.data;
    try {
      // fetch cv directly from DB — no need for CvService
      const [cv] = await this.db
        .select()
        .from(schema.cv)
        .where(eq(schema.cv.id, cvId));

      if (!cv) throw new Error(`CV ${cvId} not found`);

      // download
      tmpPath = await downLoadFile(fileUrl);
      this.logger.log(`Downloaded CV file to ${tmpPath}`);

      // extract text
      const text = await analyzeFile(tmpPath);
      this.logger.log(`Extracted text from CV file`);

      // analyze with Groq
      const analysis = await this.groqService.analyzeWithAI(text);
      this.logger.log(`Groq analysis complete`);

      // save all fields to DB
      const [ats] = await this.db
        .insert(schema.ats)
        .values({
          userId,
          cv_id: cvId,
          score: analysis.score.toString(),
          suggestions: analysis.suggestions,
          vulnerabilities: analysis.vulnerabilities,
          missingKeywords: analysis.missingKeywords,
          relevantKeywords: analysis.strengths,
        })
        .returning();
      if (!ats) throw new Error('Failed to save ATS results to DB');

      return ats;
    } finally {
      if (tmpPath && fs.existsSync(tmpPath)) {
        await fs.promises.unlink(tmpPath);
      }
    }
  }

  // endpoint to fetch results
  async getAtsByCvId(cvId: string) {
    const ats = await this.db.query.ats.findFirst({
      where: eq(schema.ats.cv_id, cvId),
      with: {
        cv: {
          columns: {
            id: true,
            title: true,
          },
        },
        user: {
          columns: {
            id: true,
            username: true,
            accountType: true,
            role: true,
            position: true,
          },
        },
      },
    });
    if (parseFloat(ats.score) >= 90) {
      this.logger.log(`CV ${cvId} scored ${ats.score} - excellent fit!`);
      const fecthedJobs = await fetch(
        `https://remotive.com/api/remote-jobs?category=software-dev&search=${ats.cv.title}&limit=5`,
      );
      if (!fecthedJobs.ok) {
        this.logger.error(
          `Failed to fetch jobs from Adzuna: ${fecthedJobs.statusText}`,
        );
        throw new Error('Failed to fetch jobs from Adzuna');
      }
      const jobsData = await fecthedJobs.json();
      return { ats, jobsData };
    }
    return ats;
  }
}
