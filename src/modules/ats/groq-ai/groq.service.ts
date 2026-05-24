import Groq from 'groq-sdk';
import { config } from '../../../config/config.singleton';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GroqService {
  private logger = new Logger(GroqService.name);
  analyzeWithAI = async (cvText: string) => {
    const client = new Groq({
      apiKey: config.groq.apiKey, // This is the default and can be omitted
    });
    this.logger.log('Sending CV to Groq AI for analysis');
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an ATS (Applicant Tracking System) expert. 
            Analyze the given CV and return structured feedback in JSON format with:
            - score: number from 0 to 100
            - strengths: string[]
            - weaknesses: string[]
            - suggestions: string[]
            - missingKeywords: string[]
            Return JSON only, no extra text.`,
        },
        {
          role: 'user',
          content: cvText,
        },
      ],
    });
    const raw = response.choices[0].message.content;
    try {
      const feedback = JSON.parse(raw);
      return feedback;
    } catch (error) {
      console.error(
        'Failed to parse AI response:',
        error,
        'Raw response:',
        raw,
      );
      throw new Error('Failed to analyze CV with AI');
    }
  };
}
