// src/tools/assign-task.ts
import { z } from 'zod';
import { assignTaskApi, AssetFilter } from '../api/assets/assign-task/assign-task';

// Schema for assign reboot task arguments
export const AssignRebootTaskArgsSchema = z.object({
  endpointIds: z.union([
    z.string(),
    z.array(z.string())
  ]).describe('Endpoint ID(s) to reboot. Can be a single ID or an array of IDs.'),
  organizationIds: z.union([
    z.number(),
    z.string(),
    z.array(z.union([z.number(), z.string()]))
  ]).optional().default(0).describe('Organization ID(s) to filter endpoints by. Defaults to 0.'),
  managedStatus: z.array(z.string()).optional().default(['managed']).describe('Filter endpoints by managed status. Default is ["managed"].'),
});

// Schema for assign shutdown task arguments
export const AssignShutdownTaskArgsSchema = z.object({
  endpointIds: z.union([
    z.string(),
    z.array(z.string())
  ]).describe('Endpoint ID(s) to shutdown. Can be a single ID or an array of IDs.'),
  organizationIds: z.union([
    z.number(),
    z.string(),
    z.array(z.union([z.number(), z.string()]))
  ]).optional().default(0).describe('Organization ID(s) to filter endpoints by. Defaults to 0.'),
  managedStatus: z.array(z.string()).optional().default(['managed']).describe('Filter endpoints by managed status. Default is ["managed"].'),
});

// Schema for assign isolation task arguments
export const AssignIsolationTaskArgsSchema = z.object({
  endpointIds: z.union([
    z.string(),
    z.array(z.string())
  ]).describe('Endpoint ID(s) to isolate or unisolate. Can be a single ID or an array of IDs.'),
  enabled: z.boolean().default(true).describe('Whether to enable (isolate) or disable (unisolate) isolation. Defaults to true.'),
  organizationIds: z.union([
    z.number(),
    z.string(),
    z.array(z.union([z.number(), z.string()]))
  ]).optional().default(0).describe('Organization ID(s) to filter endpoints by. Defaults to 0.'),
  managedStatus: z.array(z.string()).optional().default(['managed']).describe('Filter endpoints by managed status. Default is ["managed"].'),
});

// Schema for assign log retrieval task arguments
export const AssignLogRetrievalTaskArgsSchema = z.object({
  endpointIds: z.union([
    z.string(),
    z.array(z.string())
  ]).describe('Endpoint ID(s) to retrieve logs from. Can be a single ID or an array of IDs.'),
  organizationIds: z.union([
    z.number(),
    z.string(),
    z.array(z.union([z.number(), z.string()]))
  ]).describe('Organization ID(s) to filter endpoints by. This is REQUIRED to identify the correct endpoints. Examples: 0, "123", [0], ["123", "456"]'),
  managedStatus: z.array(z.string()).optional().default(['managed']).describe('Filter endpoints by managed status. Default is ["managed"].'),
});

// Schema for assign version update task arguments
export const AssignVersionUpdateTaskArgsSchema = z.object({
  endpointIds: z.union([
    z.string(),
    z.array(z.string())
  ]).describe('Endpoint ID(s) to update version. Can be a single ID or an array of IDs.'),
  organizationIds: z.union([
    z.number(),
    z.string(),
    z.array(z.union([z.number(), z.string()]))
  ]).optional().default(0).describe('Organization ID(s) to filter endpoints by. Defaults to 0.'),
  managedStatus: z.array(z.string()).optional().default(['managed']).describe('Filter endpoints by managed status. Default is ["managed"].'),
});

