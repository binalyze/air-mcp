import { z } from 'zod';
import { 
  api, 
  AcquisitionProfile, 
  AcquisitionTaskRequest, 
  DroneConfig, 
  FilterConfig, 
  TaskConfig 
} from '../api/acquisitions/acquisitions';

// Schema for list acquisition profiles arguments
export const ListAcquisitionProfilesArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter acquisition profiles by. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
  allOrganizations: z.boolean().optional().describe('Whether to include profiles from all organizations. Defaults to true.'),
});

// Schema for assign acquisition task arguments
export const AssignAcquisitionTaskArgsSchema = z.object({
  caseId: z.string().describe('The case ID to associate the acquisition with'),
  acquisitionProfileId: z.string().describe('The acquisition profile ID to use for the task'),
  endpointIds: z.array(z.string()).describe('Array of endpoint IDs to collect evidence from'),
  organizationIds: z.array(z.number()).optional().describe('Array of organization IDs to filter by. Defaults to [0]'),
  analyzers: z.array(z.string()).optional().describe('Array of analyzer IDs to use (e.g. ["bha", "wsa"])'),
  keywords: z.array(z.string()).optional().describe('Array of keywords to search for'),
  cpuLimit: z.number().optional().describe('CPU usage limit percentage (1-100). Defaults to 80'),
  enableCompression: z.boolean().optional().describe('Whether to enable compression. Defaults to true'),
  enableEncryption: z.boolean().optional().describe('Whether to enable encryption. Defaults to false'),
  encryptionPassword: z.string().optional().describe('Password for encryption if enabled'),
});

// Schema for get acquisition profile by ID arguments
export const GetAcquisitionProfileByIdArgsSchema = z.object({
  profileId: z.string().describe('The ID of the acquisition profile to retrieve (e.g., "full")'),
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

  // Get Acquisition Profile by ID
  async getAcquisitionProfileById(args: z.infer<typeof GetAcquisitionProfileByIdArgsSchema>) {
    try {
      const response = await api.getAcquisitionProfileById(args.profileId);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching acquisition profile details: ${response.errors.join(', ')}`
            }
          ]
        };
      }

      const profile = response.result;
      let detailsText = `
Profile Details: ${profile.name} (${profile._id})
Created by: ${profile.createdBy}
Created at: ${new Date(profile.createdAt).toLocaleString()}
Updated at: ${new Date(profile.updatedAt).toLocaleString()}
Deletable: ${profile.deletable ? 'Yes' : 'No'}
Organization IDs: ${profile.organizationIds.length > 0 ? profile.organizationIds.join(', ') : 'None'}
`;

      if (profile.windows) {
        detailsText += `\nWindows Evidence Items: ${profile.windows.evidenceList.length}`;
        if (profile.windows.artifactList) {
          detailsText += `\nWindows Artifact Items: ${profile.windows.artifactList.length}`;
        }
      }
      if (profile.linux) {
        detailsText += `\nLinux Evidence Items: ${profile.linux.evidenceList.length}`;
        if (profile.linux.artifactList) { 
          detailsText += `\nLinux Artifact Items: ${profile.linux.artifactList.length}`;
        }
      }
      if (profile.macos) {
        detailsText += `\nmacOS Evidence Items: ${profile.macos.evidenceList.length}`;
        if (profile.macos.artifactList) {
          detailsText += `\nmacOS Artifact Items: ${profile.macos.artifactList.length}`;
        }
      }
       if (profile.aix) {
        detailsText += `\naix Evidence Items: ${profile.aix.evidenceList.length}`;
        if (profile.aix.artifactList) {
          detailsText += `\naix Artifact Items: ${profile.aix.artifactList.length}`;
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: detailsText.trim()
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch acquisition profile details: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Assign evidence acquisition task by filter
  async assignAcquisitionTask(args: z.infer<typeof AssignAcquisitionTaskArgsSchema>) {
    try {
      // Create default configurations
      const droneConfig: DroneConfig = {
        autoPilot: false,
        enabled: false,
        analyzers: args.analyzers || ['bha', 'wsa'],
        keywords: args.keywords || []
      };

      // Create default task configuration with standard paths
      const taskConfig: TaskConfig = {
        choice: 'use-custom-options',
        saveTo: {
          windows: {
            location: 'local',
            useMostFreeVolume: true,
            repositoryId: null,
            path: 'Binalyze\\AIR\\',
            volume: 'C:',
            tmp: 'Binalyze\\AIR\\tmp',
            directCollection: false
          },
          linux: {
            location: 'local',
            useMostFreeVolume: true,
            repositoryId: null,
            path: 'opt/binalyze/air',
            tmp: 'opt/binalyze/air/tmp',
            directCollection: false
          },
          macos: {
            location: 'local',
            useMostFreeVolume: false,
            repositoryId: null,
            path: 'opt/binalyze/air',
            volume: '/',
            tmp: 'opt/binalyze/air/tmp',
            directCollection: false
          },
          aix: {
            location: 'local',
            useMostFreeVolume: true,
            repositoryId: null,
            path: 'opt/binalyze/air',
            volume: '/',
            tmp: 'opt/binalyze/air/tmp',
            directCollection: false
          }
        },
        cpu: {
          limit: args.cpuLimit || 80
        },
        compression: {
          enabled: args.enableCompression !== undefined ? args.enableCompression : true,
          encryption: {
            enabled: args.enableEncryption || false,
            password: args.encryptionPassword || ''
          }
        }
      };

      // Create filter configuration
      const filter: FilterConfig = {
        searchTerm: '',
        name: '',
        ipAddress: '',
        groupId: '',
        groupFullPath: '',
        managedStatus: ['managed'],
        isolationStatus: [],
        platform: [],
        issue: '',
        onlineStatus: [],
        tags: [],
        version: '',
        policy: '',
        includedEndpointIds: args.endpointIds,
        excludedEndpointIds: [],
        organizationIds: args.organizationIds || [0]
      };

      // Create the full acquisition task request
      const request: AcquisitionTaskRequest = {
        caseId: args.caseId,
        droneConfig,
        taskConfig,
        acquisitionProfileId: args.acquisitionProfileId,
        filter
      };

      // Send the request to the API
      const response = await api.assignAcquisitionTask(request);

      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error assigning acquisition task: ${response.errors.join(', ')}`
            }
          ]
        };
      }

      // Format successful response
      const taskList = response.result.map(task => 
        `${task._id}: ${task.name} (Organization: ${task.organizationId})`
      ).join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `Successfully assigned ${response.result.length} acquisition task(s):\n${taskList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to assign acquisition task: ${errorMessage}`
          }
        ]
      };
    }
  },
};
