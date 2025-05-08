import { z } from 'zod';
import { api, Organization } from '../api/organizations/organizations';

// Schema for list organizations arguments
export const ListOrganizationsArgsSchema = z.object({
  // No arguments needed for this endpoint, but adding an empty schema for consistency
}).optional();

export const CreateOrganizationArgsSchema = z.object({
  name: z.string().describe('Name of the organization'),
  shareableDeploymentEnabled: z.boolean().default(false).describe('Whether shareable deployment is enabled'),
  contact: z.object({
    name: z.string().describe('Contact name'),
    title: z.string().optional().describe('Contact title'),
    phone: z.string().optional().describe('Contact phone number'),
    mobile: z.string().optional().describe('Contact mobile number'),
    email: z.string().describe('Contact email address')
  }).describe('Contact information for the organization'),
  note: z.string().optional().describe('Additional notes about the organization')
});

// Format organization for display
function formatOrganization(org: Organization): string {
  return `
Organization: ${org.name} (ID: ${org._id})
Total Endpoints: ${org.totalEndpoints}
Owner: ${org.owner || 'N/A'}
Default: ${org.isDefault ? 'Yes' : 'No'}
Shareable Deployment: ${org.shareableDeploymentEnabled ? 'Enabled' : 'Disabled'}
Created: ${new Date(org.createdAt).toLocaleString()}
Last Updated: ${new Date(org.updatedAt).toLocaleString()}
`;
}

export const organizationTools = {
  // List all organizations
  async listOrganizations() {
    try {
      const response = await api.getOrganizations();
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching organizations: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const orgList = response.result.entities.map(org => 
        `${org._id}: ${org.name} (Total Endpoints: ${org.totalEndpoints}, Default: ${org.isDefault ? 'Yes' : 'No'})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} organizations:\n${orgList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch organizations: ${errorMessage}`
          }
        ]
      };
    }
  },
  async createOrganization(args: z.infer<typeof CreateOrganizationArgsSchema>) {
    try {
      const response = await api.createOrganization(args);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating organization: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const org = response.result;
      return {
        content: [
          {
            type: 'text',
            text: `Successfully created organization:\n${formatOrganization(org)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to create organization: ${errorMessage}`
          }
        ]
      };
    }
  },
};
