import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
// import { CronExpression } from 'cron';
import { SqsConsumerService } from './sqs-consumer.service';

@Injectable()
export class SqsMessageConsumerCronJob {
  constructor(private readonly sqsService: SqsConsumerService) {}

  @Cron(process.env.CRON_EXPRESSION)
  async handleCron() {
    try {
      console.log('Starting SQS message consumption...');
      await this.sqsService.consumeSqsMessages();
      console.log('Finished SQS message consumption.');
    } catch (error) {
      console.error('Error occurred during SQS message consumption:', error);
    }
  }
}
