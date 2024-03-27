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

@Controller('analyze-policy-pdfs')
export class AnalyzePolicyPdfController {
  constructor(
    private readonly analyzePolicyPdfService: AnalyzePolicyPdfService,
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
}
