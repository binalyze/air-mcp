import { z } from 'zod';
import { api } from '../api/evidence/evidence';

// Schema for download case PPC file arguments
export const DownloadCasePpcArgsSchema = z.object({
  endpointId: z.string().describe('The ID of the endpoint to download the PPC file for'),
  taskId: z.string().describe('The ID of the task to download the PPC file for')
});

// Schema for download task report arguments
export const DownloadTaskReportArgsSchema = z.object({
  endpointId: z.string().describe('The ID of the endpoint to download the task report for'),
  taskId: z.string().describe('The ID of the task to download the task report for')
});

export const GetReportFileInfoArgsSchema = z.object({
  endpointId: z.string().describe('The ID of the endpoint to get report file information for'),
  taskId: z.string().describe('The ID of the task to get report file information for')
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
  // Download task report for a specific endpoint and task
  async downloadTaskReport(args: z.infer<typeof DownloadTaskReportArgsSchema>) {
    try {
      const { endpointId, taskId } = args;
      const response = await api.downloadTaskReport(endpointId, taskId);

      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error downloading task report: ${response.errors?.join(', ') || 'Unknown error'}`
            }
          ]
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `Successfully downloaded task report for endpoint ${endpointId} and task ${taskId}.\n\nResponse data: ${JSON.stringify(response.result, null, 2)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to download task report: ${errorMessage}`
          }
        ]
      };
    }
  },
  async getReportFileInfo(args: z.infer<typeof GetReportFileInfoArgsSchema>) {
    try {
      const { endpointId, taskId } = args;
      const response = await api.getReportFileInfo(endpointId, taskId);
  
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting report file information: ${response.errors?.join(', ') || 'Unknown error'}`
            }
          ]
        };
      }
  
      return {
        content: [
          {
            type: 'text',
            text: `Successfully retrieved report file information for endpoint ${endpointId} and task ${taskId}.\n\nResponse data: ${JSON.stringify(response.result, null, 2)}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to get report file information: ${errorMessage}`
          }
        ]
      };
    }
  }
};
