import { Controller, Get, Param } from '@nestjs/common';
import { AtsService } from '../service/ats.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('ATS')
@Controller('ats')
export class AtsController {
  constructor(private readonly atsService: AtsService) {}

  @Get(':cvId')
  @ApiOperation({
    summary: 'Get ATS analysis for a CV',
    description:
      'Returns ATS score and feedback. When the score is 90% or higher, includes remote job recommendations matched to the user role.',
  })
  @ApiParam({
    name: 'cvId',
    type: 'string',
    description: 'ID of the CV to analyze',
  })
  async analyzeCv(@Param('cvId') cvId: string) {
    const result = await this.atsService.getAtsByCvId(cvId);
    return {
      ...result,
      message:
        result.message ?? 'CV analysis retrieved successfully',
    };
  }
}
