import { z } from 'zod';
import { api, TriageRule } from '../api/triages/triages';

// Schema for list triage rules arguments
export const ListTriageRulesArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter triage rules by. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
});

// Format triage rule for display
function formatTriageRule(rule: TriageRule): string {
  return `
Rule: ${rule.description} (${rule._id})
Engine: ${rule.engine}
Search In: ${rule.searchIn}
Created by: ${rule.createdBy}
Created at: ${new Date(rule.createdAt).toLocaleString()}
Deletable: ${rule.deletable ? 'Yes' : 'No'}
`;
}

export const triageTools = {
  // List all triage rules
  async listTriageRules(args: z.infer<typeof ListTriageRulesArgsSchema>) {
    try {
      const orgIds = args.organizationIds === undefined || args.organizationIds === "" 
        ? "0" 
        : args.organizationIds;
      
      const response = await api.getTriageRules(orgIds);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching triage rules: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const rulesList = response.result.entities.map(rule => 
        `${rule._id}: ${rule.description} (Engine: ${rule.engine}, Search In: ${rule.searchIn})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} triage rules:\n${rulesList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch triage rules: ${errorMessage}`
          }
        ]
      };
    }
  },
}; 