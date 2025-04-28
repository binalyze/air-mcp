import { z } from 'zod';
import { api, Policy, CreatePolicyRequest, FilterCondition, UpdatePolicyRequest, UpdatePolicyPrioritiesRequest, PolicyMatchStatsRequest } from '../api/policies/policies';

// Schema for list policies arguments
export const ListPoliciesArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter policies by. Leave empty to use default (0).'),
});

const FilterConditionSchema: z.ZodType<FilterCondition> = z.lazy(() => 
  z.object({
    field: z.string().optional().describe('Field name to check'),
    operator: z.string().describe('Operator for comparison or logic'),
    value: z.string().optional().describe('Value to compare against'),
    conditions: z.array(FilterConditionSchema).optional().describe('Nested conditions'),
    id: z.string().optional().describe('Condition ID'),
    disabled: z.boolean().optional().describe('Whether condition is disabled'),
    version: z.string().optional().describe('Version information')
  })
);

// Schema for create policy arguments
export const CreatePolicyArgsSchema = z.object({
  name: z.string().describe('Name for the new policy'),
  organizationIds: z.union([
    z.array(z.number()),
    z.array(z.string()),
    z.number(),
    z.string()
  ]).optional().default([0]).describe('Organization IDs to associate with policy. Defaults to [0].'),
  saveTo: z.object({
    windows: z.object({
      location: z.string().describe('Storage location for Windows (e.g., "local")'),
      path: z.string().describe('Path for evidence storage on Windows'),
      useMostFreeVolume: z.boolean().describe('Whether to use volume with most free space'),
      volume: z.string().describe('Volume to use for Windows (e.g., "C:")'),
      tmp: z.string().optional().describe('Temporary folder path for Windows')
    }),
    linux: z.object({
      location: z.string().describe('Storage location for Linux (e.g., "local")'),
      path: z.string().describe('Path for evidence storage on Linux'),
      useMostFreeVolume: z.boolean().describe('Whether to use volume with most free space'),
      volume: z.string().describe('Volume to use for Linux (e.g., "/")'),
      tmp: z.string().optional().describe('Temporary folder path for Linux')
    }),
    macos: z.object({
      location: z.string().describe('Storage location for macOS (e.g., "local")'),
      path: z.string().describe('Path for evidence storage on macOS'),
      useMostFreeVolume: z.boolean().describe('Whether to use volume with most free space'),
      volume: z.string().describe('Volume to use for macOS (e.g., "/")'),
      tmp: z.string().optional().describe('Temporary folder path for macOS')
    })
  }).describe('Configuration for where to save evidence'),
  compression: z.object({
    enabled: z.boolean().describe('Whether compression is enabled'),
    encryption: z.object({
      enabled: z.boolean().describe('Whether encryption is enabled'),
      password: z.string().optional().describe('Password for encryption when enabled')
    })
  }).describe('Compression and encryption settings'),
  sendTo: z.object({
    location: z.string().describe('Location to send evidence to (e.g., "user-local")')
  }).describe('Configuration for where to send evidence'),
  cpu: z.object({
    limit: z.number().optional().describe('CPU usage limit percentage (1-100)')
  }).optional().describe('CPU usage limits'),
  filter: z.object({
    operator: z.string().describe('Logical operator for combining conditions (e.g., "and", "or")'),
    conditions: z.array(FilterConditionSchema).describe('Array of conditions for policy filtering')
  }).optional().describe('Filter conditions to determine which endpoints the policy applies to')
});

