// src/tools/assets.ts
import { z } from 'zod';
import { api, Asset, AssetDetail, AssetTask } from '../api/assets/assets';

// Schema for list assets arguments
export const ListAssetsArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter assets by. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
});

// Schema for get asset by id arguments
export const GetAssetByIdArgsSchema = z.object({
  id: z.string().describe('The ID of the asset to retrieve'),
});

// Schema for get asset tasks by id arguments
export const GetAssetTasksByIdArgsSchema = z.object({
  id: z.string().describe('The ID of the asset to retrieve tasks for'),
});

// Schema for uninstall assets arguments, mimicking the AssetFilter structure
export const UninstallAssetsArgsSchema = z.object({
  filter: z.object({
    searchTerm: z.string().optional(),
    name: z.string().optional(),
    ipAddress: z.string().optional(),
    groupId: z.string().optional(),
    groupFullPath: z.string().optional(),
    managedStatus: z.array(z.string()).optional(),
    isolationStatus: z.array(z.string()).optional(),
    platform: z.array(z.string()).optional(),
    issue: z.string().optional(),
    onlineStatus: z.array(z.string()).optional(),
    tagId: z.string().optional(),
    version: z.string().optional(),
    policy: z.string().optional(),
    includedEndpointIds: z.array(z.string()).optional().describe('Required: At least one endpoint ID must be included for the uninstall operation.'),
    excludedEndpointIds: z.array(z.string()).optional(),
    organizationIds: z.array(z.union([z.number(), z.string()])).optional().default([0]),
  }).describe('Filter criteria to select assets for uninstallation without purge. `includedEndpointIds` is the primary way to target specific assets.')
});

// Schema for purge and uninstall assets arguments
// It reuses the structure but enforces includedEndpointIds must not be empty.
export const PurgeAndUninstallAssetsArgsSchema = z.object({
  filter: z.object({
    searchTerm: z.string().optional(),
    name: z.string().optional(),
    ipAddress: z.string().optional(),
    groupId: z.string().optional(),
    groupFullPath: z.string().optional(),
    managedStatus: z.array(z.string()).optional(),
    isolationStatus: z.array(z.string()).optional(),
    platform: z.array(z.string()).optional(),
    issue: z.string().optional(),
    onlineStatus: z.array(z.string()).optional(),
    tagId: z.string().optional(),
    version: z.string().optional(),
    policy: z.string().optional(),
    // Enforce that includedEndpointIds is provided and not empty
    includedEndpointIds: z.array(z.string()).min(1, { message: "Required: At least one endpoint ID must be included for the purge and uninstall operation." }),
    excludedEndpointIds: z.array(z.string()).optional(),
    organizationIds: z.array(z.union([z.number(), z.string()])).optional().default([0]),
  }).describe('Filter criteria to select assets for purge and uninstallation. `includedEndpointIds` is REQUIRED.')
});

// Schema for adding tags to assets arguments
export const AddTagsToAssetsArgsSchema = z.object({
  filter: z.object({
    searchTerm: z.string().optional(),
    name: z.string().optional(),
    ipAddress: z.string().optional(),
    groupId: z.string().optional(),
    groupFullPath: z.string().optional(),
    managedStatus: z.array(z.string()).optional(),
    isolationStatus: z.array(z.string()).optional(),
    platform: z.array(z.string()).optional(),
    issue: z.string().optional(),
    onlineStatus: z.array(z.string()).optional(),
    tagId: z.string().optional(), // Note: This filter might target assets that *already* have a specific tag.
    version: z.string().optional(),
    policy: z.string().optional(),
    includedEndpointIds: z.array(z.string()).min(1, { message: "Required: At least one endpoint ID must be included to add tags." }),
    excludedEndpointIds: z.array(z.string()).optional(),
    organizationIds: z.array(z.union([z.number(), z.string()])).optional().default([0]),
  }).describe('Filter criteria to select assets for adding tags. `includedEndpointIds` is REQUIRED.'),
  tags: z.array(z.string()).min(1, { message: "Required: At least one tag must be provided." }).describe('Array of tags to add to the selected assets.'),
});

