import { z } from 'zod';
import { 
  api, 
  AcquisitionProfile, 
  AcquisitionTaskRequest, 
  DroneConfig, 
  FilterConfig, 
  TaskConfig, 
  ImageAcquisitionTaskRequest,
  DiskImageOptions,
  EndpointVolumeConfig,
  CreateAcquisitionProfileRequest
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

// Schema for assign image acquisition task arguments
export const AssignImageAcquisitionTaskArgsSchema = z.object({
  caseId: z.string().optional().nullable().describe('The case ID to associate the acquisition with (optional)'),
  repositoryId: z.string().describe('The repository ID where the image will be saved'),
  endpoints: z.array(z.object({
    endpointId: z.string(),
    volumes: z.array(z.string()).min(1, 'At least one volume must be specified per endpoint')
  })).min(1, 'At least one endpoint must be specified').describe('Array of endpoints and volumes to image (e.g., [{"endpointId": "uuid", "volumes": ["/dev/sda1"]}]'),
  organizationIds: z.array(z.number()).optional().describe('Array of organization IDs. Defaults to [0]'),
  bandwidthLimit: z.number().optional().describe('Bandwidth limit in KB/s. Defaults to 100000'),
  enableCompression: z.boolean().optional().describe('Whether to enable compression. Defaults to true'),
  enableEncryption: z.boolean().optional().describe('Whether to enable encryption. Defaults to false'),
  encryptionPassword: z.string().optional().describe('Password for encryption if enabled'),
  chunkSize: z.number().optional().describe('Chunk size in bytes. Defaults to 1048576'),
  chunkCount: z.number().int().optional().describe('Number of chunks to acquire. Defaults to 0 (acquire until end).'),
  startOffset: z.number().int().optional().describe('Offset in bytes to start acquisition from. Defaults to 0.'),
});

// Schema for get acquisition profile by ID arguments
export const GetAcquisitionProfileByIdArgsSchema = z.object({
  profileId: z.string().describe('The ID of the acquisition profile to retrieve (e.g., "full")'),
});

// Schema for Network Capture Config
const NetworkCaptureConfigSchema = z.object({
  enabled: z.boolean(),
  duration: z.number().int(),
  pcap: z.object({ enabled: z.boolean() }),
  networkFlow: z.object({ enabled: z.boolean() })
}).describe('Network capture configuration');

// Schema for EDiscovery Pattern
const EDiscoveryPatternSchema = z.object({
  pattern: z.string(),
  category: z.string()
}).describe('eDiscovery pattern configuration');

// Schema for Platform Details
const AcquisitionProfilePlatformDetailsSchema = z.object({
  evidenceList: z.array(z.string()),
  artifactList: z.array(z.string()).optional(),
  customContentProfiles: z.array(z.any()).default([]), // Using z.any() for simplicity
  networkCapture: NetworkCaptureConfigSchema.optional()
}).describe('Platform specific acquisition details');

// Schema for AIX Platform Details (no network capture)
const AixAcquisitionProfilePlatformDetailsSchema = AcquisitionProfilePlatformDetailsSchema.omit({ networkCapture: true });

// Schema for create acquisition profile arguments
export const CreateAcquisitionProfileArgsSchema = z.object({
  name: z.string().describe('Name for the new acquisition profile'),
  organizationIds: z.array(z.string()).optional().default([]).describe('Organization IDs to associate the profile with. Defaults to empty array.'),
  windows: AcquisitionProfilePlatformDetailsSchema.describe('Windows specific configuration'),
  linux: AcquisitionProfilePlatformDetailsSchema.describe('Linux specific configuration'),
  macos: AcquisitionProfilePlatformDetailsSchema.describe('macOS specific configuration'),
  aix: AixAcquisitionProfilePlatformDetailsSchema.describe('AIX specific configuration'),
  eDiscovery: z.object({
    patterns: z.array(EDiscoveryPatternSchema)
  }).describe('eDiscovery configuration')
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

  // Assign image acquisition task by filter
  async assignImageAcquisitionTask(args: z.infer<typeof AssignImageAcquisitionTaskArgsSchema>) {
    try {
      // Construct TaskConfig with defaults, overriding where specified
      const taskConfig: TaskConfig = {
        choice: 'use-custom-options',
        saveTo: {
          // Defaulting to repository location using the provided repositoryId
          windows: {
            location: 'repository',
            useMostFreeVolume: true,
            repositoryId: args.repositoryId,
            path: 'Binalyze\\AIR',
            tmp: 'Binalyze\\AIR\\tmp',
            directCollection: false
          },
          linux: {
            location: 'repository',
            useMostFreeVolume: false,
            repositoryId: args.repositoryId,
            path: 'opt/binalyze/air',
            tmp: 'opt/binalyze/air/tmp',
            directCollection: false
          },
          macos: {
            location: 'repository',
            useMostFreeVolume: false,
            repositoryId: args.repositoryId,
            path: 'opt/binalyze/air',
            tmp: 'opt/binalyze/air/tmp',
            directCollection: false
          },
          // Assuming AIX is not applicable for image acquisition or uses similar defaults
          aix: {
            location: 'repository',
            useMostFreeVolume: true,
            repositoryId: args.repositoryId,
            path: 'opt/binalyze/air',
            volume: '/', // Default added
            tmp: 'opt/binalyze/air/tmp',
            directCollection: false
          }
        },
        cpu: { limit: 80 }, // Default CPU limit, not exposed as arg for image task
        // @ts-ignore - API definition might need update if bandwidth is separate
        bandwidth: { 
          limit: args.bandwidthLimit || 100000 
        },
        compression: {
          enabled: args.enableCompression !== undefined ? args.enableCompression : true,
          encryption: {
            enabled: args.enableEncryption || false,
            password: args.encryptionPassword || ''
          }
        }
      };

      // Construct DiskImageOptions
      const diskImageOptions: DiskImageOptions = {
        chunkSize: args.chunkSize || 1048576, // Default chunk size 1MB
        chunkCount: args.chunkCount ?? 0, 
        startOffset: args.startOffset ?? 0,
        endpoints: args.endpoints.map(ep => ({
          endpointId: ep.endpointId,
          volumes: ep.volumes
        } as EndpointVolumeConfig))
      };

      // Construct FilterConfig using endpoint IDs from diskImageOptions
      const includedEndpointIds = args.endpoints.map(ep => ep.endpointId);
      const filter: FilterConfig = {
        searchTerm: '',
        name: '',
        ipAddress: '',
        groupId: '',
        groupFullPath: '',
        managedStatus: [], // Defaulting based on example
        isolationStatus: [],
        platform: [],
        issue: '',
        onlineStatus: [],
        tags: [],
        version: '',
        policy: '',
        includedEndpointIds: includedEndpointIds,
        excludedEndpointIds: [],
        organizationIds: args.organizationIds || [0]
      };

      // Construct the full request
      const request: ImageAcquisitionTaskRequest = {
        caseId: args.caseId ?? null,
        taskConfig,
        diskImageOptions,
        filter
      };

      // Send the request to the API
      const response = await api.assignImageAcquisitionTask(request);

      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error assigning image acquisition task: ${response.errors.join(', ')}`
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
            text: `Successfully assigned ${response.result.length} image acquisition task(s):\n${taskList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to assign image acquisition task: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Create Acquisition Profile
  async createAcquisitionProfile(args: z.infer<typeof CreateAcquisitionProfileArgsSchema>) {
    try {
      // Construct the request body from validated arguments
      const request: CreateAcquisitionProfileRequest = {
        name: args.name,
        organizationIds: args.organizationIds,
        windows: args.windows,
        linux: args.linux,
        macos: args.macos,
        aix: args.aix,
        eDiscovery: args.eDiscovery
      };

      const response = await api.createAcquisitionProfile(request);

      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating acquisition profile: ${response.errors.join(', ')}`
            }
          ]
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `Successfully created acquisition profile: ${args.name}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to create acquisition profile: ${errorMessage}`
          }
        ]
      };
    }
  }
};
