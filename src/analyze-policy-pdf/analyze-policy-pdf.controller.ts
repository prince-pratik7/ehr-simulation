import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnalyzePolicyPdfService } from './analyze-policy-pdf.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from './file.interface';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SqsMessageConsumerCronJob } from './cron.jobs';

@ApiTags('Analyze Policies')
@Controller({ path: 'analyze-policy-pdfs', version: '1' })
export class AnalyzePolicyPdfController {
  constructor(
    private readonly analyzePolicyPdfService: AnalyzePolicyPdfService,
    private readonly sqsMessageConsumerCronJob: SqsMessageConsumerCronJob,
  ) {}

  @Get()
  async analyzePolicyPDFs(): Promise<string[]> {
    return this.analyzePolicyPdfService.analyzePolicyPDFs();
  }

  // @Post('multiple-pdfs')
  // @UseInterceptors(FilesInterceptor('files'))
  // async analyzePolicMultiplePDFs(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  // ): Promise<string[]> {
  //   return await this.analyzePolicyPdfService.analyzePolicyMultiplePDFs(files);
  // }

  @Post('multiple-pdfs')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async analyzePolicyMultiplePDFs(
    @UploadedFiles() files: UploadedFile[],
  ): Promise<void> {
    console.log('in controller');
    return await this.analyzePolicyPdfService.analyzePolicyMultiplePDFs(files);
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

  @Get('start-cron-job')
  async startCronJob(): Promise<void> {
    return this.sqsMessageConsumerCronJob.handleCron();
  }
}