// Schema for removing tags from assets arguments
export const RemoveTagsFromAssetsArgsSchema = z.object({
  filter: z.object({
    searchTerm: z.string().optional(),
    name: z.string().optional(),
    ipAddress: z.string().optional(),
    groupId: z.string().optional(),
    groupFullPath: z.string().optional(),
    managedStatus: z.array(z.string()).optional(),
    isolationStatus: z.array(z.string()).optional(),
    platform: z.array(z.string()).optional(),
    issue: z.string().optional(),
    onlineStatus: z.array(z.string()).optional(),
    tagId: z.string().optional(), // Filter assets by existing tag ID before removal
    version: z.string().optional(),
    policy: z.string().optional(),
    includedEndpointIds: z.array(z.string()).min(1, { message: "Required: At least one endpoint ID must be included to remove tags." }),
    excludedEndpointIds: z.array(z.string()).optional(),
    organizationIds: z.array(z.union([z.number(), z.string()])).optional().default([0]),
  }).describe('Filter criteria to select assets for removing tags. `includedEndpointIds` is REQUIRED.'),
  tags: z.array(z.string()).min(1, { message: "Required: At least one tag must be provided to remove." }).describe('Array of tags to remove from the selected assets.'),
});

// Format asset for display
function formatAsset(asset: Asset): string {
  return `
Asset: ${asset.name} (${asset._id})
OS: ${asset.os}
Platform: ${asset.platform}
CPU: ${asset.systemResources.cpu.model} (Usage: ${asset.systemResources.cpu.usage}%)
RAM: ${formatBytes(asset.systemResources.ram.freeSpace)} free of ${formatBytes(asset.systemResources.ram.totalSize)}
Status: ${asset.onlineStatus}
Issues: ${asset.issues.length > 0 ? asset.issues.join(', ') : 'None'}
`;
}

// Format detailed asset information
function formatAssetDetail(asset: AssetDetail): string {
  return `
Asset: ${asset.name} (${asset._id})
OS: ${asset.os}
Platform: ${asset.platform}
IP Address: ${asset.ipAddress}
Group: ${asset.groupFullPath} (${asset.groupId})
Type: ${asset.isServer ? 'Server' : 'Workstation'}
Management: ${asset.isManaged ? 'Managed' : 'Unmanaged'}
Last Seen: ${new Date(asset.lastSeen).toLocaleString()}
Version: ${asset.version} (${asset.versionNo})
Registered: ${new Date(asset.registeredAt).toLocaleString()}
Created: ${new Date(asset.createdAt).toLocaleString()}
Updated: ${new Date(asset.updatedAt).toLocaleString()}
Organization ID: ${asset.organizationId}
Online Status: ${asset.onlineStatus}
Isolation Status: ${asset.isolationStatus}
Tags: ${asset.tags.length > 0 ? asset.tags.join(', ') : 'None'}
Issues: ${asset.issues.length > 0 ? asset.issues.join(', ') : 'None'}
Waiting For Version Update Fix: ${asset.waitingForVersionUpdateFix ? 'Yes' : 'No'}
Policies: ${asset.policies.length > 0 ? asset.policies.length : 'None'}
`;
}

// Format asset task information
function formatAssetTask(task: AssetTask): string {
  return `
Task: ${task.name} (${task._id})
Task ID: ${task.taskId}
Type: ${task.type}
Endpoint: ${task.endpointName} (${task.endpointId})
Organization ID: ${task.organizationId}
Status: ${task.status}
Progress: ${task.progress}%
Duration: ${task.duration !== null ? `${task.duration} seconds` : 'N/A'}
Case IDs: ${task.caseIds ? task.caseIds.join(', ') : 'None'}
Created: ${new Date(task.createdAt).toLocaleString()}
Updated: ${new Date(task.updatedAt).toLocaleString()}
`;
}

// Helper function to format bytes to human-readable format
function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

