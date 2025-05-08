import { z } from 'zod';
import { api, Case, CaseEndpoint, CaseTask, User } from '../api/cases/cases';

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

export const ArchiveCaseArgsSchema = z.object({
  id: z.string().describe('ID of the case to archive'),
});

export const ChangeCaseOwnerArgsSchema = z.object({
  id: z.string().describe('ID of the case to change owner for'),
  newOwnerId: z.string().describe('User ID of the new owner')
});

export const CheckCaseNameArgsSchema = z.object({
  name: z.string().describe('Name to check for availability'),
});

export const GetCaseActivitiesArgsSchema = z.object({
  id: z.string().describe('ID of the case to retrieve activities for'),
});

export const GetCaseEndpointsArgsSchema = z.object({
  id: z.string().describe('ID of the case to retrieve endpoints for'),
  organizationIds: z.union([
    z.string(),
    z.number()
  ]).default(0).describe('Organization IDs to filter endpoints by. Defaults to 0.')
});

// Schema for get case users arguments
export const GetCaseUsersArgsSchema = z.object({
  id: z.string().describe('The ID of the case to retrieve users for'),
  organizationIds: z.string().optional().describe('Organization IDs to filter users by. Defaults to "0".')
});

// Format user for display
function formatUser(user: User): string {
  const organizationIds = Array.isArray(user.organizationIds) 
    ? user.organizationIds.join(', ') 
    : user.organizationIds;
  
  return `
User: ${user.username} (ID: ${user._id})
Email: ${user.email}
Organizations: ${organizationIds}
Roles: ${user.roles.map(role => role.name).join(', ')}
Profile: ${user.profile.name} ${user.profile.surname} ${user.profile.department ? `(${user.profile.department})` : ''}
TFA Enabled: ${user.tfaEnabled ? 'Yes' : 'No'}
Created: ${new Date(user.createdAt).toLocaleString()}
Last Updated: ${new Date(user.updatedAt).toLocaleString()}
`;
}

export const GetCaseTasksByIdArgsSchema = z.object({
  id: z.string().describe('ID of the case to retrieve tasks for'),
  organizationIds: z.union([
    z.string(),
    z.number()
  ]).default(0).describe('Organization IDs to filter tasks by. Defaults to 0.')
});

function formatTask(task: CaseTask): string {
  return `
Task: ${task.name} (ID: ${task._id})
Type: ${task.type}
Endpoint: ${task.endpointName} (ID: ${task.endpointId})
Status: ${task.status}
Progress: ${task.progress}%
Comparable: ${task.isComparable ? 'Yes' : 'No'}
Created: ${new Date(task.createdAt).toLocaleString()}
Last Updated: ${new Date(task.updatedAt).toLocaleString()}
`;
}

