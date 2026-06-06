import { Module } from '@nestjs/common';
import { GroqService } from './groq.service';

@Module({
  imports: [],
  providers: [GroqService],
  controllers: [],
})
export class GroqModule {}
