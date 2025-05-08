import { z } from 'zod';
import { api, Repository } from '../api/evidence/repositories/repositories';

// Schema for list repositories arguments
export const ListRepositoriesArgsSchema = z.object({
  organizationIds: z.string().optional().describe('Organization IDs to filter repositories by. Leave empty to use default (0).')
}).optional();

// Schema for create SMB repository arguments
export const CreateSmbRepositoryArgsSchema = z.object({
  name: z.string().describe('Name for the SMB repository'),
  path: z.string().describe('Network share path (e.g. \\\\Network\\Share)'),
  username: z.string().describe('Username for SMB authentication'),
  password: z.string().describe('Password for SMB authentication'),
  organizationIds: z.array(z.number()).optional().default([]).describe('Organization IDs to associate the repository with')
});

// Format repository for display
function formatRepository(repo: Repository): string {
  return `
Repository: ${repo.name} (ID: ${repo._id})
Type: ${repo.type}
Path: ${repo.path}
Username: ${repo.username}
Host: ${repo.host || 'N/A'}
Created: ${new Date(repo.createdAt).toLocaleString()}
Last Updated: ${new Date(repo.updatedAt).toLocaleString()}
`;
}

export const repositoryTools = {
  // List all evidence repositories
  async listRepositories(args: z.infer<typeof ListRepositoriesArgsSchema> = {}) {
    try {
      const organizationIds = args?.organizationIds || '0';
      const response = await api.getRepositories(organizationIds);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching repositories: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      if (response.result.entities.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No repositories found.'
            }
          ]
        };
      }
      
      const repoList = response.result.entities.map(repo => 
        `${repo._id}: ${repo.name} (Type: ${repo.type}, Path: ${repo.path})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} repositories:\n${repoList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch repositories: ${errorMessage}`
          }
        ]
      };
    }
  },
  async createSmbRepository(args: z.infer<typeof CreateSmbRepositoryArgsSchema>) {
    try {
      const repository = await api.createSmbRepository({
        name: args.name,
        path: args.path,
        username: args.username,
        password: args.password,
        organizationIds: args.organizationIds || []
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully created SMB repository:\n${formatRepository(repository)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to create SMB repository: ${errorMessage}`
          }
        ]
      };
    }
  }
};