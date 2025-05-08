import { z } from 'zod';
import { api, WebhookResponse } from '../api/webhooks/webhooks';

// Schema for call webhook arguments
export const CallWebhookArgsSchema = z.object({
  slug: z.string().describe('The webhook slug (e.g., "air-generic-url-webhook")'),
  data: z.string().describe('The data parameter for the webhook (e.g., IP address like "192.168.1.100")'),
  token: z.string().describe('The webhook token for authentication'),
});

// Format webhook response for display
function formatWebhookResponse(response: WebhookResponse): string {
  return `
Task ID: ${response.taskId}
Task Details View URL: ${response.taskDetailsViewUrl}
Task Details Data URL: ${response.taskDetailsDataUrl}
Status Code: ${response.statusCode}
`;
}

export const webhookTools = {
  // Call a webhook with the provided parameters
  async callWebhook(args: z.infer<typeof CallWebhookArgsSchema>) {
    try {
      const response = await api.callWebhook(args.slug, args.data, args.token);
      
      return {
        content: [
          {
            type: 'text',
            text: formatWebhookResponse(response)
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to call webhook: ${errorMessage}`
          }
        ]
      };
    }
  }
};