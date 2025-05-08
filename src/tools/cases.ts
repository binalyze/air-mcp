import { z } from 'zod';
import { api, Case } from '../api/cases/cases';

// Schema for list cases arguments
export const ListCasesArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter cases by. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
});

export const CreateCaseArgsSchema = z.object({
  organizationId: z.number().default(0).describe('Organization ID to create the case in. Defaults to 0.'),
  name: z.string().describe('Name of the case'),
  ownerUserId: z.string().describe('User ID of the case owner'),
  visibility: z.string().default('public-to-organization').describe('Visibility of the case. Defaults to "public-to-organization"'),
  assignedUserIds: z.array(z.string()).default([]).describe('Array of user IDs to assign to the case. Defaults to empty array.'),
});


// Format case for display
function formatCase(caseItem: Case): string {
  return `
Case: ${caseItem.name} (${caseItem._id})
Status: ${caseItem.status}
Created at: ${new Date(caseItem.createdAt).toLocaleString()}
Started on: ${new Date(caseItem.startedOn).toLocaleString()}
Owner: ${caseItem.ownerUserId}
Organization: ${caseItem.organizationId}
Visibility: ${caseItem.visibility}
Total days: ${caseItem.totalDays}
Total endpoints: ${caseItem.totalEndpoints}
`;
}

export const caseTools = {
  // List all cases
  async listCases(args: z.infer<typeof ListCasesArgsSchema>) {
    try {
      const orgIds = args.organizationIds === undefined || args.organizationIds === "" 
        ? "0" 
        : args.organizationIds;
      
      const response = await api.getCases(orgIds);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching cases: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      if (response.result.entities.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No cases found matching the criteria.'
            }
          ]
        };
      }
      
      const caseList = response.result.entities.map(caseItem => 
        `${caseItem._id}: ${caseItem.name} (Status: ${caseItem.status}, Started: ${new Date(caseItem.startedOn).toLocaleDateString()})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} cases:\n${caseList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch cases: ${errorMessage}`
          }
        ]
      };
    }
  },
  async createCase(args: z.infer<typeof CreateCaseArgsSchema>) {
    try {
      const response = await api.createCase({
        organizationId: args.organizationId,
        name: args.name,
        ownerUserId: args.ownerUserId,
        visibility: args.visibility,
        assignedUserIds: args.assignedUserIds,
      });
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating case: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Case created successfully:\n${formatCase(response.result)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to create case: ${errorMessage}`
          }
        ]
      };
    }
  }
};
