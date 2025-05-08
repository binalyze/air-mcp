import { z } from 'zod';
import { api, BannerSettings } from '../api/settings/settings';

// Schema for update banner message arguments
export const UpdateBannerMessageArgsSchema = z.object({
  enabled: z.boolean().describe('Whether the banner message is enabled or disabled'),
});

// Format banner update response for display
function formatBannerUpdateResponse(success: boolean, statusCode: number, errors: string[]): string {
  if (success) {
    return `Banner message updated successfully (Status code: ${statusCode})`;
  } else {
    return `Failed to update banner message (Status code: ${statusCode})\nErrors: ${errors.join(', ')}`;
  }
}

export const settingsTools = {
  // Update the banner message settings
  async updateBannerMessage(args: z.infer<typeof UpdateBannerMessageArgsSchema>) {
    try {
      const settings: BannerSettings = {
        enabled: args.enabled
      };
      
      const response = await api.updateBannerMessage(settings);
      
      return {
        content: [
          {
            type: 'text',
            text: formatBannerUpdateResponse(response.success, response.statusCode, response.errors)
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update banner message: ${errorMessage}`
          }
        ]
      };
    }
  }
};