import { z } from 'zod';
import { api, Task } from '../api/tasks/tasks';

// Schema for list tasks arguments
export const ListTasksArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter tasks by. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
});

// Schema for get task by ID arguments
export const GetTaskByIdArgsSchema = z.object({
  id: z.string().describe('The ID of the task to retrieve'),
});

// Schema for cancel task by ID arguments
export const CancelTaskByIdArgsSchema = z.object({
  id: z.string().describe('The ID of the task to cancel'),
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

// Format detailed task information including data field
function formatDetailedTask(task: Task): string {
  let output = formatTask(task);
  
  if (task.data) {
    if (task.data.profileId) {
      output += `Profile ID: ${task.data.profileId}\n`;
    }
    if (task.data.profileName) {
      output += `Profile Name: ${task.data.profileName}\n`;
    }
    
    // Add Windows evidence types if available
    if (task.data.windows?.evidenceTypes && task.data.windows.evidenceTypes.length > 0) {
      output += `Windows Evidence Types: ${task.data.windows.evidenceTypes.join(', ')}\n`;
    }
    
    // Add Linux evidence types if available
    if (task.data.linux?.evidenceTypes && task.data.linux.evidenceTypes.length > 0) {
      output += `Linux Evidence Types: ${task.data.linux.evidenceTypes.join(', ')}\n`;
    }
    
    // Add configuration details if available
    if (task.data.config?.cpu?.limit) {
      output += `CPU Limit: ${task.data.config.cpu.limit}%\n`;
    }
    
    if (task.data.config?.compression) {
      output += `Compression Enabled: ${task.data.config.compression.enabled}\n`;
      if (task.data.config.compression.encryption) {
        output += `Encryption Enabled: ${task.data.config.compression.encryption.enabled}\n`;
      }
    }
    
    // Add drone details if available
    if (task.data.drone) {
      output += `Drone Enabled: ${task.data.drone.enabled}\n`;
      if (task.data.drone.enabled) {
        output += `Drone AutoPilot: ${task.data.drone.autoPilot}\n`;
        output += `Drone Min Score: ${task.data.drone.minScore}\n`;
        if (task.data.drone.analyzers && task.data.drone.analyzers.length > 0) {
          output += `Drone Analyzers: ${task.data.drone.analyzers.join(', ')}\n`;
        }
        if (task.data.drone.keywords && task.data.drone.keywords.length > 0) {
          output += `Drone Keywords: ${task.data.drone.keywords.join(', ')}\n`;
        }
      }
    }
  }
  
  return output;
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

  // Get task by ID
  async getTaskById(args: z.infer<typeof GetTaskByIdArgsSchema>) {
    try {
      const response = await api.getTaskById(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching task: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: formatDetailedTask(response.result)
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch task with ID ${args.id}: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Cancel task by ID
  async cancelTaskById(args: z.infer<typeof CancelTaskByIdArgsSchema>) {
    try {
      const response = await api.cancelTaskById(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error cancelling task: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Task with ID ${args.id} has been successfully cancelled.`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to cancel task with ID ${args.id}: ${errorMessage}`
          }
        ]
      };
    }
  },
};
