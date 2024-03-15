export const jwtConstants = {
  secret: 'secretKey',
};

export type ResourceType = 'Patient' | 'Observation' | 'DiagnosticReport';

export interface Resource {
  resourceType: ResourceType;
  id?: string;
  [key: string]: any;
}
