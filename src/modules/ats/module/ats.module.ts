import { Module } from '@nestjs/common';
import { AtsService } from '../service/ats.service';
import { AtsController } from '../controller/ats.controller';
import { AtsProcessor } from '../processor/ats.processor';
import { GroqModule } from '../groq-ai/groq.module';
import { BullModule } from '@nestjs/bullmq';
import { GroqService } from '../groq-ai/groq.service';

@Module({
  imports: [GroqModule, BullModule.registerQueue({ name: 'cv-processing' })],
  controllers: [AtsController],
  providers: [AtsService, AtsProcessor, GroqService], // ← clean, no foreign services
})
export class AtsModule {}
