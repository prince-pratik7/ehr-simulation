import { Injectable, BadRequestException } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import { instructionPrompt } from 'src/constant';
import { UploadedFile } from './file.interface';
// import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import * as AWS from 'aws-sdk';
// import { AnalyzeResponse } from './entities/analyze-response.entity'; // Assuming you have an entity for responses

@Injectable()
export class AnalyzePolicyPdfService {
  private readonly CHATGPT_API_ENDPOINT =
    'https://api.openai.com/v1/engines/davinci/completions';
  private openai: OpenAI;

  async analyzePolicyPDFs(): Promise<any[]> {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    // const headers = {
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${openaiApiKey}`,
    // };
    // const body = JSON.stringify({
    //   // model: 'gpt-3.5-turbo',
    //   // model: 'gpt-4-0125-preview',
    //   model: 'gpt-4-0613',

    //   messages: [
    //     // {
    //     //   role: 'system',
    //     //   content:
    //     //     'You are a poetic assistant, skilled in explaining complex programming concepts with creative flair.',
    //     // },
    //     {
    //       role: 'user',
    //       content:
    //         'Compose a poem that explains the concept of recursion in programming',
    //     },
    //   ],
    // });

    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers,
    //   body,
    // });

    // return response.json();

    const filename =
      'src/analyze-policy-pdf/policy-pdfs/Bariatric Surgery_Humana.pdf';
    // const filename =
    //   'src/analyze-policy-pdf/policy-pdfs/PRV_Bariatric_Surgery_BCBSCA.pdf';
    const openai = new OpenAI();
    const file = await openai.files.create({
      file: fs.createReadStream(filename),
      purpose: 'assistants',
    });
    console.log(file);

    // Create Assistant only for the first time
    // const myAssistant = await openai.beta.assistants.create({
    //   instructions: instructionPrompt,
    //   name: 'Policy Reviewer',
    //   // tools: [{ type: 'code_interpreter' }],
    //   tools: [{ type: 'retrieval' }],
    //   model: 'gpt-4-turbo-preview',
    //   // model: 'gpt-3.5-turbo',
    // });

    // console.log(myAssistant);

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: instructionPrompt,
          file_ids: [file.id],
        },
      ],
    });
    console.log(thread);

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID || '',
    });

    console.log(run);
    return [run];
  }

  // async analyzePolicyMultiplePDFs(files: Express.Multer.File[]): Promise<void> {
  //   const openaiApiKey = process.env.OPENAI_API_KEY;
  //   const openai = new OpenAI();

  //   for (const file of files) {
  //     const fileData = fs.readFileSync(file.path);
  //     const uploadedFile = await openai.files.create({
  //       file: fileData,
  //       purpose: 'assistants',
  //     });

  //     const thread = await openai.beta.threads.create({
  //       messages: [
  //         {
  //           role: 'user',
  //           content: instructionPrompt,
  //           file_ids: [uploadedFile.id],
  //         },
  //       ],
  //     });

  //     const run = await openai.beta.threads.runs.create(thread.id, {
  //       assistant_id: process.env.OPENAI_ASSISTANT_ID,
  //     });

  //     console.log('####Run', run);

  //     // await this.saveResponse(run);
  //     // await this.pushToSQS(run);
  //   }

  //   // Clean up uploaded files (if necessary)
  //   // for (const file of files) {
  //   //   fs.unlinkSync(file.path);
  //   // }
  // }

  async analyzePolicyMultiplePDFs(files: UploadedFile[]): Promise<void> {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const openai = new OpenAI();

    // Create an assistant. Not required anymore.
    // const myAssistant = await openai.beta.assistants.create({
    //   instructions: instructionPrompt,
    //   name: 'Policy Reviewer',
    //   // tools: [{ type: 'code_interpreter' }],
    //   tools: [{ type: 'retrieval' }],
    //   model: 'gpt-4-turbo-preview',
    //   // model: 'gpt-3.5-turbo',
    // });

    // console.log(myAssistant);

    for (const file of files) {
      // const fileStream = fs.createReadStream(file.buffer);

      // Validate file type
      if (path.extname(file.originalname).toLowerCase() !== '.pdf') {
        throw new BadRequestException('Only PDF files are allowed.');
      }

      // Create a temporary file path
      const tempFilePath = path.join(os.tmpdir(), file.originalname);

      // Write the buffer to the temporary file
      fs.writeFileSync(tempFilePath, file.buffer);

      // Create a read stream from the temporary file
      const fileStream = fs.createReadStream(tempFilePath);

      const uploadedFile = await openai.files.create({
        file: fileStream,
        purpose: 'assistants',
      });

      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: 'user',
            content: instructionPrompt,
            file_ids: [uploadedFile.id],
          },
        ],
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: process.env.OPENAI_ASSISTANT_ID!,
      });

      // Add logic here to save the response to the database or push it to SQS
      // await this.saveResponse(run);
      await this.pushToSQS(run);

      // For now, I'm just logging the response
      console.log('Response:', run);
    }

    // Clean up uploaded files (if necessary)
    // for (const file of files) {
    //   fs.unlinkSync(file.path);
    // }
  }

  // async saveResponse(response: any): Promise<void> {
  //   const analyzeResponse = new AnalyzeResponse();
  //   analyzeResponse.response = response;
  //   await this.analyzeResponseRepository.save(analyzeResponse);
  // }

  async pushToSQS(response: any): Promise<void> {
    console.log('pushtosqs start');
    const sqs = new AWS.SQS({
      region: process.env.AWS_REGION || 'your-region',
    });
    const queueUrl = process.env.SQS_QUEUE_URL || 'your-sqs-queue-url';

    const params = {
      MessageBody: JSON.stringify(response),
      QueueUrl: queueUrl,
    };

    const awsresponse = await sqs.sendMessage(params).promise();
    console.log('pushtosqs end', awsresponse);
  }

  async fetchRunId(runId: string, threadId: string): Promise<any[]> {
    const openai = new OpenAI();
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);

    console.log(run);

    if (run.status === 'completed') {
      const messages: any = await openai.beta.threads.messages.list(
        run.thread_id,
      );
      for (const message of messages.data.reverse()) {
        console.log(`${message.role} > ${message.content[0].text.value}`);
      }
      return [messages];
    } else {
      console.log(run.status);
      return [run];
    }
  }
}
