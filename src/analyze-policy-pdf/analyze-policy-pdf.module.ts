// src/analyze-pdf/analyze-pdf.module.ts
import { Module } from '@nestjs/common';
import { AnalyzePolicyPdfController } from './analyze-policy-pdf.controller';
import { AnalyzePolicyPdfService } from './analyze-policy-pdf.service';

@Module({
  controllers: [AnalyzePolicyPdfController],
  providers: [AnalyzePolicyPdfService],
})
export class AnalyzePolicyPdfModule {}
