import { Controller, Get, Param } from '@nestjs/common';
import { AtsService } from '../service/ats.service';
import { ApiParam } from '@nestjs/swagger';

@Controller('ats')
export class AtsController {
  constructor(private readonly atsService: AtsService) {}

  @Get(':cvId')
  @ApiParam({
    name: 'cvId',
    type: 'string',
    description: 'ID of the CV to analyze',
  })
  async analyzeCv(@Param('cvId') cvId: string) {
    return {
      ats: await this.atsService.getAtsByCvId(cvId),
      message: 'CV analysis retrieved successfully',
    };
  }
}