// Schema for update policy arguments
export const UpdatePolicyArgsSchema = z.object({
  id: z.string().describe('The ID of the policy to update'),
  name: z.string().describe('Name for the policy'),
  organizationIds: z.union([
    z.array(z.number()),
    z.array(z.string()),
    z.number(),
    z.string()
  ]).optional().default([0]).describe('Organization IDs to associate with policy. Defaults to [0].'),
  saveTo: z.object({
    windows: z.object({
      location: z.string().describe('Storage location for Windows (e.g., "local")'),
      path: z.string().describe('Path for evidence storage on Windows'),
      useMostFreeVolume: z.boolean().describe('Whether to use volume with most free space'),
      volume: z.string().describe('Volume to use for Windows (e.g., "C:")'),
      tmp: z.string().optional().describe('Temporary folder path for Windows')
    }),
    linux: z.object({
      location: z.string().describe('Storage location for Linux (e.g., "local")'),
      path: z.string().describe('Path for evidence storage on Linux'),
      useMostFreeVolume: z.boolean().describe('Whether to use volume with most free space'),
      volume: z.string().describe('Volume to use for Linux (e.g., "/")'),
      tmp: z.string().optional().describe('Temporary folder path for Linux')
    }),
    macos: z.object({
      location: z.string().describe('Storage location for macOS (e.g., "local")'),
      path: z.string().describe('Path for evidence storage on macOS'),
      useMostFreeVolume: z.boolean().describe('Whether to use volume with most free space'),
      volume: z.string().describe('Volume to use for macOS (e.g., "/")'),
      tmp: z.string().optional().describe('Temporary folder path for macOS')
    })
  }).describe('Configuration for where to save evidence'),
  compression: z.object({
    enabled: z.boolean().describe('Whether compression is enabled'),
    encryption: z.object({
      enabled: z.boolean().describe('Whether encryption is enabled'),
      password: z.string().optional().describe('Password for encryption when enabled')
    })
  }).describe('Compression and encryption settings'),
  sendTo: z.object({
    location: z.string().describe('Location to send evidence to (e.g., "user-local")')
  }).describe('Configuration for where to send evidence'),
  cpu: z.object({
    limit: z.number().optional().describe('CPU usage limit percentage (1-100)')
  }).optional().describe('CPU usage limits'),
  filter: z.object({
    operator: z.string().describe('Logical operator for combining conditions (e.g., "and", "or")'),
    conditions: z.array(FilterConditionSchema).describe('Array of conditions for policy filtering')
  }).optional().describe('Filter conditions to determine which endpoints the policy applies to')
});

// Schema for get policy by ID arguments
export const GetPolicyByIdArgsSchema = z.object({
  id: z.string().describe('The ID of the policy to retrieve'),
});

// Schema for update policy priorities arguments
export const UpdatePolicyPrioritiesArgsSchema = z.object({
  ids: z.array(z.string()).min(1).describe('Ordered list of policy IDs that defines their priority (first has highest priority)'),
  organizationIds: z.union([
    z.array(z.number()),
    z.array(z.string()),
    z.number(),
    z.string()
  ]).optional().default([0]).describe('Organization IDs to associate with priority update. Defaults to [0].'),
});

// Schema for policy match stats arguments
export const PolicyMatchStatsArgsSchema = z.object({
  name: z.string().optional().describe('Filter assets by name'),
  searchTerm: z.string().optional().describe('General search term for filtering assets'),
  ipAddress: z.string().optional().describe('Filter assets by IP address'),
  groupId: z.string().optional().describe('Filter assets by group ID'),
  groupFullPath: z.string().optional().describe('Filter assets by full group path'),
  managedStatus: z.array(z.string()).optional().describe('Filter assets by managed status (e.g., ["managed"])'),
  isolationStatus: z.array(z.string()).optional().describe('Filter assets by isolation status (e.g., ["isolated"])'),
  platform: z.array(z.string()).optional().describe('Filter assets by platform (e.g., ["windows"])'),
  issue: z.string().optional().describe('Filter assets by issue'),
  onlineStatus: z.array(z.string()).optional().describe('Filter assets by online status (e.g., ["online"])'),
  tags: z.array(z.string()).optional().describe('Filter assets by tags'),
  version: z.string().optional().describe('Filter assets by agent version'),
  policy: z.string().optional().describe('Filter assets by policy name'),
  includedEndpointIds: z.array(z.string()).optional().describe('Include only these endpoint IDs'),
  excludedEndpointIds: z.array(z.string()).optional().describe('Exclude these endpoint IDs'),
  organizationIds: z.union([
    z.array(z.number()),
    z.array(z.string()),
    z.number(),
    z.string()
  ]).optional().describe('Organization IDs to filter by. Defaults to [0].'),
});

