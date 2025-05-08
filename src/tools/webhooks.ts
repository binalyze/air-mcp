import { z } from 'zod';
import { api, AssignmentResponse, WebhookResponse } from '../api/webhooks/webhooks';

// Schema for call webhook arguments
export const CallWebhookArgsSchema = z.object({
  slug: z.string().describe('The webhook slug (e.g., "air-generic-url-webhook")'),
  data: z.string().describe('The data parameter for the webhook (e.g., IP address like "192.168.1.100")'),
  token: z.string().describe('The webhook token for authentication'),
});

export const PostWebhookArgsSchema = z.object({
  slug: z.string().describe('The webhook slug (e.g., "air-generic-url-webhook")'),
  data: z.any().describe('The data to be sent in the request body'),
  token: z.string().describe('The webhook token for authentication'),
});

export const GetTaskAssignmentsArgsSchema = z.object({
  slug: z.string().describe('The webhook slug (e.g., "air-generic-url-webhook")'),
  taskId: z.string().describe('The ID of the task to retrieve assignments for'),
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

function formatAssignmentResponse(assignments: AssignmentResponse[]): string {
  if (assignments.length === 0) {
    return 'No assignments found for this task.';
  }

  return assignments.map(assignment => `
Assignment ID: ${assignment.assignmentId}
Task ID: ${assignment.taskId}
Task Name: ${assignment.taskName}
Endpoint ID: ${assignment.endpointId}
Endpoint Name: ${assignment.endpointName}
Organization ID: ${assignment.organizationId}
Status: ${assignment.assignmentStatus}
Progress: ${assignment.progress}%
Started At: ${assignment.startedAt}
Has Drone Data: ${assignment.hasDroneData}
Has Case PPC: ${assignment.hasCasePpc}
Report Status: ${assignment.reportStatus}
Report ID: ${assignment.reportId}
Report URL: ${assignment.reportUrl}
`).join('\n---\n');
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
  },
  async postWebhook(args: z.infer<typeof PostWebhookArgsSchema>) {
    try {
      const statusCode = await api.postWebhook(args.slug, args.data, args.token);
      
      return {
        content: [
          {
            type: 'text',
            text: `Webhook POST request completed with status code: ${statusCode}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to post to webhook: ${errorMessage}`
          }
        ]
      };
    }
  },
  async getTaskAssignments(args: z.infer<typeof GetTaskAssignmentsArgsSchema>) {
    try {
      const assignments = await api.getTaskAssignments(args.slug, args.token, args.taskId);
      
      return {
        content: [
          {
            type: 'text',
            text: formatAssignmentResponse(assignments)
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to get task assignments: ${errorMessage}`
          }
        ]
      };
    }
  }
};