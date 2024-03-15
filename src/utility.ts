import { Resource, ResourceType } from './constant';

export function extractResources(
  data: any,
  resourceType: ResourceType,
): Resource[] {
  if (!data || !data.entry) {
    return [];
  }

  return data.entry
    .filter((entry) => entry.resource.resourceType === resourceType)
    .map((entry) => ({
      ...entry.resource,
      resourceType: resourceType,
    }));
}
