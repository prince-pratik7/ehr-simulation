// import { PolicyReviewDTO } from './policy-review.dto'; // Import the DTO
// import { AnalyzeResponse } from './analyze-response.entity'; // Import the entity (replace with your actual entity file)
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// // ...

// @Injectable()
// export class YourService {
//   constructor(
//     @InjectRepository(AnalyzeResponse)
//     private readonly analyzeResponseRepository: Repository<AnalyzeResponse>,
//   ) {}

//   async saveResponse(responses: any[]): Promise<void> {
//     for (const responseItem of responses) {
//       // Assuming each response item has a structure similar to the one provided
//       const messages = responseItem.body.data.filter(
//         (m) => m.role === 'assistant',
//       );

//       for (const message of messages) {
//         if (message.content && message.content.length > 0) {
//           const policyReviewDto = new PolicyReviewDTO();
//           policyReviewDto.threadId = message.thread_id;
//           policyReviewDto.runId = message.run_id;
//           policyReviewDto.assistantId = message.assistant_id;
//           policyReviewDto.createdAt = new Date(message.created_at * 1000); // Convert Unix timestamp to Date
//           policyReviewDto.policyContent = message.content[0].text.value; // Save the policy content

//           // ... Set other fields from the message content ...

//           const analyzeResponse = new AnalyzeResponse();
//           // Map DTO to entity
//           analyzeResponse.threadId = policyReviewDto.threadId;
//           analyzeResponse.runId = policyReviewDto.runId;
//           analyzeResponse.assistantId = policyReviewDto.assistantId;
//           analyzeResponse.createdAt = policyReviewDto.createdAt;
//           analyzeResponse.policyContent = policyReviewDto.policyContent;
//           // ... Map the rest of the policyReviewDto fields to analyzeResponse ...

//           await this.analyzeResponseRepository.save(analyzeResponse);
//         }
//       }
//     }
//   }
// }
