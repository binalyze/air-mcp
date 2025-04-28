import { z } from 'zod';
import { api, TaskAssignment } from '../api/tasks/assignments/assignments';

// Schema for get task assignments by ID arguments
export const GetTaskAssignmentsByIdArgsSchema = z.object({
  taskId: z.string().describe('The ID of the task to retrieve assignments for'),
});

// Format task assignment for display
function formatTaskAssignment(assignment: TaskAssignment): string {
  return `
Assignment: ${assignment.name} (${assignment._id})
Task ID: ${assignment.taskId}
Type: ${assignment.type}
Endpoint: ${assignment.endpointName} (${assignment.endpointId})
Organization: ${assignment.organizationId}
Status: ${assignment.status}
Progress: ${assignment.progress}%
Cases: ${assignment.caseIds.join(', ')}
Created at: ${new Date(assignment.createdAt).toLocaleString()}
Updated at: ${new Date(assignment.updatedAt).toLocaleString()}
`;
}

export const assignmentTools = {
  // Get task assignments by task ID
  async getTaskAssignmentsById(args: z.infer<typeof GetTaskAssignmentsByIdArgsSchema>) {
    try {
      const response = await api.getTaskAssignments(args.taskId);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching task assignments: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      if (response.result.entities.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No assignments found for task ID: ${args.taskId}`
            }
          ]
        };
      }
      
      const assignmentList = response.result.entities.map(assignment => 
        `${assignment._id}: ${assignment.name} (${assignment.status} - ${assignment.progress}%)`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} assignments for task ID ${args.taskId}:\n${assignmentList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch task assignments: ${errorMessage}`
          }
        ]
      };
    }
  },
};
