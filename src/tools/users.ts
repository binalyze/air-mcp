import { z } from 'zod';
import { api, User } from '../api/users/users';

// Schema for list users arguments
export const ListUsersArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter users by. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
});

// Format user for display
function formatUser(user: User): string {
  return `
User: ${user.username} (${user._id})
Email: ${user.email}
Organizations: ${user.organizationIds}
Profile: ${user.profile.name} ${user.profile.surname} ${user.profile.department ? `(${user.profile.department})` : ''}
2FA Enabled: ${user.tfaEnabled ? 'Yes' : 'No'}
Created at: ${new Date(user.createdAt).toLocaleString()}
Updated at: ${new Date(user.updatedAt).toLocaleString()}
`;
}

export const userTools = {
  // List all users
  async listUsers(args: z.infer<typeof ListUsersArgsSchema>) {
    try {
      const orgIds = args.organizationIds === undefined || args.organizationIds === "" 
        ? "0" 
        : args.organizationIds;
      
      const response = await api.getUsers(orgIds);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching users: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const userList = response.result.entities.map(user => 
        `${user._id}: ${user.username} (${user.email})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} users:\n${userList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch users: ${errorMessage}`
          }
        ]
      };
    }
  },
}; 