#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { assetTools, ListAssetsArgsSchema } from './tools/assets';
import { 
  acquisitionTools, 
  ListAcquisitionProfilesArgsSchema, 
  AssignAcquisitionTaskArgsSchema,
  GetAcquisitionProfileByIdArgsSchema,
  AssignImageAcquisitionTaskArgsSchema,
  CreateAcquisitionProfileArgsSchema
} from './tools/acquisitions';
import { organizationTools } from './tools/organizations';
import { caseTools, ListCasesArgsSchema } from './tools/cases';
import { policyTools, ListPoliciesArgsSchema } from './tools/policies';
import { taskTools, ListTasksArgsSchema } from './tools/tasks';
import { triageTools, ListTriageRulesArgsSchema } from './tools/triages';
import { userTools, ListUsersArgsSchema } from './tools/users';
import { droneAnalyzerTools } from './tools/droneAnalyzers';
import { auditTools, ExportAuditLogsArgsSchema, ListAuditLogsArgsSchema } from './tools/audit';
import { assignTaskTools, AssignRebootTaskArgsSchema, AssignShutdownTaskArgsSchema, AssignIsolationTaskArgsSchema, AssignLogRetrievalTaskArgsSchema } from './tools/assign-task';
import { validateAirApiToken } from './utils/validation';

