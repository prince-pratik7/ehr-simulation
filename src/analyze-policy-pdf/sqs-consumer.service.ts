import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AnalyzePolicyPdfService } from './analyze-policy-pdf.service';

@Injectable()
export class SqsConsumerService {
  private sqs: AWS.SQS;
  private processedRequests: any[];
  private queueUrl: string;

  constructor(
    private readonly analyzePolicyPdfService: AnalyzePolicyPdfService,
  ) {
    this.sqs = new AWS.SQS({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    this.processedRequests = [];
    this.queueUrl = process.env.SQS_QUEUE_URL;
  }

  async consumeSqsMessages() {
    const params = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 10, // Adjust as needed
      VisibilityTimeout: 30, // Adjust as needed
      WaitTimeSeconds: 20, // Adjust as needed
    };

    try {
      const data = await this.sqs.receiveMessage(params).promise();

      if (data.Messages && data.Messages.length > 0) {
        for (const message of data.Messages) {
          const messageBody = JSON.parse(message.Body);

          const runId = messageBody.runId;
          const threadId = messageBody.threadId;

          try {
            const response = await this.analyzePolicyPdfService.fetchRunId(
              runId,
              threadId,
            );
            console.log(
              `Request fetched successfully - Thread ID: ${threadId}, Run ID: ${runId}`,
            );
            this.processedRequests.push(response);
          } catch (error) {
            console.error(
              `Error fetching request - Thread ID: ${threadId}, Run ID: ${runId}`,
            );
          }

          // Delete the message from the queue after processing
          await this.deleteMessageFromQueue(
            this.queueUrl,
            message.ReceiptHandle,
          );
        }
      }
    } catch (error) {
      console.error('Error consuming SQS messages:', error);
    }
  }

  async deleteMessageFromQueue(queueUrl: string, receiptHandle: string) {
    const deleteParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    };

    await this.sqs.deleteMessage(deleteParams).promise();
  }
}
