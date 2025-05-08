import { z } from 'zod';
import { api, User } from '../api/organizations/users/users';

// Schema for get organization users arguments
export const GetOrganizationUsersArgsSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('The ID of the organization to retrieve users for'),
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
};