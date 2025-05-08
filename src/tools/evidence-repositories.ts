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

// Schema for update SMB repository arguments
export const UpdateSmbRepositoryArgsSchema = z.object({
  id: z.string().describe('ID of the SMB repository to update'),
  name: z.string().describe('Updated name for the SMB repository'),
  path: z.string().describe('Updated network share path (e.g. \\\\Network\\Share)'),
  username: z.string().describe('Updated username for SMB authentication'),
  password: z.string().describe('Updated password for SMB authentication'),
  organizationIds: z.array(z.number()).optional().default([]).describe('Updated organization IDs to associate the repository with')
});

// Schema for create SFTP repository arguments
export const CreateSftpRepositoryArgsSchema = z.object({
  name: z.string().describe('Name for the SFTP repository'),
  host: z.string().describe('SFTP server hostname or IP address'),
  port: z.number().default(22).describe('SFTP server port (default: 22)'),
  path: z.string().describe('Path on the SFTP server (e.g. /)'),
  username: z.string().describe('Username for SFTP authentication'),
  password: z.string().describe('Password for SFTP authentication'),
  organizationIds: z.array(z.number()).optional().default([]).describe('Organization IDs to associate the repository with')
});

// Schema for update SFTP repository arguments
export const UpdateSftpRepositoryArgsSchema = z.object({
  id: z.string().describe('ID of the SFTP repository to update'),
  name: z.string().describe('Updated name for the SFTP repository'),
  host: z.string().describe('Updated SFTP server hostname or IP address'),
  port: z.number().default(22).describe('Updated SFTP server port (default: 22)'),
  path: z.string().describe('Updated path on the SFTP server (e.g. /)'),
  username: z.string().describe('Updated username for SFTP authentication'),
  password: z.string().describe('Updated password for SFTP authentication'),
  organizationIds: z.array(z.number()).optional().default([]).describe('Updated organization IDs to associate the repository with')
});

// Schema for create FTPS repository arguments
export const CreateFtpsRepositoryArgsSchema = z.object({
  name: z.string().describe('Name for the FTPS repository'),
  host: z.string().describe('FTPS server hostname or IP address'),
  port: z.number().default(22).describe('FTPS server port (default: 22)'),
  path: z.string().describe('Path on the FTPS server (e.g. /)'),
  username: z.string().describe('Username for FTPS authentication'),
  password: z.string().describe('Password for FTPS authentication'),
  allowSelfSignedSSL: z.boolean().default(false).describe('Whether to allow self-signed SSL certificates'),
  publicKey: z.string().nullable().default(null).describe('Public key for FTPS authentication (optional)'),
  organizationIds: z.array(z.number()).optional().default([]).describe('Organization IDs to associate the repository with')
});

// Schema for update FTPS repository arguments
export const UpdateFtpsRepositoryArgsSchema = z.object({
  id: z.string().describe('ID of the FTPS repository to update'),
  name: z.string().describe('Updated name for the FTPS repository'),
  host: z.string().describe('Updated FTPS server hostname or IP address'),
  port: z.number().default(22).describe('Updated FTPS server port (default: 22)'),
  path: z.string().describe('Updated path on the FTPS server (e.g. /)'),
  username: z.string().describe('Updated username for FTPS authentication'),
  password: z.string().describe('Updated password for FTPS authentication'),
  allowSelfSignedSSL: z.boolean().default(false).describe('Whether to allow self-signed SSL certificates'),
  publicKey: z.string().nullable().default(null).describe('Public key for FTPS authentication (optional)'),
  organizationIds: z.array(z.number()).optional().default([]).describe('Updated organization IDs to associate the repository with')
});

// Schema for validate FTPS repository arguments
export const ValidateFtpsRepositoryArgsSchema = z.object({
  name: z.string().describe('Name for the FTPS repository'),
  host: z.string().describe('FTPS server hostname or IP address'),
  port: z.number().default(22).describe('FTPS server port (default: 22)'),
  path: z.string().describe('Path on the FTPS server (e.g. /)'),
  username: z.string().describe('Username for FTPS authentication'),
  password: z.string().describe('Password for FTPS authentication'),
  allowSelfSignedSSL: z.boolean().default(false).describe('Whether to allow self-signed SSL certificates'),
  publicKey: z.string().nullable().default(null).describe('Public key for FTPS authentication (optional)')
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
  },
  async updateSmbRepository(args: z.infer<typeof UpdateSmbRepositoryArgsSchema>) {
    try {
      const repository = await api.updateSmbRepository(args.id, {
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
            text: `Successfully updated SMB repository:\n${formatRepository(repository)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update SMB repository: ${errorMessage}`
          }
        ]
      };
    }
  },
  async createSftpRepository(args: z.infer<typeof CreateSftpRepositoryArgsSchema>) {
    try {
      const repository = await api.createSftpRepository({
        name: args.name,
        host: args.host,
        port: args.port,
        path: args.path,
        username: args.username,
        password: args.password,
        organizationIds: args.organizationIds || []
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully created SFTP repository:\n${formatRepository(repository)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to create SFTP repository: ${errorMessage}`
          }
        ]
      };
    }
  },
  async updateSftpRepository(args: z.infer<typeof UpdateSftpRepositoryArgsSchema>) {
    try {
      const repository = await api.updateSftpRepository(args.id, {
        name: args.name,
        host: args.host,
        port: args.port,
        path: args.path,
        username: args.username,
        password: args.password,
        organizationIds: args.organizationIds || []
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully updated SFTP repository:\n${formatRepository(repository)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update SFTP repository: ${errorMessage}`
          }
        ]
      };
    }
  },
  async createFtpsRepository(args: z.infer<typeof CreateFtpsRepositoryArgsSchema>) {
    try {
      const repository = await api.createFtpsRepository({
        name: args.name,
        host: args.host,
        port: args.port,
        path: args.path,
        username: args.username,
        password: args.password,
        allowSelfSignedSSL: args.allowSelfSignedSSL,
        publicKey: args.publicKey,
        organizationIds: args.organizationIds || []
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully created FTPS repository:\n${formatRepository(repository)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to create FTPS repository: ${errorMessage}`
          }
        ]
      };
    }
  },
  async updateFtpsRepository(args: z.infer<typeof UpdateFtpsRepositoryArgsSchema>) {
    try {
      const repository = await api.updateFtpsRepository(args.id, {
        name: args.name,
        host: args.host,
        port: args.port,
        path: args.path,
        username: args.username,
        password: args.password,
        allowSelfSignedSSL: args.allowSelfSignedSSL,
        publicKey: args.publicKey,
        organizationIds: args.organizationIds || []
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully updated FTPS repository:\n${formatRepository(repository)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update FTPS repository: ${errorMessage}`
          }
        ]
      };
    }
  },
  async validateFtpsRepository(args: z.infer<typeof ValidateFtpsRepositoryArgsSchema>) {
    try {
      const result = await api.validateFtpsRepository({
        name: args.name,
        host: args.host,
        port: args.port,
        path: args.path,
        username: args.username,
        password: args.password,
        allowSelfSignedSSL: args.allowSelfSignedSSL,
        publicKey: args.publicKey
      });
      
      if (result.success) {
        return {
          content: [
            {
              type: 'text',
              text: 'FTPS repository configuration is valid.'
            }
          ]
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `FTPS repository validation failed: ${result.errors.join(', ')}`
            }
          ]
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to validate FTPS repository: ${errorMessage}`
          }
        ]
      };
    }
  }
};