// Format policy for display
function formatPolicy(policy: Policy): string {
  return `
Policy: ${policy.name} (${policy._id})
Default: ${policy.default ? 'Yes' : 'No'}
Created by: ${policy.createdBy}
Last updated: ${new Date(policy.updatedAt).toLocaleString()}
CPU limit: ${policy.cpu.limit}%
`;
}

export const policyTools = {
  // List all policies
  async listPolicies(args: z.infer<typeof ListPoliciesArgsSchema>) {
    try {
      const orgIds = args.organizationIds === undefined || args.organizationIds === "" 
        ? "0" 
        : args.organizationIds;
      
      const response = await api.getPolicies(orgIds);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching policies: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      const policyList = response.result.entities.map(policy => 
        `${policy._id}: ${policy.name} (Default: ${policy.default ? 'Yes' : 'No'}, Created by: ${policy.createdBy})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} policies:\n${policyList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch policies: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Create a new policy
  async createPolicy(args: z.infer<typeof CreatePolicyArgsSchema>) {
    try {
      // Format organizationIds to ensure it's an array of the same type
      let organizationIds: number[] | string[];
      if (typeof args.organizationIds === 'number') {
        organizationIds = [args.organizationIds];
      } else if (typeof args.organizationIds === 'string') {
        organizationIds = [args.organizationIds];
      } else if (Array.isArray(args.organizationIds)) {
        // Check if all elements are numbers
        if (args.organizationIds.every(id => typeof id === 'number')) {
          organizationIds = args.organizationIds as number[];
        } else {
          // Convert any numbers to strings to ensure consistent array type
          organizationIds = args.organizationIds.map(id => String(id));
        }
      } else {
        organizationIds = [0]; // Default
      }

      const policyData: CreatePolicyRequest = {
        name: args.name,
        organizationIds,
        saveTo: args.saveTo,
        compression: args.compression,
        sendTo: args.sendTo,
        cpu: args.cpu,
        filter: args.filter
      };

      const response = await api.createPolicy(policyData);

      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating policy: ${response.errors.join(', ')}`
            }
          ]
        };
      }

      if (!response.result) {
        return {
          content: [
            {
              type: 'text',
              text: 'Policy created successfully but no details were returned.'
            }
          ]
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `Policy created successfully: ${response.result.name} (ID: ${response.result._id})`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to create policy: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Update an existing policy
  async updatePolicy(args: z.infer<typeof UpdatePolicyArgsSchema>) {
    try {
      // Format organizationIds to ensure it's an array of the same type
      let organizationIds: number[] | string[];
      if (typeof args.organizationIds === 'number') {
        organizationIds = [args.organizationIds];
      } else if (typeof args.organizationIds === 'string') {
        organizationIds = [args.organizationIds];
      } else if (Array.isArray(args.organizationIds)) {
        // Check if all elements are numbers
        if (args.organizationIds.every(id => typeof id === 'number')) {
          organizationIds = args.organizationIds as number[];
        } else {
          // Convert any numbers to strings to ensure consistent array type
          organizationIds = args.organizationIds.map(id => String(id));
        }
      } else {
        organizationIds = [0]; // Default
      }

      const policyData: UpdatePolicyRequest = {
        name: args.name,
        organizationIds,
        saveTo: args.saveTo,
        compression: args.compression,
        sendTo: args.sendTo,
        cpu: args.cpu,
        filter: args.filter
      };

      const response = await api.updatePolicy(args.id, policyData);

      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating policy: ${response.errors.join(', ')}`
            }
          ]
        };
      }

      if (!response.result) {
        return {
          content: [
            {
              type: 'text',
              text: 'Policy updated successfully but no details were returned.'
            }
          ]
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `Policy updated successfully: ${response.result.name} (ID: ${response.result._id})`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update policy: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Get policy by ID
  async getPolicyById(args: z.infer<typeof GetPolicyByIdArgsSchema>) {
    try {
      const response = await api.getPolicyById(args.id);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching policy: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      if (!response.result) {
        return {
          content: [
            {
              type: 'text',
              text: `No policy found with ID: ${args.id}`
            }
          ]
        };
      }
      
      const policy = response.result;
      
      // Create a detailed policy information object
      const policyInfo = {
        id: policy._id,
        name: policy.name,
        default: policy.default,
        createdBy: policy.createdBy,
        updatedAt: new Date(policy.updatedAt).toLocaleString(),
        organizationIds: policy.organizationIds,
        cpuLimit: policy.cpu.limit,
        saveTo: policy.saveTo,
        sendTo: policy.sendTo,
        compression: policy.compression
      };
      
      return {
        content: [
          {
            type: 'text',
            text: formatPolicy(policy)
          },
          {
            type: 'json',
            json: policyInfo
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch policy: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Update policy priorities (order)
  async updatePolicyPriorities(args: z.infer<typeof UpdatePolicyPrioritiesArgsSchema>) {
    try {
      // Format organizationIds to ensure it's an array of the same type
      let organizationIds: number[] | string[];
      if (typeof args.organizationIds === 'number') {
        organizationIds = [args.organizationIds];
      } else if (typeof args.organizationIds === 'string') {
        organizationIds = [args.organizationIds];
      } else if (Array.isArray(args.organizationIds)) {
        // Check if all elements are numbers
        if (args.organizationIds.every(id => typeof id === 'number')) {
          organizationIds = args.organizationIds as number[];
        } else {
          // Convert any numbers to strings to ensure consistent array type
          organizationIds = args.organizationIds.map(id => String(id));
        }
      } else {
        organizationIds = [0]; // Default
      }

      const priorityData: UpdatePolicyPrioritiesRequest = {
        ids: args.ids,
        organizationIds
      };

      const response = await api.updatePolicyPriorities(priorityData);

      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating policy priorities: ${response.errors.join(', ')}`
            }
          ]
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `Policy priorities updated successfully. The policies will be applied in this order: ${args.ids.join(', ')}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update policy priorities: ${errorMessage}`
          }
        ]
      };
    }
  },

  // Get policy match statistics
  async getPolicyMatchStats(args: z.infer<typeof PolicyMatchStatsArgsSchema>) {
    try {
      // Format organizationIds to ensure it's an array
      let organizationIds: (number | string)[] | undefined;
      if (args.organizationIds !== undefined) {
        if (typeof args.organizationIds === 'number' || typeof args.organizationIds === 'string') {
          organizationIds = [args.organizationIds];
        } else {
          organizationIds = args.organizationIds;
        }
      }

      const filter: PolicyMatchStatsRequest = {
        name: args.name,
        searchTerm: args.searchTerm,
        ipAddress: args.ipAddress,
        groupId: args.groupId,
        groupFullPath: args.groupFullPath,
        managedStatus: args.managedStatus,
        isolationStatus: args.isolationStatus,
        platform: args.platform,
        issue: args.issue,
        onlineStatus: args.onlineStatus,
        tags: args.tags,
        version: args.version,
        policy: args.policy,
        includedEndpointIds: args.includedEndpointIds,
        excludedEndpointIds: args.excludedEndpointIds,
        organizationIds: organizationIds
      };

      const response = await api.getPolicyMatchStats(filter);

      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching policy match stats: ${response.errors.join(', ')}`
            }
          ]
        };
      }

      if (!response.result || response.result.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No policy match statistics found for the specified filters.'
            }
          ]
        };
      }

      // Format the match stats for display
      const statsText = response.result.map(stat => 
        `${stat.name} (${stat._id}): ${stat.count} endpoints`
      ).join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `Policy Match Statistics:\n${statsText}`
          },
          {
            type: 'json',
            json: response.result
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch policy match statistics: ${errorMessage}`
          }
        ]
      };
    }
  },
};
