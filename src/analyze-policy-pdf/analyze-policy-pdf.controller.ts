import { Controller, Get, Query, Req } from '@nestjs/common';
import { AnalyzePolicyPdfService } from './analyze-policy-pdf.service';

@Controller('analyze-policy-pdfs')
export class AnalyzePolicyPdfController {
  constructor(
    private readonly analyzePolicyPdfService: AnalyzePolicyPdfService,
  ) {}

  @Get()
  async analyzePolicyPDFs(): Promise<string[]> {
    return this.analyzePolicyPdfService.analyzePolicyPDFs();
  }
  @Get('check-run-status')
  // @UseGuards(AuthGuard('jwt'))
  async checkRunStatus(
    @Req() req,
    @Query('runId') runId: string,
    @Query('threadId') threadId: string,
  ): Promise<any[]> {
    return this.analyzePolicyPdfService.fetchRunId(runId, threadId);
  }
}