function formatEndpoint(endpoint: CaseEndpoint): string {
  return `
Endpoint: ${endpoint.name} (ID: ${endpoint._id})
Platform: ${endpoint.platform}
OS: ${endpoint.os}
IP Address: ${endpoint.ipAddress}
Group: ${endpoint.groupFullPath}
Status: ${endpoint.onlineStatus} (${endpoint.isolationStatus})
Last Seen: ${new Date(endpoint.lastSeen).toLocaleString()}
Version: ${endpoint.version}
Managed: ${endpoint.isManaged ? 'Yes' : 'No'}
Server: ${endpoint.isServer ? 'Yes' : 'No'}
Tags: ${endpoint.tags.length > 0 ? endpoint.tags.join(', ') : 'None'}
`;
}

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
  },
  async archiveCase(args: z.infer<typeof ArchiveCaseArgsSchema>) {
    try {
      const response = await api.archiveCase(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error archiving case: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Case archived successfully:\n${formatCase(response.result)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to archive case: ${errorMessage}`
          }
        ]
      };
    }
  },
  async changeCaseOwner(args: z.infer<typeof ChangeCaseOwnerArgsSchema>) {
    try {
      const response = await api.changeOwner(args.id, args.newOwnerId);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error changing case owner: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Case owner changed successfully:\n${formatCase(response.result)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to change case owner: ${errorMessage}`
          }
        ]
      };
    }
  },
  async checkCaseName(args: z.infer<typeof CheckCaseNameArgsSchema>) {
    try {
      const response = await api.checkCaseName(args.name);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error checking case name: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const isAvailable = !response.result;
      return {
        content: [
          {
            type: 'text',
            text: isAvailable 
              ? `The case name "${args.name}" is available for use.` 
              : `The case name "${args.name}" is already in use and not available.`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to check case name: ${errorMessage}`
          }
        ]
      };
    }
  },
  async getCaseActivities(args: z.infer<typeof GetCaseActivitiesArgsSchema>) {
    try {
      const response = await api.getCaseActivities(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching case activities: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      if (response.result.entities.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No activities found for case with ID ${args.id}.`
            }
          ]
        };
      }
      
      // Format activities for display
      const activitiesList = response.result.entities.map(activity => {
        const date = new Date(activity.createdAt).toLocaleString();
        return `[${date}] ${activity.type} by ${activity.performedBy}: ${activity.description}`;
      }).join('\n\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Case Activities for case ${args.id}:\n\n${activitiesList}\n\nTotal: ${response.result.totalEntityCount} activities`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch case activities: ${errorMessage}`
          }
        ]
      };
    }
  },
  async getCaseEndpoints(args: z.infer<typeof GetCaseEndpointsArgsSchema>) {
    try {
      const response = await api.getCaseEndpoints(args.id, args.organizationIds);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching case endpoints: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      if (response.result.entities.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No endpoints found for case with ID ${args.id}.`
            }
          ]
        };
      }
      
      // Group endpoints by OS for better organization
      const endpointsByOs: Record<string, CaseEndpoint[]> = {};
      response.result.entities.forEach(endpoint => {
        const os = endpoint.os || 'Unknown';
        if (!endpointsByOs[os]) {
          endpointsByOs[os] = [];
        }
        endpointsByOs[os].push(endpoint);
      });
      
      // Format summary by OS
      const summaryByOs = Object.entries(endpointsByOs).map(([os, endpoints]) => {
        return `${os}: ${endpoints.length} endpoints`;
      }).join('\n');
      
      // Format endpoints list
      const endpointsList = response.result.entities.map(endpoint => 
        `${endpoint._id}: ${endpoint.name} (OS: ${endpoint.os}, Platform: ${endpoint.platform}, Status: ${endpoint.onlineStatus})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} endpoints for case ${args.id}:\n\nSummary by OS:\n${summaryByOs}\n\nEndpoints:\n${endpointsList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch case endpoints: ${errorMessage}`
          }
        ]
      };
    }
  },

  async getCaseTasksById(args: z.infer<typeof GetCaseTasksByIdArgsSchema>) {
    try {
      const response = await api.getCaseTasksById(args.id, args.organizationIds);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching case tasks: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      if (response.result.entities.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No tasks found for case with ID ${args.id}.`
            }
          ]
        };
      }
      
      // Group tasks by type for better organization
      const tasksByType: Record<string, CaseTask[]> = {};
      response.result.entities.forEach(task => {
        const type = task.type || 'Unknown';
        if (!tasksByType[type]) {
          tasksByType[type] = [];
        }
        tasksByType[type].push(task);
      });
      
      // Format summary by type
      const summaryByType = Object.entries(tasksByType).map(([type, tasks]) => {
        return `${type}: ${tasks.length} tasks`;
      }).join('\n');
      
      // Format tasks list
      const tasksList = response.result.entities.map(task => 
        `${task._id}: ${task.name} (Type: ${task.type}, Endpoint: ${task.endpointName}, Status: ${task.status}, Progress: ${task.progress}%)`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} tasks for case ${args.id}:\n\nSummary by Type:\n${summaryByType}\n\nTasks:\n${tasksList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch case tasks: ${errorMessage}`
          }
        ]
      };
    }
  },
  // Get users for a specific case
  async getCaseUsers(args: z.infer<typeof GetCaseUsersArgsSchema>) {
    try {
      const { id, organizationIds = '0' } = args;
      const response = await api.getCaseUsers(id, organizationIds);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching case users: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      if (response.result.entities.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No users found for case ${id}.`
            }
          ]
        };
      }
      
      // For a brief overview
      const userList = response.result.entities.map(user => 
        `${user._id}: ${user.username} (Email: ${user.email}, Roles: ${user.roles.map(r => r.name).join(', ')})`
      ).join('\n');
      
      // For detailed information
      const detailedUsers = response.result.entities.map(formatUser).join('\n---\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} users for case ${id}:\n\n${userList}\n\nDetailed Information:\n${detailedUsers}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch case users: ${errorMessage}`
          }
        ]
      };
    }
  }
};
