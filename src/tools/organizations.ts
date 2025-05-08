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

export const UpdateOrganizationArgsSchema = z.object({
  id: z.number().describe('ID of the organization to update'),
  name: z.string().optional().describe('Updated name of the organization'),
  shareableDeploymentEnabled: z.boolean().optional().describe('Whether shareable deployment is enabled'),
  contact: z.object({
    name: z.string().describe('Contact name'),
    title: z.string().optional().describe('Contact title'),
    phone: z.string().optional().describe('Contact phone number'),
    mobile: z.string().optional().describe('Contact mobile number'),
    email: z.string().describe('Contact email address')
  }).optional().describe('Updated contact information for the organization'),
  note: z.string().optional().describe('Additional notes about the organization')
});

export const GetOrganizationByIdArgsSchema = z.object({
  id: z.number().describe('ID of the organization to retrieve')
});

export const CheckOrganizationNameExistsArgsSchema = z.object({
  name: z.string().describe('Name of the organization to check')
});

export const GetShareableDeploymentInfoArgsSchema = z.object({
  deploymentToken: z.string().describe('The deployment token to retrieve information for')
});

export const UpdateOrganizationShareableDeploymentArgsSchema = z.object({
  id: z.number().describe('ID of the organization to update'),
  status: z.boolean().describe('Whether shareable deployment should be enabled (true) or disabled (false)')
});

export const UpdateOrganizationDeploymentTokenArgsSchema = z.object({
  id: z.number().describe('ID of the organization to update'),
  deploymentToken: z.string().describe('New deployment token for the organization')
});

export const DeleteOrganizationArgsSchema = z.object({
  id: z.number().describe('ID of the organization to delete')
});

export const AddTagsToOrganizationArgsSchema = z.object({
  id: z.number().describe('ID of the organization to add tags to'),
  tags: z.array(z.string()).describe('Array of tags to add to the organization')
});

export const DeleteTagsFromOrganizationArgsSchema = z.object({
  id: z.number().describe('ID of the organization to delete tags from'),
  tags: z.array(z.string()).describe('Array of tags to delete from the organization')
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
  async updateOrganization(args: z.infer<typeof UpdateOrganizationArgsSchema>) {
    try {
      const { id, ...updateData } = args;
      const response = await api.updateOrganization(id, updateData);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating organization: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const org = response.result;
      return {
        content: [
          {
            type: 'text',
            text: `Successfully updated organization:\n${formatOrganization(org)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update organization: ${errorMessage}`
          }
        ]
      };
    }
  },
  async getOrganizationById(args: z.infer<typeof GetOrganizationByIdArgsSchema>) {
    try {
      const response = await api.getOrganizationById(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching organization: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const org = response.result;
      
      // Create a detailed view of the organization
      let detailedView = formatOrganization(org);
      
      // Add contact information if available
      if (org.contact) {
        detailedView += `
  Contact Information:
    Name: ${org.contact.name}
    Email: ${org.contact.email}
    ${org.contact.title ? `Title: ${org.contact.title}` : ''}
    ${org.contact.phone ? `Phone: ${org.contact.phone}` : ''}
    ${org.contact.mobile ? `Mobile: ${org.contact.mobile}` : ''}
  `;
      }
      
      // Add note if available
      if (org.note) {
        detailedView += `
  Note: ${org.note}
  `;
      }
      
      // Add statistics if available
      if (org.statistics) {
        detailedView += `
  Statistics:
    Endpoints: ${org.statistics.endpoint.total} total, ${org.statistics.endpoint.managed} managed
    Cases: ${org.statistics.case.total} total (${org.statistics.case.open} open, ${org.statistics.case.closed} closed, ${org.statistics.case.archived} archived)
  `;
      }
      
      return {
        content: [
          {
            type: 'text',
            text: detailedView
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch organization: ${errorMessage}`
          }
        ]
      };
    }
  },
  async checkOrganizationNameExists(args: z.infer<typeof CheckOrganizationNameExistsArgsSchema>) {
    try {
      const response = await api.checkOrganizationNameExists(args.name);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error checking organization name: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Organization name "${args.name}" ${response.result ? 'already exists' : 'does not exist'}.`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to check organization name: ${errorMessage}`
          }
        ]
      };
    }
  },
  async getShareableDeploymentInfo(args: z.infer<typeof GetShareableDeploymentInfoArgsSchema>) {
    try {
      const response = await api.getShareableDeploymentInfo(args.deploymentToken);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching shareable deployment information: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const info = response.result;
      return {
        content: [
          {
            type: 'text',
            text: `Shareable Deployment Information:
  Organization ID: ${info.organizationId}
  Console Address: ${info.consoleAddress}
  Agent Version: ${info.agentVersion}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch shareable deployment information: ${errorMessage}`
          }
        ]
      };
    }
  },
  async updateOrganizationShareableDeployment(args: z.infer<typeof UpdateOrganizationShareableDeploymentArgsSchema>) {
    try {
      const response = await api.updateOrganizationShareableDeployment(args.id, args.status);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating organization shareable deployment: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully ${args.status ? 'enabled' : 'disabled'} shareable deployment for organization ID: ${args.id}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update organization shareable deployment: ${errorMessage}`
          }
        ]
      };
    }
  },
  async updateOrganizationDeploymentToken(args: z.infer<typeof UpdateOrganizationDeploymentTokenArgsSchema>) {
    try {
      const response = await api.updateOrganizationDeploymentToken(args.id, args.deploymentToken);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating organization deployment token: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully updated deployment token for organization ID: ${args.id}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update organization deployment token: ${errorMessage}`
          }
        ]
      };
    }
  },
  async deleteOrganization(args: z.infer<typeof DeleteOrganizationArgsSchema>) {
    try {
      const response = await api.deleteOrganization(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting organization: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully deleted organization with ID: ${args.id}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to delete organization: ${errorMessage}`
          }
        ]
      };
    }
  },
  async addTagsToOrganization(args: z.infer<typeof AddTagsToOrganizationArgsSchema>) {
    try {
      const response = await api.addTagsToOrganization(args.id, args.tags);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error adding tags to organization: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const org = response.result;
      return {
        content: [
          {
            type: 'text',
            text: `Successfully added tags to organization ${org.name} (ID: ${org._id}):\nTags: ${org.tags?.join(', ') || 'None'}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to add tags to organization: ${errorMessage}`
          }
        ]
      };
    }
  },
  async deleteTagsFromOrganization(args: z.infer<typeof DeleteTagsFromOrganizationArgsSchema>) {
    try {
      const response = await api.deleteTagsFromOrganization(args.id, args.tags);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting tags from organization: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const org = response.result;
      return {
        content: [
          {
            type: 'text',
            text: `Successfully deleted tags from organization ${org.name} (ID: ${org._id}).\nRemaining tags: ${org.tags?.join(', ') || 'None'}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to delete tags from organization: ${errorMessage}`
          }
        ]
      };
    }
  }
};
