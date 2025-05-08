import { z } from 'zod';
import { api } from '../api/evidence/evidence';

// Schema for download case PPC file arguments
export const DownloadCasePpcArgsSchema = z.object({
  endpointId: z.string().describe('The ID of the endpoint to download the PPC file for'),
  taskId: z.string().describe('The ID of the task to download the PPC file for')
});

export const evidenceTools = {
  // Download PPC file for a specific endpoint and task
  async downloadCasePpc(args: z.infer<typeof DownloadCasePpcArgsSchema>) {
    try {
      const { endpointId, taskId } = args;
      const response = await api.downloadCasePpc(endpointId, taskId);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error downloading PPC file: ${response.errors?.join(', ') || 'Unknown error'}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully downloaded PPC file for endpoint ${endpointId} and task ${taskId}.\n\nResponse data: ${JSON.stringify(response.result, null, 2)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to download PPC file: ${errorMessage}`
          }
        ]
      };
    }
  },
};
