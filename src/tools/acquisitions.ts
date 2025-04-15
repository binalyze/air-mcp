import { z } from 'zod';
import { api, AcquisitionProfile } from '../api/acquisitions/acquisitions';

// Schema for list acquisition profiles arguments
export const ListAcquisitionProfilesArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter acquisition profiles by. Use "0" for all organizations or specific IDs like "123" or ["123", "456"]'),
  allOrganizations: z.boolean().optional().describe('Whether to include profiles from all organizations. Defaults to true.'),
});

// Format acquisition profile for display
function formatAcquisitionProfile(profile: AcquisitionProfile): string {
  return `
Profile: ${profile.name} (${profile._id})
Created by: ${profile.createdBy}
Created at: ${new Date(profile.createdAt).toLocaleString()}
Deletable: ${profile.deletable ? 'Yes' : 'No'}
`;
}

export const acquisitionTools = {
  // List all acquisition profiles
  async listAcquisitionProfiles(args: z.infer<typeof ListAcquisitionProfilesArgsSchema>) {
    try {
      const orgIds = args.organizationIds === undefined || args.organizationIds === "" 
        ? "0" 
        : args.organizationIds;
      const allOrgs = args.allOrganizations === undefined ? true : args.allOrganizations;
      
      const response = await api.getAcquisitionProfiles(orgIds, allOrgs);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching acquisition profiles: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const profileList = response.result.entities.map(profile => 
        `${profile._id}: ${profile.name} (Created by: ${profile.createdBy})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} acquisition profiles:\n${profileList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch acquisition profiles: ${errorMessage}`
          }
        ]
      };
    }
  },
};
