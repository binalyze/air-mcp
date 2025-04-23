// src/tools/assets.ts
import { z } from 'zod';
import { api, Asset, AssetDetail} from '../api/assets/assets';

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
};