const server = new Server({
  name: 'air-mcp',
  version: '2.5.0'
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
        name: 'get_acquisition_profile_by_id',
        description: 'Get details of a specific acquisition profile by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            profileId: {
              type: 'string',
              description: 'The ID of the acquisition profile to retrieve (e.g., "full")',
            },
          },
          required: ['profileId'],
        },
      },
      {
        name: 'assign_image_acquisition_task',
        description: 'Assign a disk image acquisition task to specific endpoints and volumes',
        inputSchema: {
          type: 'object',
          properties: {
            caseId: {
              type: ['string', 'null'],
              description: 'The case ID to associate the acquisition with (optional)',
            },
            repositoryId: {
              type: 'string',
              description: 'The repository ID where the image will be saved',
            },
            endpoints: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  endpointId: { type: 'string' },
                  volumes: { type: 'array', items: { type: 'string' } }
                },
                required: ['endpointId', 'volumes']
              },
              description: 'Array of endpoints and volumes to image (e.g., [{"endpointId": "uuid", "volumes": ["/dev/sda1"]}]). At least one endpoint and one volume per endpoint required.',
            },
            organizationIds: {
              type: 'array',
              items: { type: 'number' },
              description: 'Array of organization IDs. Defaults to [0]',
            },
            bandwidthLimit: {
              type: 'number',
              description: 'Bandwidth limit in KB/s. Defaults to 100000',
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
            chunkSize: {
              type: 'number',
              description: 'Chunk size in bytes. Defaults to 1048576',
            },
            chunkCount: {
              type: 'number',
              description: 'Number of chunks to acquire. Defaults to 0 (acquire until end).'
            },
            startOffset: {
              type: 'number',
              description: 'Offset in bytes to start acquisition from. Defaults to 0.'
            },
          },
          required: ['repositoryId', 'endpoints'],
        },
      },
      {
        name: 'create_acquisition_profile',
        description: 'Create a new acquisition profile',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name for the new acquisition profile' },
            organizationIds: { type: 'array', items: { type: 'string' }, description: 'Organization IDs to associate the profile with. Defaults to empty array.' },
            windows: { 
              type: 'object', 
              description: 'Windows specific configuration. Must include keys like `evidenceList` (array of strings), `artifactList` (array of strings, optional), `customContentProfiles` (array), and `networkCapture` (object). Example: { \"evidenceList\": [\"evt\"], \"artifactList\": [], \"customContentProfiles\": [], \"networkCapture\": { \"enabled\": false, \"duration\": 600, \"pcap\": { \"enabled\": false }, \"networkFlow\": { \"enabled\": false } } }' 
            },
            linux: { 
              type: 'object', 
              description: 'Linux specific configuration. Must include keys like `evidenceList` (array of strings), `artifactList` (array of strings, optional), `customContentProfiles` (array), and `networkCapture` (object). Example: { \"evidenceList\": [\"logs\"], ... }' 
            },
            macos: { 
              type: 'object', 
              description: 'macOS specific configuration. Must include keys like `evidenceList` (array of strings), `artifactList` (array of strings, optional), `customContentProfiles` (array), and `networkCapture` (object). Example: { \"evidenceList\": [\"logs\"], ... }' 
            },
            aix: { 
              type: 'object', 
              description: 'AIX specific configuration. Must include keys like `evidenceList` (array of strings), `artifactList` (array of strings, optional), and `customContentProfiles` (array). Example: { \"evidenceList\": [\"logs\"], ... }' 
            },
            eDiscovery: { 
              type: 'object', 
              description: 'eDiscovery configuration. Must include the key `patterns` (array of objects with `pattern` and `category` strings). Example: { \"patterns\": [] }' 
            }
          },
          required: ['name', 'windows', 'linux', 'macos', 'aix', 'eDiscovery'],
        },
      },
      {
        name: 'assign_reboot_task',
        description: 'Assign a reboot task to specific endpoints',
        inputSchema: {
          type: 'object',
          properties: {
            endpointIds: {
              oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } }
              ],
              description: 'Endpoint ID(s) to reboot. Can be a single ID or an array of IDs.'
            },
            organizationIds: {
              oneOf: [
                { type: 'number' },
                { type: 'string' },
                { type: 'array', items: { oneOf: [{ type: 'number' }, { type: 'string' }] } }
              ],
              description: 'Organization ID(s) to filter endpoints by. Defaults to 0.'
            },
            managedStatus: {
              type: 'array',
              items: { type: 'string' },
              description: 'Filter endpoints by managed status. Default is ["managed"].'
            }
          },
          required: ['endpointIds'],
        },
      },
      {
        name: 'assign_shutdown_task',
        description: 'Assign a shutdown task to specific endpoints',
        inputSchema: {
          type: 'object',
          properties: {
            endpointIds: {
              oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } }
              ],
              description: 'Endpoint ID(s) to shutdown. Can be a single ID or an array of IDs.'
            },
            organizationIds: {
              oneOf: [
                { type: 'number' },
                { type: 'string' },
                { type: 'array', items: { oneOf: [{ type: 'number' }, { type: 'string' }] } }
              ],
              description: 'Organization ID(s) to filter endpoints by. Defaults to 0.'
            },
            managedStatus: {
              type: 'array',
              items: { type: 'string' },
              description: 'Filter endpoints by managed status. Default is ["managed"].'
            }
          },
          required: ['endpointIds'],
        },
      },
      {
        name: 'assign_isolation_task',
        description: 'Assign an isolation task to specific endpoints',
        inputSchema: {
          type: 'object',
          properties: {
            endpointIds: {
              oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } }
              ],
              description: 'Endpoint ID(s) to isolate or unisolate. Can be a single ID or an array of IDs.'
            },
            enabled: {
              type: 'boolean',
              description: 'Whether to enable (isolate) or disable (unisolate) isolation. Defaults to true.'
            },
            organizationIds: {
              oneOf: [
                { type: 'number' },
                { type: 'string' },
                { type: 'array', items: { oneOf: [{ type: 'number' }, { type: 'string' }] } }
              ],
              description: 'Organization ID(s) to filter endpoints by. Defaults to 0.'
            },
            managedStatus: {
              type: 'array',
              items: { type: 'string' },
              description: 'Filter endpoints by managed status. Default is ["managed"].'
            }
          },
          required: ['endpointIds'],
        },
      },
      {
        name: 'assign_log_retrieval_task',
        description: 'Assign a log retrieval task to specific endpoints',
        inputSchema: {
          type: 'object',
          properties: {
            endpointIds: {
              oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } }
              ],
              description: 'Endpoint ID(s) to retrieve logs from. Can be a single ID or an array of IDs.'
            },
            organizationIds: {
              oneOf: [
                { type: 'number' },
                { type: 'string' },
                { type: 'array', items: { oneOf: [{ type: 'number' }, { type: 'string' }] } }
              ],
              description: 'Organization ID(s) to filter endpoints by. This is REQUIRED to identify the correct endpoints. Examples: 0, "123", [0], ["123", "456"]'
            },
            managedStatus: {
              type: 'array',
              items: { type: 'string' },
              description: 'Filter endpoints by managed status. Default is ["managed"].'
            }
          },
          required: ['endpointIds', 'organizationIds'],
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
      {
        name: 'export_audit_logs',
        description: 'Initiate an export of audit logs from the AIR system',
        inputSchema: {
          type: 'object',
          properties: {
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter audit logs by. Defaults to "0" or specific IDs like "123" or "123,456".',
            },
          },
          required: [],
        },
      },
      {
        name: 'list_audit_logs',
        description: 'List audit logs from the AIR system',
        inputSchema: {
          type: 'object',
          properties: {
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter audit logs by. Defaults to "0" or specific IDs like "123" or "123,456".',
            },
          },
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
    } else if (name === 'get_acquisition_profile_by_id') {
      validateAirApiToken();
      const parsedArgs = GetAcquisitionProfileByIdArgsSchema.parse(args);
      return await acquisitionTools.getAcquisitionProfileById(parsedArgs);
    } else if (name === 'assign_image_acquisition_task') {
      validateAirApiToken();
      const parsedArgs = AssignImageAcquisitionTaskArgsSchema.parse(args);
      return await acquisitionTools.assignImageAcquisitionTask(parsedArgs);
    } else if (name === 'create_acquisition_profile') {
      validateAirApiToken();
      const parsedArgs = CreateAcquisitionProfileArgsSchema.parse(args);
      return await acquisitionTools.createAcquisitionProfile(parsedArgs);
    } else if (name === 'assign_reboot_task') {
      validateAirApiToken();
      const parsedArgs = AssignRebootTaskArgsSchema.parse(args);
      return await assignTaskTools.assignRebootTask(parsedArgs);
    } else if (name === 'assign_shutdown_task') {
      validateAirApiToken();
      const parsedArgs = AssignShutdownTaskArgsSchema.parse(args);
      return await assignTaskTools.assignShutdownTask(parsedArgs);
    } else if (name === 'assign_isolation_task') {
      validateAirApiToken();
      const parsedArgs = AssignIsolationTaskArgsSchema.parse(args);
      return await assignTaskTools.assignIsolationTask(parsedArgs);
    } else if (name === 'assign_log_retrieval_task') {
      validateAirApiToken();
      const parsedArgs = AssignLogRetrievalTaskArgsSchema.parse(args);
      return await assignTaskTools.assignLogRetrievalTask(parsedArgs);
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
    } else if (name === 'export_audit_logs') {
      validateAirApiToken();
      const parsedArgs = ExportAuditLogsArgsSchema.parse(args);
      return await auditTools.exportAuditLogs(parsedArgs);
    } else if (name === 'list_audit_logs') {
      validateAirApiToken();
      const parsedArgs = ListAuditLogsArgsSchema.parse(args);
      return await auditTools.listAuditLogs(parsedArgs);
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