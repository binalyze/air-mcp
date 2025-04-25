import { z } from 'zod';
import { api, CreateAutoAssetTagRequest, AutoAssetTagModifyResponse, UpdateAutoAssetTagRequest, AutoAssetTagResult, ListAutoAssetTagResponse } from '../api/auto-asset-tags/auto-asset-tags';

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

// Schema for list auto asset tags arguments (empty)
export const ListAutoAssetTagsArgsSchema = z.object({});

// Format the response for create display
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

// Format the response for update display
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

// Helper to format a single condition group (recursive)
function formatConditionGroup(group: any, indent = '  '): string {
    if (!group || typeof group !== 'object' || Object.keys(group).length === 0) {
        return `${indent}No conditions defined\n`;
    }
    let output = `${indent}Operator: ${group.operator}\n`;
    output += `${indent}Conditions:\n`;
    group.conditions.forEach((cond: any, index: number) => {
      output += `${indent}  Condition ${index + 1}:\n`;
      if (cond.conditions) { // It's a nested group
        output += formatConditionGroup(cond, indent + '    ');
      } else { // It's a single condition
        output += `${indent}    Field: ${cond.field}\n`;
        output += `${indent}    Operator: ${cond.operator}\n`;
        output += `${indent}    Value: ${cond.value}\n`;
        if (cond.conditionId !== undefined) {
          output += `${indent}    Condition ID: ${cond.conditionId}\n`;
        }
      }
    });
    return output;
  }

// Format the response for list display
function formatListAutoAssetTagsResponse(response: ListAutoAssetTagResponse): string {
    if (!response.result || response.result.entities.length === 0) {
      return 'No auto asset tags found.';
    }
  
    let output = `Found ${response.result.totalEntityCount} auto asset tag(s) (Page ${response.result.currentPage}/${response.result.totalPageCount}):\n\n`;
  
    response.result.entities.forEach(tag => {
      output += `----------------------------------------\n`;
      output += `Tag: ${tag.tag}\n`;
      output += `ID: ${tag._id}\n`;
      output += `Created At: ${new Date(tag.createdAt).toLocaleString()}\n`;
      output += `Updated At: ${new Date(tag.updatedAt).toLocaleString()}\n`;
      output += `Linux Conditions:\n`;
      output += formatConditionGroup(tag.linuxConditions, '  ');
      output += `Windows Conditions:\n`;
      output += formatConditionGroup(tag.windowsConditions, '  ');
      output += `macOS Conditions:\n`;
      output += formatConditionGroup(tag.macosConditions, '  ');
      output += `----------------------------------------\n\n`;
    });
  
    return output;
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
  },

  /**
   * Updates an existing Auto Asset Tag rule.
   */
  async updateAutoAssetTag(args: z.infer<typeof UpdateAutoAssetTagArgsSchema>) {
    try {
      const { id, ...updateData } = args;
      
      // Create the request data, ensuring we have non-null condition objects if provided, 
      // otherwise they should be omitted from the PUT request if not being updated.
      const requestData: Partial<UpdateAutoAssetTagRequest> = {
        tag: updateData.tag,
      };
      if (updateData.linuxConditions) requestData.linuxConditions = updateData.linuxConditions;
      if (updateData.windowsConditions) requestData.windowsConditions = updateData.windowsConditions;
      if (updateData.macosConditions) requestData.macosConditions = updateData.macosConditions;
      
      const response = await api.updateAutoAssetTag(id, requestData as UpdateAutoAssetTagRequest); // Cast needed due to partial construction

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
  },

  /**
   * Lists all Auto Asset Tag rules.
   */
  async listAutoAssetTags(args: z.infer<typeof ListAutoAssetTagsArgsSchema>) {
    try {
        // Args are currently empty for list, but passed for consistency
        const response = await api.listAutoAssetTags();

        if (response.success && response.result) {
            return {
              content: [
                {
                  type: 'text',
                  text: formatListAutoAssetTagsResponse(response)
                }
              ]
            };
          } else {
            return {
              content: [
                {
                  type: 'text',
                  text: `Error listing auto asset tags: ${response.errors.join(', ')} (Status Code: ${response.statusCode})`
                }
              ]
            };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error during list auto asset tags operation';
          return {
            content: [
              {
                type: 'text',
                text: `Failed to list auto asset tags: ${errorMessage}`
              }
            ]
          };
        }
      }
};
