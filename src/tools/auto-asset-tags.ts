import { z } from 'zod';
import { api, CreateAutoAssetTagRequest, CreateAutoAssetTagResponse, UpdateAutoAssetTagRequest, UpdateAutoAssetTagResponse, Condition, ConditionGroup, AutoAssetTagResult } from '../api/auto-asset-tags/auto-asset-tags';

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

// Schema for update auto asset tag arguments
export const UpdateAutoAssetTagArgsSchema = z.object({
  id: z.string().min(1, 'Auto asset tag ID cannot be empty.').describe('The ID of the auto asset tag to update'),
  tag: z.string().min(1, 'Tag name cannot be empty.').describe('The tag name to be applied automatically'),
  linuxConditions: ConditionGroupSchema.optional().describe('Conditions for Linux assets'),
  windowsConditions: ConditionGroupSchema.optional().describe('Conditions for Windows assets'),
  macosConditions: ConditionGroupSchema.optional().describe('Conditions for macOS assets'),
});

// Format the response for display
function formatAutoAssetTagResponse(response: AutoAssetTagResult): string {
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

// Format the update response for display
function formatUpdateAutoAssetTagResponse(response: AutoAssetTagResult): string {
  return `
Successfully updated auto asset tag:
Tag: ${response.tag}
ID: ${response._id}
Created At: ${new Date(response.createdAt).toLocaleString()}
Updated At: ${new Date(response.updatedAt).toLocaleString()}
Condition ID Counter: ${response.conditionIdCounter}
`;
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
              text: formatAutoAssetTagResponse(response.result)
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
  },

  /**
   * Updates an existing Auto Asset Tag rule.
   */
  async updateAutoAssetTag(args: z.infer<typeof UpdateAutoAssetTagArgsSchema>) {
    try {
      const { id, ...updateData } = args;
      
      // Create the request data, ensuring we have empty objects for any missing conditions
      const requestData: UpdateAutoAssetTagRequest = {
        tag: updateData.tag,
        linuxConditions: updateData.linuxConditions || { operator: 'and', conditions: [] },
        windowsConditions: updateData.windowsConditions || { operator: 'and', conditions: [] },
        macosConditions: updateData.macosConditions || { operator: 'and', conditions: [] }
      };
      
      const response = await api.updateAutoAssetTag(id, requestData);

      if (response.success && response.result) {
        return {
          content: [
            {
              type: 'text', 
              text: formatUpdateAutoAssetTagResponse(response.result)
            }
          ]
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating auto asset tag: ${response.errors.join(', ')} (Status Code: ${response.statusCode})`
            }
          ]
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during update auto asset tag operation';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update auto asset tag: ${errorMessage}`
          }
        ]
      };
    }
  }
};
