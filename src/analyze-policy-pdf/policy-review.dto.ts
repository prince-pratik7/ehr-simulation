import { IsString, IsInt, IsOptional, IsDate, IsEnum } from 'class-validator';

enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

class PolicyRatingDTO {
  @IsString()
  attribute: string;

  @IsInt()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  ratingJustification?: string;
}

export class PolicyReviewDTO {
  @IsString()
  threadId: string;

  @IsString()
  runId: string;

  @IsString()
  assistantId: string;

  @IsEnum(Status)
  status: Status;

  @IsDate()
  createdAt: Date;

  @IsString()
  createdBy: string;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  // The rest of the policy specific fields
  @IsString()
  policyId: string;

  @IsString()
  policyName: string;

  @IsString()
  effectiveDate: string;

  @IsString()
  revisionDate: string;

  @IsString()
  reviewDate: string;

  @IsString()
  overallRating: string;

  @IsString()
  summary: string;

  @IsString()
  pros: string;

  @IsString()
  cons: string;

  @IsString({ each: true })
  ratings: PolicyRatingDTO[];
}
