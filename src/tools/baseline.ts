import { z } from 'zod';
import { api, BaselineFilter, BaselineComparisonRequest } from '../api/baseline/baseline';

// Schema for acquire baseline arguments
export const AcquireBaselineArgsSchema = z.object({
  caseId: z.string().describe('The case ID to associate the baseline acquisition with'),
  filter: z.object({
    searchTerm: z.string().optional().describe('Optional search term'),
    name: z.string().optional().describe('Filter by asset name'),
    ipAddress: z.string().optional().describe('Filter by IP address'),
    groupId: z.string().optional().describe('Filter by group ID'),
    groupFullPath: z.string().optional().describe('Filter by full group path'),
    managedStatus: z.array(z.string()).optional().describe('Filter by managed status (e.g., ["managed"])'),
    isolationStatus: z.array(z.string()).optional().describe('Filter by isolation status (e.g., ["isolated"])'),
    platform: z.array(z.string()).optional().describe('Filter by platform (e.g., ["windows"])'),
    issue: z.string().optional().describe('Filter by issue'),
    onlineStatus: z.array(z.string()).optional().describe('Filter by online status (e.g., ["online"])'),
    tags: z.array(z.string()).optional().describe('Filter by tags'),
    version: z.string().optional().describe('Filter by agent version'),
    policy: z.string().optional().describe('Filter by policy'),
    includedEndpointIds: z.array(z.string()).describe('Array of endpoint IDs to include for baseline acquisition'),
    excludedEndpointIds: z.array(z.string()).optional().describe('Array of endpoint IDs to exclude'),
    organizationIds: z.array(z.number()).optional().describe('Organization IDs filter. Defaults to [0]'),
  }).describe('Filter object to specify which assets to acquire baseline from'),
});

// Schema for compare baseline arguments
export const CompareBaselineArgsSchema = z.object({
  endpointId: z.string().describe('The endpoint ID to compare baselines for'),
  taskIds: z.array(z.string()).min(2).describe('Array of baseline task IDs to compare (minimum 2)'),
});

export const baselineTools = {
  // Acquire baseline by filter
  async acquireBaseline(args: z.infer<typeof AcquireBaselineArgsSchema>) {
    try {
      const { caseId, filter } = args;
      
      // Set defaults for organizationIds if not provided
      if (!filter.organizationIds || filter.organizationIds.length === 0) {
        filter.organizationIds = [0];
      }
      
      const response = await api.acquireBaseline({
        caseId,
        filter: filter as BaselineFilter
      });
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error acquiring baseline: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      if (response.result.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No baseline acquisition tasks created. Check the filter criteria and ensure target endpoints exist.'
            }
          ]
        };
      }
      
      const taskList = response.result.map(task => 
        `Task ID: ${task._id}\nName: ${task.name}\nOrganization ID: ${task.organizationId}`
      ).join('\n\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully created ${response.result.length} baseline acquisition task(s):\n\n${taskList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to acquire baseline: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Compare baselines by endpoint ID and task IDs
  async compareBaseline(args: z.infer<typeof CompareBaselineArgsSchema>) {
    try {
      const { endpointId, taskIds } = args;
      
      const response = await api.compareBaseline({
        endpointId,
        taskIds
      } as BaselineComparisonRequest);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error comparing baselines: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      if (response.result.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No comparison tasks created. Check the endpoint ID and task IDs and ensure they exist.'
            }
          ]
        };
      }
      
      const comparisonList = response.result.map(result => 
        `Comparison ID: ${result._id}\nName: ${result.name}\nOrganization ID: ${result.organizationId}`
      ).join('\n\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully created ${response.result.length} baseline comparison task(s):\n\n${comparisonList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to compare baselines: ${errorMessage}`
          }
        ]
      };
    }
  },
};
