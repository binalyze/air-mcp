import { z } from 'zod';
import { api, CreateAutoAssetTagRequest, CreateAutoAssetTagResponse, Condition, ConditionGroup, AutoAssetTagResult } from '../api/auto-asset-tags/auto-asset-tags';

// Base schema for a single condition
const BaseConditionSchema = z.object({
  field: z.string().describe('The field to check (e.g., "process", "registryKey")'),
  operator: z.string().describe('The comparison operator (e.g., "running", "exists")'),
  value: z.string().describe('The value to compare against'),
});

type ConditionGroupInput = {
  operator: 'and' | 'or';
  conditions: (z.infer<typeof BaseConditionSchema> | ConditionGroupInput)[];
};

const ConditionGroupSchema: z.ZodType<ConditionGroupInput> = z.lazy(() =>
  z.object({
    operator: z.enum(['and', 'or']).describe('Logical operator for combining conditions in this group'),
    conditions: z.array(
      z.union([
        BaseConditionSchema,
        ConditionGroupSchema // Recursive reference
      ])
    ).min(1, 'A condition group must have at least one condition.').describe('Array of conditions or nested condition groups'),
  })
);

// Schema for create auto asset tag arguments
export const CreateAutoAssetTagArgsSchema = z.object({
  tag: z.string().min(1, 'Tag name cannot be empty.').describe('The tag name to be applied automatically'),
  linuxConditions: ConditionGroupSchema.describe('Conditions for Linux assets'),
  windowsConditions: ConditionGroupSchema.describe('Conditions for Windows assets'),
  macosConditions: ConditionGroupSchema.describe('Conditions for macOS assets'),
});

// Format the response for display
function formatCreateAutoAssetTagResponse(response: AutoAssetTagResult): string {
  // Basic formatting, could be enhanced to show conditions structure
  return `
Successfully created auto asset tag:
Tag: ${response.tag}
ID: ${response._id}
Created At: ${new Date(response.createdAt).toLocaleString()}
Updated At: ${new Date(response.updatedAt).toLocaleString()}
Condition ID Counter: ${response.conditionIdCounter}
`;
// Add detailed conditions formatting if needed
}

export const autoAssetTagTools = {
  /**
   * Creates a new Auto Asset Tag rule.
   */
  async createAutoAssetTag(args: z.infer<typeof CreateAutoAssetTagArgsSchema>) {
    try {
      // The args structure directly matches the CreateAutoAssetTagRequest structure
      const requestData: CreateAutoAssetTagRequest = args;
      
      const response = await api.createAutoAssetTag(requestData);

      if (response.success && response.result) {
        return {
          content: [
            {
              type: 'text', 
              text: formatCreateAutoAssetTagResponse(response.result)
            }
          ]
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating auto asset tag: ${response.errors.join(', ')} (Status Code: ${response.statusCode})`
            }
          ]
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during create auto asset tag operation';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to create auto asset tag: ${errorMessage}`
          }
        ]
      };
    }
  }
};
