import { z } from 'zod';
import { api, Task } from '../api/tasks/tasks';

// Schema for list tasks arguments
export const ListTasksArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter tasks by. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
});

// Format task type to be more readable
function formatTaskType(type: string): string {
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format task for display
function formatTask(task: Task): string {
  return `
Task: ${task.name} (${task._id})
Type: ${formatTaskType(task.type)}
Status: ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}
Created by: ${task.createdBy}
Created at: ${new Date(task.createdAt).toLocaleString()}
Endpoints: ${task.totalAssignedEndpoints} assigned, ${task.totalCompletedEndpoints} completed, ${task.totalFailedEndpoints} failed, ${task.totalCancelledEndpoints} cancelled
`;
}

export const taskTools = {
  // List all tasks
  async listTasks(args: z.infer<typeof ListTasksArgsSchema>) {
    try {
      const orgIds = args.organizationIds === undefined || args.organizationIds === "" 
        ? "0" 
        : args.organizationIds;
      
      const response = await api.getTasks(orgIds);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching tasks: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      if (response.result.entities.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No tasks found for the specified criteria.'
            }
          ]
        };
      }
      
      const tasksList = response.result.entities.map(task => 
        `${task._id}: ${task.name} (Type: ${formatTaskType(task.type)}, Status: ${task.status})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} tasks:\n${tasksList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch tasks: ${errorMessage}`
          }
        ]
      };
    }
  },
};
