#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { assetTools, ListAssetsArgsSchema } from './tools/assets';
import { acquisitionTools, ListAcquisitionProfilesArgsSchema, AssignAcquisitionTaskArgsSchema } from './tools/acquisitions';
import { organizationTools } from './tools/organizations';
import { caseTools, ListCasesArgsSchema } from './tools/cases';
import { policyTools, ListPoliciesArgsSchema } from './tools/policies';
import { taskTools, ListTasksArgsSchema } from './tools/tasks';
import { triageTools, ListTriageRulesArgsSchema } from './tools/triages';
import { userTools, ListUsersArgsSchema } from './tools/users';
import { droneAnalyzerTools, ListDroneAnalyzersArgsSchema } from './tools/droneAnalyzers';
import { validateAirApiToken } from './utils/validation';

const server = new Server({
  name: 'air-mcp',
  version: '1.9.0'
}, {
  capabilities: {
    tools: {}
  }
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_assets',
        description: 'List all assets in the system',
        inputSchema: {
          type: 'object',
          properties: {
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter assets by. Leave empty to use default (0).',
            },
          },
          required: [],
        },
      },
      {
        name: 'list_acquisition_profiles',
        description: 'List all acquisition profiles in the system',
        inputSchema: {
          type: 'object',
          properties: {
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter acquisition profiles by. Leave empty to use default (0).',
            },
            allOrganizations: {
              type: 'boolean',
              description: 'Whether to include profiles from all organizations. Defaults to true.',
            },
          },
          required: [],
        },
      },
      {
        name: 'assign_acquisition_task',
        description: 'Assign an evidence acquisition task to specific endpoints',
        inputSchema: {
          type: 'object',
          properties: {
            caseId: {
              type: 'string',
              description: 'The case ID to associate the acquisition with',
            },
            acquisitionProfileId: {
              type: 'string',
              description: 'The acquisition profile ID to use for the task',
            },
            endpointIds: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of endpoint IDs to collect evidence from',
            },
            organizationIds: {
              type: 'array',
              items: {
                type: 'number'
              },
              description: 'Array of organization IDs to filter by. Defaults to [0]',
            },
            analyzers: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of analyzer IDs to use (e.g. ["bha", "wsa"])',
            },
            keywords: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of keywords to search for',
            },
            cpuLimit: {
              type: 'number',
              description: 'CPU usage limit percentage (1-100). Defaults to 80',
            },
            enableCompression: {
              type: 'boolean',
              description: 'Whether to enable compression. Defaults to true',
            },
            enableEncryption: {
              type: 'boolean',
              description: 'Whether to enable encryption. Defaults to false',
            },
            encryptionPassword: {
              type: 'string',
              description: 'Password for encryption if enabled',
            },
          },
          required: ['caseId', 'acquisitionProfileId', 'endpointIds'],
        },
      },
      {
        name: 'list_organizations',
        description: 'List all organizations in the system',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'list_cases',
        description: 'List all cases in the system',
        inputSchema: {
          type: 'object',
          properties: {
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter cases by. Leave empty to use default (0).',
            },
          },
          required: [],
        },
      },
      {
        name: 'list_policies',
        description: 'List all policies in the system',
        inputSchema: {
          type: 'object',
          properties: {
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter policies by. Leave empty to use default (0).',
            },
          },
          required: [],
        },
      },
      {
        name: 'list_tasks',
        description: 'List all tasks in the system',
        inputSchema: {
          type: 'object',
          properties: {
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter tasks by. Leave empty to use default (0).',
            },
          },
          required: [],
        },
      },
      {
        name: 'list_triage_rules',
        description: 'List all triage rules in the system',
        inputSchema: {
          type: 'object',
          properties: {
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter triage rules by. Leave empty to use default (0).',
            },
          },
          required: [],
        },
      },
      {
        name: 'list_users',
        description: 'List all users in the system',
        inputSchema: {
          type: 'object',
          properties: {
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter users by. Leave empty to use default (0).',
            },
          },
          required: [],
        },
      },
      {
        name: 'list_drone_analyzers',
        description: 'List all drone analyzers in the system',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {    
    if (name === 'list_assets') {
      validateAirApiToken();
      const parsedArgs = ListAssetsArgsSchema.parse(args);
      return await assetTools.listAssets(parsedArgs);
    } else if (name === 'list_acquisition_profiles') {
      validateAirApiToken();
      const parsedArgs = ListAcquisitionProfilesArgsSchema.parse(args);
      return await acquisitionTools.listAcquisitionProfiles(parsedArgs);
    } else if (name === 'assign_acquisition_task') {
      validateAirApiToken();
      const parsedArgs = AssignAcquisitionTaskArgsSchema.parse(args);
      return await acquisitionTools.assignAcquisitionTask(parsedArgs);
    } else if (name === 'list_organizations') {
      validateAirApiToken();
      return await organizationTools.listOrganizations();
    } else if (name === 'list_cases') {
      validateAirApiToken();
      const parsedArgs = ListCasesArgsSchema.parse(args);
      return await caseTools.listCases(parsedArgs);
    } else if (name === 'list_policies') {
      validateAirApiToken();
      const parsedArgs = ListPoliciesArgsSchema.parse(args);
      return await policyTools.listPolicies(parsedArgs);
    } else if (name === 'list_tasks') {
      validateAirApiToken();
      const parsedArgs = ListTasksArgsSchema.parse(args);
      return await taskTools.listTasks(parsedArgs);
    } else if (name === 'list_triage_rules') {
      validateAirApiToken();
      const parsedArgs = ListTriageRulesArgsSchema.parse(args);
      return await triageTools.listTriageRules(parsedArgs);
    } else if (name === 'list_users') {
      validateAirApiToken();
      const parsedArgs = ListUsersArgsSchema.parse(args);
      return await userTools.listUsers(parsedArgs);
    } else if (name === 'list_drone_analyzers') {
      validateAirApiToken();
      return await droneAnalyzerTools.listDroneAnalyzers();
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Invalid arguments: ${error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ')}`
      );
    }
    throw error;
  }
});

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
});