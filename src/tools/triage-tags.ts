import { z } from 'zod';
import { api, TriageTag } from '../api/triages/tags/tags';

// Schema for list triage tags arguments
export const ListTriageTagsArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter triage tags by. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
  withCount: z.boolean().optional().describe('Whether to include count of rules for each tag. Defaults to true.'),
});

export const CreateTriageTagArgsSchema = z.object({
  name: z.string().describe('Name of the tag to create'),
  organizationId: z.union([
    z.string(),
    z.number()
  ]).optional().describe('Organization ID to associate the tag with. Defaults to 0.'),
});

// Format triage tag for display
function formatTriageTag(tag: TriageTag): string {
  if (tag.count !== undefined) {
    return `${tag._id}: ${tag.name} (Used in ${tag.count} rules)`;
  }
  return `${tag._id}: ${tag.name}`;
}

export const triageTagTools = {
  // List all triage tags
  async listTriageTags(args: z.infer<typeof ListTriageTagsArgsSchema>) {
    try {
      const orgIds = args.organizationIds === undefined || args.organizationIds === "" 
        ? "0" 
        : args.organizationIds;
      
      const withCount = args.withCount === undefined ? true : args.withCount;
      
      const response = await api.getTriageTags(orgIds, withCount);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching triage tags: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const tagsList = response.result.entities.map(tag => formatTriageTag(tag)).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} triage tags:\n${tagsList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch triage tags: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Create a new triage tag
  async createTriageTag(args: z.infer<typeof CreateTriageTagArgsSchema>) {
    try {
      const orgId = args.organizationId === undefined ? 0 : args.organizationId;
      
      const success = await api.createTriageTag(args.name, orgId);
      
      if (success) {
        return {
          content: [
            {
              type: 'text',
              text: `Successfully created triage tag "${args.name}"`
            }
          ]
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to create triage tag: Unknown error`
            }
          ]
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to create triage tag: ${errorMessage}`
          }
        ]
      };
    }
  },
};