export const assignTaskTools = {
  // Assign a reboot task to endpoints
  async assignRebootTask(args: z.infer<typeof AssignRebootTaskArgsSchema>) {
    try {
      // Prepare filter object
      const filter: AssetFilter = {
        includedEndpointIds: Array.isArray(args.endpointIds) ? args.endpointIds : [args.endpointIds],
        managedStatus: args.managedStatus,
      };
      
      // Handle organization IDs
      if (args.organizationIds !== undefined) {
        if (Array.isArray(args.organizationIds)) {
          filter.organizationIds = args.organizationIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
        } else {
          filter.organizationIds = [typeof args.organizationIds === 'string' ? parseInt(args.organizationIds, 10) : args.organizationIds];
        }
      }

      const response = await assignTaskApi.assignRebootTask(filter);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error assigning reboot task: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const taskList = response.result.map(task => 
        `${task._id}: ${task.name} (Organization: ${task.organizationId})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully assigned ${response.result.length} reboot task(s):\n${taskList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to assign reboot task: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Assign a shutdown task to endpoints
  async assignShutdownTask(args: z.infer<typeof AssignShutdownTaskArgsSchema>) {
    try {
      // Prepare filter object
      const filter: AssetFilter = {
        includedEndpointIds: Array.isArray(args.endpointIds) ? args.endpointIds : [args.endpointIds],
        managedStatus: args.managedStatus,
      };
      
      // Handle organization IDs
      if (args.organizationIds !== undefined) {
        if (Array.isArray(args.organizationIds)) {
          filter.organizationIds = args.organizationIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
        } else {
          filter.organizationIds = [typeof args.organizationIds === 'string' ? parseInt(args.organizationIds, 10) : args.organizationIds];
        }
      }

      const response = await assignTaskApi.assignShutdownTask(filter);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error assigning shutdown task: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const taskList = response.result.map(task => 
        `${task._id}: ${task.name} (Organization: ${task.organizationId})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully assigned ${response.result.length} shutdown task(s):\n${taskList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to assign shutdown task: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Assign an isolation task to endpoints
  async assignIsolationTask(args: z.infer<typeof AssignIsolationTaskArgsSchema>) {
    try {
      // Prepare filter object
      const filter: AssetFilter = {
        includedEndpointIds: Array.isArray(args.endpointIds) ? args.endpointIds : [args.endpointIds],
        managedStatus: args.managedStatus,
      };
      
      // Handle organization IDs
      if (args.organizationIds !== undefined) {
        if (Array.isArray(args.organizationIds)) {
          filter.organizationIds = args.organizationIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
        } else {
          filter.organizationIds = [typeof args.organizationIds === 'string' ? parseInt(args.organizationIds, 10) : args.organizationIds];
        }
      }

      const response = await assignTaskApi.assignIsolationTask(args.enabled, filter);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error assigning isolation task: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const taskList = response.result.map(task => 
        `${task._id}: ${task.name} (Organization: ${task.organizationId})`
      ).join('\n');
      
      const actionType = args.enabled ? "isolation" : "unisolation";
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully assigned ${response.result.length} ${actionType} task(s):\n${taskList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to assign isolation task: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Assign a log retrieval task to endpoints
  async assignLogRetrievalTask(args: z.infer<typeof AssignLogRetrievalTaskArgsSchema>) {
    try {
      // Prepare filter object
      const filter: AssetFilter = {
        includedEndpointIds: Array.isArray(args.endpointIds) ? args.endpointIds : [args.endpointIds],
        managedStatus: args.managedStatus,
      };
      
      // Handle organization IDs - required for log retrieval
      if (args.organizationIds !== undefined) {
        if (Array.isArray(args.organizationIds)) {
          filter.organizationIds = args.organizationIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
        } else {
          filter.organizationIds = [typeof args.organizationIds === 'string' ? parseInt(args.organizationIds, 10) : args.organizationIds];
        }
      } else {
        // Default to organization ID 0 if not provided
        filter.organizationIds = [0];
      }

      const response = await assignTaskApi.assignLogRetrievalTask(filter);
      
      if (!response.success) {
        let errorMessage = response.errors.join(', ');
        
        // Provide a more helpful error message for common issues
        if (errorMessage.includes('No managed endpoint(s) found by provided filter criteria')) {
          errorMessage = `No managed endpoints found. Make sure the endpoint IDs and organization IDs are correct. The endpoint must exist in the specified organization. Try using the list_assets tool first to verify the endpoints, and ensure you provide the correct organizationIds parameter.`;
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `Error assigning log retrieval task: ${errorMessage}`
            }
          ]
        };
      }
      
      const taskList = response.result.map(task => 
        `${task._id}: ${task.name} (Organization: ${task.organizationId})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully assigned ${response.result.length} log retrieval task(s):\n${taskList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to assign log retrieval task: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Assign a version update task to endpoints
  async assignVersionUpdateTask(args: z.infer<typeof AssignVersionUpdateTaskArgsSchema>) {
    try {
      // Prepare filter object
      const filter: AssetFilter = {
        includedEndpointIds: Array.isArray(args.endpointIds) ? args.endpointIds : [args.endpointIds],
        managedStatus: args.managedStatus,
      };
      
      // Handle organization IDs
      if (args.organizationIds !== undefined) {
        if (Array.isArray(args.organizationIds)) {
          filter.organizationIds = args.organizationIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
        } else {
          filter.organizationIds = [typeof args.organizationIds === 'string' ? parseInt(args.organizationIds, 10) : args.organizationIds];
        }
      }

      const response = await assignTaskApi.assignVersionUpdateTask(filter);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error assigning version update task: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const taskList = response.result.map(task => 
        `${task._id}: ${task.name} (Organization: ${task.organizationId})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully assigned ${response.result.length} version update task(s):\n${taskList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to assign version update task: ${errorMessage}`
          }
        ]
      };
    }
  },
};
