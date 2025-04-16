import { z } from 'zod';
import { api, Policy } from '../api/policies/policies';

// Schema for list policies arguments
export const ListPoliciesArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter policies by. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
});

// Format policy for display
function formatPolicy(policy: Policy): string {
  return `
Policy: ${policy.name} (${policy._id})
Default: ${policy.default ? 'Yes' : 'No'}
Created by: ${policy.createdBy}
Last updated: ${new Date(policy.updatedAt).toLocaleString()}
CPU limit: ${policy.cpu.limit}%
`;
}

export const policyTools = {
  // List all policies
  async listPolicies(args: z.infer<typeof ListPoliciesArgsSchema>) {
    try {
      const orgIds = args.organizationIds === undefined || args.organizationIds === "" 
        ? "0" 
        : args.organizationIds;
      
      const response = await api.getPolicies(orgIds);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching policies: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const policyList = response.result.entities.map(policy => 
        `${policy._id}: ${policy.name} (Default: ${policy.default ? 'Yes' : 'No'}, Created by: ${policy.createdBy})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} policies:\n${policyList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch policies: ${errorMessage}`
          }
        ]
      };
    }
  },
};
