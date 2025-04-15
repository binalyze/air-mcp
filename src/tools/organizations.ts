import { z } from 'zod';
import { api, Organization } from '../api/organizations/organizations';

// Schema for list organizations arguments
export const ListOrganizationsArgsSchema = z.object({
  // No arguments needed for this endpoint, but adding an empty schema for consistency
}).optional();

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
};
