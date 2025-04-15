// src/tools/assets.ts
import { z } from 'zod';
import { api, Asset, AssetsResponse } from '../api/Assets/Assets';

// Schema for list assets arguments
export const ListAssetsArgsSchema = z.object({
  organizationIds: z.union([z.string(), z.array(z.string())]).optional(),
});

// Schema for get asset details arguments
export const GetAssetArgsSchema = z.object({
  id: z.string(),
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
      const response = await api.getAssets(args.organizationIds);
      
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
      
      const assetList = response.result.entities.map(asset => 
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
};