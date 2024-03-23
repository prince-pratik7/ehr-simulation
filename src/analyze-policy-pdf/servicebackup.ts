import { Injectable } from '@nestjs/common';
import axios from 'axios';
// import OpenAI from 'openai';
import OpenAI, { ClientOptions } from 'openai';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { instructionPrompt } from 'src/constant';
// import openai from 'openai';

@Injectable()
export class AnalyzePolicyPdfService {
  private readonly CHATGPT_API_ENDPOINT =
    'https://api.openai.com/v1/engines/davinci/completions';
  private readonly pdfFiles = ['pdf1.pdf', 'pdf2.pdf', 'pdf3.pdf']; // Add more PDF filenames
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

    const filenames = [
      'src/analyze-policy-pdf/policy-pdfs/Bariatric Surgery_Humana.pdf',
      'src/analyze-policy-pdf/policy-pdfs/PRV_Bariatric_Surgery_BCBSCA.pdf',
    ];
    const openai = new OpenAI();
    let files = [];

    for (let i = 0; i < filenames.length; i++) {
      const filename = filenames[i];
      const file = await openai.files.create({
        file: fs.createReadStream(filename),
        purpose: 'assistants',
      });
      console.log('file:', file);
      files.push(file);
    }

    console.log('files:', files);

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: instructionPrompt,
          file_ids: files.map((file) => file.id),
        },
      ],
    });
    console.log(thread);

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_3X5Bb4MN3diiZmD654w0jq6X', // TODO: Put in environment variable or constants
    });

    console.log(run);

    return [run];

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
