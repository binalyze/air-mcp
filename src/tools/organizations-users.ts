import { z } from 'zod';
import { api, User } from '../api/organizations/users/users';

// Schema for get organization users arguments
export const GetOrganizationUsersArgsSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('The ID of the organization to retrieve users for'),
});

// Schema for assign users to organization arguments
export const AssignUsersToOrganizationArgsSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('The ID of the organization to assign users to'),
  userIds: z.array(z.string()).describe('Array of user IDs to assign to the organization'),
});

// Schema for remove user from organization arguments
export const RemoveUserFromOrganizationArgsSchema = z.object({
  organizationId: z.union([z.string(), z.number()]).describe('The ID of the organization to remove the user from'),
  userId: z.string().describe('The ID of the user to remove from the organization'),
});

// Format user for display
function formatUser(user: User): string {
  return `
User: ${user.username} (ID: ${user._id})
Email: ${user.email}
Organization IDs: ${user.organizationIds}
Profile: ${user.profile.name} ${user.profile.surname} ${user.profile.department ? `(${user.profile.department})` : ''}
TFA Enabled: ${user.tfaEnabled ? 'Yes' : 'No'}
Roles: ${user.roles.map(role => `${role.name} (${role.tag})`).join(', ')}
Created: ${new Date(user.createdAt).toLocaleString()}
Last Updated: ${new Date(user.updatedAt).toLocaleString()}
`;
}

export const organizationUsersTools = {
  // Get users for a specific organization
  async getOrganizationUsers(args: z.infer<typeof GetOrganizationUsersArgsSchema>) {
    try {
      const response = await api.getOrganizationUsers(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching organization users: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const userList = response.result.entities.map(user => 
        `${user._id}: ${user.username} (Email: ${user.email}, Roles: ${user.roles.map(r => r.name).join(', ')})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} users for organization ${args.id}:\n${userList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch organization users: ${errorMessage}`
          }
        ]
      };
    }
  },
  async assignUsersToOrganization(args: z.infer<typeof AssignUsersToOrganizationArgsSchema>) {
    try {
      const response = await api.assignUsersToOrganization(args.id, args.userIds);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error assigning users to organization: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully assigned ${args.userIds.length} user(s) to organization ${args.id}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to assign users to organization: ${errorMessage}`
          }
        ]
      };
    }
  },
  async removeUserFromOrganization(args: z.infer<typeof RemoveUserFromOrganizationArgsSchema>) {
    try {
      const response = await api.removeUserFromOrganization(args.organizationId, args.userId);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error removing user from organization: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully removed user ${args.userId} from organization ${args.organizationId}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to remove user from organization: ${errorMessage}`
          }
        ]
      };
    }
  }
};