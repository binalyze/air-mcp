import { z } from 'zod';
import { api, TriageRule } from '../api/triages/triages';

// Schema for list triage rules arguments
export const ListTriageRulesArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter triage rules by. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
});

// Schema for create triage rule arguments
export const CreateTriageRuleArgsSchema = z.object({
  description: z.string().describe('A descriptive name for the triage rule'),
  rule: z.string().describe('The YARA rule content'),
  searchIn: z.string().describe('Where to search, e.g., "filesystem"'),
  engine: z.string().describe('Rule engine to use, e.g., "yara"'),
  organizationIds: z.array(z.union([z.string(), z.number()])).default([0])
    .describe('Organization IDs to associate with this rule. Defaults to [0]'),
});

export const UpdateTriageRuleArgsSchema = z.object({
  id: z.string().describe('ID of the triage rule to update'),
  description: z.string().describe('A descriptive name for the triage rule'),
  rule: z.string().describe('The YARA rule content'),
  searchIn: z.string().describe('Where to search, e.g., "filesystem"'),
  organizationIds: z.array(z.union([z.string(), z.number()])).default([0])
    .describe('Organization IDs to associate with this rule. Defaults to [0]'),
});

export const DeleteTriageRuleArgsSchema = z.object({
  id: z.string().describe('ID of the triage rule to delete'),
});

export const GetTriageRuleByIdArgsSchema = z.object({
  id: z.string().describe('ID of the triage rule to retrieve'),
});

export const ValidateTriageRuleArgsSchema = z.object({
  rule: z.string().describe('The YARA rule content to validate'),
});

export const AssignTriageTaskArgsSchema = z.object({
  caseId: z.string().describe('Case ID for the triage task'),
  triageRuleIds: z.array(z.string()).describe('Array of triage rule IDs to apply'),
  taskConfig: z.object({
    choice: z.string().describe('Configuration choice, e.g., "use-custom-options"')
  }).describe('Task configuration options'),
  mitreAttack: z.object({
    enabled: z.boolean().describe('Whether to enable MITRE ATT&CK framework')
  }).describe('MITRE ATT&CK configuration'),
  filter: z.object({
    searchTerm: z.string().optional().describe('Optional search term'),
    name: z.string().optional().describe('Filter by asset name'),
    ipAddress: z.string().optional().describe('Filter by IP address'),
    groupId: z.string().optional().describe('Filter by group ID'),
    groupFullPath: z.string().optional().describe('Filter by full group path'),
    managedStatus: z.array(z.string()).optional().describe('Filter by managed status (e.g., ["managed"])'),
    isolationStatus: z.array(z.string()).optional().describe('Filter by isolation status'),
    platform: z.array(z.string()).optional().describe('Filter by platform (e.g., ["windows"])'),
    issue: z.string().optional().describe('Filter by issue'),
    onlineStatus: z.array(z.string()).optional().describe('Filter by online status'),
    tags: z.array(z.string()).optional().describe('Filter by tags'),
    version: z.string().optional().describe('Filter by agent version'),
    policy: z.string().optional().describe('Filter by policy'),
    includedEndpointIds: z.array(z.string()).optional().describe('Array of endpoint IDs to include'),
    excludedEndpointIds: z.array(z.string()).optional().describe('Array of endpoint IDs to exclude'),
    organizationIds: z.array(z.union([z.string(), z.number()])).optional().describe('Organization IDs filter')
  }).describe('Filter criteria for selecting endpoints')
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
  async createTriageRule(args: z.infer<typeof CreateTriageRuleArgsSchema>) {
    try {
      const response = await api.createTriageRule({
        description: args.description,
        rule: args.rule,
        searchIn: args.searchIn,
        engine: args.engine,
        organizationIds: args.organizationIds
      });
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating triage rule: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Triage rule created successfully!\n${formatTriageRule(response.result)}\n\nRule ID: ${response.result._id}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to create triage rule: ${errorMessage}`
          }
        ]
      };
    }
  },
  async updateTriageRule(args: z.infer<typeof UpdateTriageRuleArgsSchema>) {
    try {
      const response = await api.updateTriageRule(args.id, {
        description: args.description,
        rule: args.rule,
        searchIn: args.searchIn,
        organizationIds: args.organizationIds
      });
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating triage rule: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Triage rule updated successfully!\n${formatTriageRule(response.result)}\n\nRule ID: ${response.result._id}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update triage rule: ${errorMessage}`
          }
        ]
      };
    }
  },
  async deleteTriageRule(args: z.infer<typeof DeleteTriageRuleArgsSchema>) {
    try {
      const response = await api.deleteTriageRule(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting triage rule: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Triage rule with ID ${args.id} was successfully deleted.`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to delete triage rule: ${errorMessage}`
          }
        ]
      };
    }
  },
  async getTriageRuleById(args: z.infer<typeof GetTriageRuleByIdArgsSchema>) {
    try {
      const response = await api.getTriageRuleById(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching triage rule: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      // Format the rule content for better readability
      const formattedRule = `
  Rule ID: ${response.result._id}
  Description: ${response.result.description}
  Engine: ${response.result.engine}
  Search In: ${response.result.searchIn}
  Created by: ${response.result.createdBy}
  Type: ${response.result.type}
  Deletable: ${response.result.deletable ? 'Yes' : 'No'}
  
  Rule Content:
  ${response.result.rule}
  `;
      
      return {
        content: [
          {
            type: 'text',
            text: formattedRule
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch triage rule: ${errorMessage}`
          }
        ]
      };
    }
  },
  async validateTriageRule(args: z.infer<typeof ValidateTriageRuleArgsSchema>) {
    try {
      const response = await api.validateTriageRule({
        rule: args.rule
      });
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error validating triage rule: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: 'Triage rule validation successful! The rule syntax is valid.'
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to validate triage rule: ${errorMessage}`
          }
        ]
      };
    }
  },
  async assignTriageTask(args: z.infer<typeof AssignTriageTaskArgsSchema>) {
    try {
      const response = await api.assignTriageTask(args);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error assigning triage task: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const tasksInfo = response.result.map(task => 
        `Task ID: ${task._id}\nName: ${task.name}\nOrganization ID: ${task.organizationId}`
      ).join('\n\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Triage task assigned successfully!\n\n${tasksInfo}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to assign triage task: ${errorMessage}`
          }
        ]
      };
    }
  }
}; 