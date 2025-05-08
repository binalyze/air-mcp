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

export const UpdateCaseArgsSchema = z.object({
  id: z.string().describe('ID of the case to update'),
  name: z.string().optional().describe('New name for the case'),
  ownerUserId: z.string().optional().describe('New owner user ID for the case'),
  visibility: z.string().optional().describe('New visibility setting for the case'),
  assignedUserIds: z.array(z.string()).optional().describe('New array of user IDs to assign to the case'),
  status: z.enum(['open', 'closed', 'archived']).optional().describe('New status for the case'),
  notes: z.array(z.any()).optional().describe('New notes for the case'),
});

export const GetCaseByIdArgsSchema = z.object({
  id: z.string().describe('ID of the case to retrieve'),
});

export const CloseCaseArgsSchema = z.object({
  id: z.string().describe('ID of the case to close'),
});

export const OpenCaseArgsSchema = z.object({
  id: z.string().describe('ID of the case to open'),
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
  },
  async updateCase(args: z.infer<typeof UpdateCaseArgsSchema>) {
    try {
      const updateData: Record<string, any> = {};
      
      // Only include fields that are provided
      if (args.name !== undefined) updateData.name = args.name;
      if (args.ownerUserId !== undefined) updateData.ownerUserId = args.ownerUserId;
      if (args.visibility !== undefined) updateData.visibility = args.visibility;
      if (args.assignedUserIds !== undefined) updateData.assignedUserIds = args.assignedUserIds;
      if (args.status !== undefined) updateData.status = args.status;
      if (args.notes !== undefined) updateData.notes = args.notes;
      
      const response = await api.updateCase(args.id, updateData);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating case: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Case updated successfully:\n${formatCase(response.result)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update case: ${errorMessage}`
          }
        ]
      };
    }
  },
  async getCaseById(args: z.infer<typeof GetCaseByIdArgsSchema>) {
    try {
      const response = await api.getCase(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching case: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Case details:\n${formatCase(response.result)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch case: ${errorMessage}`
          }
        ]
      };
    }
  },
  async closeCase(args: z.infer<typeof CloseCaseArgsSchema>) {
    try {
      const response = await api.closeCase(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error closing case: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Case closed successfully:\n${formatCase(response.result)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to close case: ${errorMessage}`
          }
        ]
      };
    }
  },
  async openCase(args: z.infer<typeof OpenCaseArgsSchema>) {
    try {
      const response = await api.openCase(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error opening case: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Case opened successfully:\n${formatCase(response.result)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to open case: ${errorMessage}`
          }
        ]
      };
    }
  }
};
