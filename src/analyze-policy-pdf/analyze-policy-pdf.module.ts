import { Module } from '@nestjs/common';
import { AnalyzePolicyPdfController } from './analyze-policy-pdf.controller';
import { AnalyzePolicyPdfService } from './analyze-policy-pdf.service';
import { SqsMessageConsumerCronJob } from './cron.jobs';
import { SqsConsumerService } from './sqs-consumer.service';

@Module({
  controllers: [AnalyzePolicyPdfController],
  providers: [
    AnalyzePolicyPdfService,
    SqsMessageConsumerCronJob,
    SqsConsumerService,
  ],
})
export class AnalyzePolicyPdfModule {}