export const assetTools = {
  // List all assets
  async listAssets(args: z.infer<typeof ListAssetsArgsSchema>) {
    try {
      const orgIds = args.organizationIds === undefined || args.organizationIds === "" 
        ? "0" 
        : args.organizationIds;
      const response = await api.getAssets(orgIds);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching assets: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const assetList = response.result.entities.map((asset: Asset) => 
        `${asset._id}: ${asset.name} (${asset.platform} - ${asset.os})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} assets:\n${assetList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch assets: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Get asset by ID
  async getAssetById(args: z.infer<typeof GetAssetByIdArgsSchema>) {
    try {
      const response = await api.getAssetById(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching asset: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Asset details:\n${formatAssetDetail(response.result)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch asset: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Get asset tasks by ID
  async getAssetTasksById(args: z.infer<typeof GetAssetTasksByIdArgsSchema>) {
    try {
      const response = await api.getAssetTasksById(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching asset tasks: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      if (response.result.entities.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No tasks found for asset with ID ${args.id}`
            }
          ]
        };
      }
      
      const tasksOverview = response.result.entities.map(task => 
        `${task._id}: ${task.name} (Type: ${task.type}, Status: ${task.status}, Progress: ${task.progress}%)`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} tasks for asset with ID ${args.id}:\n${tasksOverview}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch asset tasks: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Uninstall assets by filter without purge
  async uninstallAssets(args: z.infer<typeof UninstallAssetsArgsSchema>) {
    try {
      // Basic validation: Ensure at least one includedEndpointId is provided, even if schema makes it optional.
      // The API call itself might implicitly require it based on behavior, despite the optional schema field.
      if (!args.filter.includedEndpointIds || args.filter.includedEndpointIds.length === 0) {
         // Simplified check: if the array is missing or empty, return an error.
         return {
           content: [
             {
               type: 'text',
               text: 'Error: You must provide at least one endpoint ID in `filter.includedEndpointIds` to uninstall.'
             }
           ]
         };
      }
      
      const response = await api.uninstallAssetsByFilter(args.filter);
      
      if (response.success) {
        // No need to check args.filter.includedEndpointIds again, validation above ensures it exists and is non-empty
        const targetedIds = args.filter.includedEndpointIds.join(', '); 
        return {
          content: [
            {
              type: 'text',
              text: `Successfully initiated uninstall task for assets matching the filter (targeted IDs: ${targetedIds}).`
            }
          ]
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `Error uninstalling assets: ${response.errors.join(', ')} (Status Code: ${response.statusCode})`
            }
          ]
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during uninstall operation';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to uninstall assets: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Purge and Uninstall assets by filter
  async purgeAndUninstallAssets(args: z.infer<typeof PurgeAndUninstallAssetsArgsSchema>) {
    try {
      // Zod schema already enforces includedEndpointIds.min(1)
      
      const response = await api.purgeAndUninstallAssetsByFilter(args.filter);
      
      if (response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Successfully initiated purge and uninstall task for assets matching the filter (targeted IDs: ${args.filter.includedEndpointIds.join(', ')}).`
            }
          ]
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `Error purging and uninstalling assets: ${response.errors.join(', ')} (Status Code: ${response.statusCode})`
            }
          ]
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during purge and uninstall operation';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to purge and uninstall assets: ${errorMessage}`
          }
        ]
      };
    }
  },

  // New tool function to add tags to assets
  async addTagsToAssets(args: z.infer<typeof AddTagsToAssetsArgsSchema>) {
    try {
      // Schema validation already ensures includedEndpointIds and tags are present and non-empty.
      const response = await api.addTagsToAssetsByFilter(args.filter, args.tags);

      if (response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Successfully added tags [${args.tags.join(', ')}] to assets matching the filter (targeted IDs: ${args.filter.includedEndpointIds.join(', ')}).`
            }
          ]
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `Error adding tags to assets: ${response.errors.join(', ')} (Status Code: ${response.statusCode})`
            }
          ]
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during add tags operation';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to add tags to assets: ${errorMessage}`
          }
        ]
      };
    }
  },

  // New tool function to remove tags from assets
  async removeTagsFromAssets(args: z.infer<typeof RemoveTagsFromAssetsArgsSchema>) {
    try {
      // Schema validation already ensures includedEndpointIds and tags are present and non-empty.
      const response = await api.removeTagsFromAssetsByFilter(args.filter, args.tags);

      if (response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Successfully removed tags [${args.tags.join(', ')}] from assets matching the filter (targeted IDs: ${args.filter.includedEndpointIds.join(', ')}).`
            }
          ]
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `Error removing tags from assets: ${response.errors.join(', ')} (Status Code: ${response.statusCode})`
            }
          ]
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during remove tags operation';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to remove tags from assets: ${errorMessage}`
          }
        ]
      };
    }
  }
};