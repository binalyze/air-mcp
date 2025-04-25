#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { assetTools, ListAssetsArgsSchema, GetAssetByIdArgsSchema, GetAssetTasksByIdArgsSchema, UninstallAssetsArgsSchema, PurgeAndUninstallAssetsArgsSchema, AddTagsToAssetsArgsSchema, RemoveTagsFromAssetsArgsSchema } from './tools/assets';
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
import { assignTaskTools, AssignRebootTaskArgsSchema, AssignShutdownTaskArgsSchema, AssignIsolationTaskArgsSchema, AssignLogRetrievalTaskArgsSchema, AssignVersionUpdateTaskArgsSchema } from './tools/assign-task';
import { autoAssetTagTools, CreateAutoAssetTagArgsSchema, UpdateAutoAssetTagArgsSchema, ListAutoAssetTagsArgsSchema, GetAutoAssetTagByIdArgsSchema, DeleteAutoAssetTagByIdArgsSchema } from './tools/auto-asset-tags';
import { validateAirApiToken } from './utils/validation';

const server = new Server({
  name: 'air-mcp',
  version: '2.17.0'
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
        name: 'get_asset_by_id',
        description: 'Get detailed information about a specific asset by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the asset to retrieve',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_asset_tasks_by_id',
        description: 'Get all tasks associated with a specific asset by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the asset to retrieve tasks for',
            },
          },
          required: ['id'],
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
        name: 'assign_version_update_task',
        description: 'Assign a version update task to specific endpoints',
        inputSchema: {
          type: 'object',
          properties: {
            endpointIds: {
              oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } }
              ],
              description: 'Endpoint ID(s) to update version. Can be a single ID or an array of IDs.'
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
      {
        name: 'uninstall_assets',
        description: 'Uninstall specific assets based on filters without purging data. Requires specifying `filter.includedEndpointIds`.',
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'object',
              properties: {
                searchTerm: { type: 'string', description: 'Optional search term.' },
                name: { type: 'string', description: 'Filter by asset name.' },
                ipAddress: { type: 'string', description: 'Filter by IP address.' },
                groupId: { type: 'string', description: 'Filter by group ID.' },
                groupFullPath: { type: 'string', description: 'Filter by full group path.' },
                managedStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by managed status (e.g., ["managed"]).' },
                isolationStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by isolation status (e.g., ["isolated"]).' },
                platform: { type: 'array', items: { type: 'string' }, description: 'Filter by platform (e.g., ["windows"]).' },
                issue: { type: 'string', description: 'Filter by issue.' },
                onlineStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by online status (e.g., ["online"]).' },
                tagId: { type: 'string', description: 'Filter by tag ID.' },
                version: { type: 'string', description: 'Filter by agent version.' },
                policy: { type: 'string', description: 'Filter by policy.' },
                includedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'REQUIRED: Array of endpoint IDs to uninstall.' },
                excludedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Array of endpoint IDs to exclude.' },
                organizationIds: { type: 'array', items: { oneOf: [{ type: 'number' }, { type: 'string' }] }, description: 'Organization IDs filter. Defaults to [0].' },
              },
              required: [],
              description: 'Filter object to specify which assets to uninstall.'
            },
          },
          required: ['filter'],
        },
      },
      {
        name: 'purge_and_uninstall_assets',
        description: 'Purge data and uninstall specific assets based on filters. Requires specifying `filter.includedEndpointIds`.',
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'object',
              properties: {
                searchTerm: { type: 'string', description: 'Optional search term.' },
                name: { type: 'string', description: 'Filter by asset name.' },
                ipAddress: { type: 'string', description: 'Filter by IP address.' },
                groupId: { type: 'string', description: 'Filter by group ID.' },
                groupFullPath: { type: 'string', description: 'Filter by full group path.' },
                managedStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by managed status (e.g., ["managed"]).' },
                isolationStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by isolation status (e.g., ["isolated"]).' },
                platform: { type: 'array', items: { type: 'string' }, description: 'Filter by platform (e.g., ["windows"]).' },
                issue: { type: 'string', description: 'Filter by issue.' },
                onlineStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by online status (e.g., ["online"]).' },
                tagId: { type: 'string', description: 'Filter by tag ID.' },
                version: { type: 'string', description: 'Filter by agent version.' },
                policy: { type: 'string', description: 'Filter by policy.' },
                includedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'REQUIRED: Array of endpoint IDs to purge and uninstall.' },
                excludedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Array of endpoint IDs to exclude.' },
                organizationIds: { type: 'array', items: { oneOf: [{ type: 'number' }, { type: 'string' }] }, description: 'Organization IDs filter. Defaults to [0].' },
              },
              required: ['includedEndpointIds'],
              description: 'Filter object to specify which assets to purge and uninstall.'
            },
          },
          required: ['filter'],
        },
      },
      {
        name: 'add_tags_to_assets',
        description: 'Add tags to specific assets based on filters. Requires specifying `filter.includedEndpointIds` and `tags`.',
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'object',
              properties: {
                searchTerm: { type: 'string', description: 'Optional search term.' },
                name: { type: 'string', description: 'Filter by asset name.' },
                ipAddress: { type: 'string', description: 'Filter by IP address.' },
                groupId: { type: 'string', description: 'Filter by group ID.' },
                groupFullPath: { type: 'string', description: 'Filter by full group path.' },
                managedStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by managed status (e.g., ["managed"]).' },
                isolationStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by isolation status (e.g., ["isolated"]).' },
                platform: { type: 'array', items: { type: 'string' }, description: 'Filter by platform (e.g., ["windows"]).' },
                issue: { type: 'string', description: 'Filter by issue.' },
                onlineStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by online status (e.g., ["online"]).' },
                tagId: { type: 'string', description: 'Filter by existing tag ID.' },
                version: { type: 'string', description: 'Filter by agent version.' },
                policy: { type: 'string', description: 'Filter by policy.' },
                includedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'REQUIRED: Array of endpoint IDs to add tags to.' },
                excludedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Array of endpoint IDs to exclude.' },
                organizationIds: { type: 'array', items: { oneOf: [{ type: 'number' }, { type: 'string' }] }, description: 'Organization IDs filter. Defaults to [0].' },
              },
              required: ['includedEndpointIds'],
              description: 'Filter object to specify which assets to add tags to.'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              minItems: 1,
              description: 'REQUIRED: Array of tags to add to the selected assets.'
            },
          },
          required: ['filter', 'tags'],
        },
      },
      {
        name: 'remove_tags_from_assets',
        description: 'Remove tags from specific assets based on filters. Requires specifying `filter.includedEndpointIds` and `tags`.',
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'object',
              properties: {
                searchTerm: { type: 'string', description: 'Optional search term.' },
                name: { type: 'string', description: 'Filter by asset name.' },
                ipAddress: { type: 'string', description: 'Filter by IP address.' },
                groupId: { type: 'string', description: 'Filter by group ID.' },
                groupFullPath: { type: 'string', description: 'Filter by full group path.' },
                managedStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by managed status (e.g., ["managed"]).' },
                isolationStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by isolation status (e.g., ["isolated"]).' },
                platform: { type: 'array', items: { type: 'string' }, description: 'Filter by platform (e.g., ["windows"]).' },
                issue: { type: 'string', description: 'Filter by issue.' },
                onlineStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by online status (e.g., ["online"]).' },
                tagId: { type: 'string', description: 'Filter by existing tag ID.' },
                version: { type: 'string', description: 'Filter by agent version.' },
                policy: { type: 'string', description: 'Filter by policy.' },
                includedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'REQUIRED: Array of endpoint IDs to remove tags from.' },
                excludedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Array of endpoint IDs to exclude.' },
                organizationIds: { type: 'array', items: { oneOf: [{ type: 'number' }, { type: 'string' }] }, description: 'Organization IDs filter. Defaults to [0].' },
              },
              required: ['includedEndpointIds'],
              description: 'Filter object to specify which assets to remove tags from.'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              minItems: 1,
              description: 'REQUIRED: Array of tags to remove from the selected assets.'
            },
          },
          required: ['filter', 'tags'],
        },
      },
      {
        name: 'create_auto_asset_tag',
        description: 'Create a new rule to automatically tag assets based on specified conditions for Linux, Windows, and macOS.',
        inputSchema: {
          type: 'object',
          properties: {
            tag: {
              type: 'string',
              description: 'The tag name to be applied automatically.',
            },
            linuxConditions: {
              $ref: '#/definitions/ConditionGroup',
              description: 'Conditions for Linux assets.',
            },
            windowsConditions: {
              $ref: '#/definitions/ConditionGroup',
              description: 'Conditions for Windows assets.',
            },
            macosConditions: {
              $ref: '#/definitions/ConditionGroup',
              description: 'Conditions for macOS assets.',
            },
          },
          required: ['tag', 'linuxConditions', 'windowsConditions', 'macosConditions'],
          definitions: {
            ConditionGroup: {
              type: 'object',
              properties: {
                operator: {
                  type: 'string',
                  enum: ['and', 'or'],
                  description: 'Logical operator for combining conditions.',
                },
                conditions: {
                  type: 'array',
                  items: {
                    oneOf: [
                      { $ref: '#/definitions/Condition' },
                      { $ref: '#/definitions/ConditionGroup' } // Recursive reference
                    ],
                  },
                  minItems: 1,
                  description: 'Array of conditions or nested groups.',
                },
              },
              required: ['operator', 'conditions'],
            },
            Condition: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  description: 'Field to check (e.g., "process")',
                },
                operator: {
                  type: 'string',
                  description: 'Comparison operator (e.g., "running")',
                },
                value: {
                  type: 'string',
                  description: 'Value to compare against',
                },
              },
              required: ['field', 'operator', 'value'],
            },
          },
        },
      },
      {
        name: 'update_auto_asset_tag',
        description: 'Update an existing auto asset tag rule.',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the auto asset tag to update.',
            },
            tag: {
              type: 'string',
              description: 'The tag name to be applied automatically.',
            },
            linuxConditions: {
              $ref: '#/definitions/ConditionGroup',
              description: 'Conditions for Linux assets.',
            },
            windowsConditions: {
              $ref: '#/definitions/ConditionGroup',
              description: 'Conditions for Windows assets.',
            },
            macosConditions: {
              $ref: '#/definitions/ConditionGroup',
              description: 'Conditions for macOS assets.',
            },
          },
          required: ['id', 'tag'],
          definitions: {
            ConditionGroup: {
              type: 'object',
              properties: {
                operator: {
                  type: 'string',
                  enum: ['and', 'or'],
                  description: 'Logical operator for combining conditions.',
                },
                conditions: {
                  type: 'array',
                  items: {
                    oneOf: [
                      { $ref: '#/definitions/Condition' },
                      { $ref: '#/definitions/ConditionGroup' } // Recursive reference
                    ],
                  },
                  minItems: 1,
                  description: 'Array of conditions or nested groups.',
                },
              },
              required: ['operator', 'conditions'],
            },
            Condition: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  description: 'Field to check (e.g., "process")',
                },
                operator: {
                  type: 'string',
                  description: 'Comparison operator (e.g., "running")',
                },
                value: {
                  type: 'string',
                  description: 'Value to compare against',
                },
              },
              required: ['field', 'operator', 'value'],
            },
          },
        },
      },
      {
        name: 'get_auto_asset_tag_by_id',
        description: 'Get details of a specific auto asset tag rule by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the auto asset tag to retrieve',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_auto_asset_tag_by_id',
        description: 'Delete a specific auto asset tag rule by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the auto asset tag to delete',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'list_auto_asset_tags',
        description: 'List all auto asset tag rules in the system.',
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
    } else if (name === 'get_asset_by_id') {
      validateAirApiToken();
      const parsedArgs = GetAssetByIdArgsSchema.parse(args);
      return await assetTools.getAssetById(parsedArgs);
    } else if (name === 'get_asset_tasks_by_id') {
      validateAirApiToken();
      const parsedArgs = GetAssetTasksByIdArgsSchema.parse(args);
      return await assetTools.getAssetTasksById(parsedArgs);
    } else if (name === 'uninstall_assets') {
      validateAirApiToken();
      const parsedArgs = UninstallAssetsArgsSchema.parse(args);
      return await assetTools.uninstallAssets(parsedArgs);
    } else if (name === 'purge_and_uninstall_assets') {
      validateAirApiToken();
      const parsedArgs = PurgeAndUninstallAssetsArgsSchema.parse(args);
      return await assetTools.purgeAndUninstallAssets(parsedArgs);
    } else if (name === 'add_tags_to_assets') {
      validateAirApiToken();
      const parsedArgs = AddTagsToAssetsArgsSchema.parse(args);
      return await assetTools.addTagsToAssets(parsedArgs);
    } else if (name === 'remove_tags_from_assets') {
      validateAirApiToken();
      const parsedArgs = RemoveTagsFromAssetsArgsSchema.parse(args);
      return await assetTools.removeTagsFromAssets(parsedArgs);
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
    } else if (name === 'assign_version_update_task') {
      validateAirApiToken();
      const parsedArgs = AssignVersionUpdateTaskArgsSchema.parse(args);
      return await assignTaskTools.assignVersionUpdateTask(parsedArgs);
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
    } else if (name === 'create_auto_asset_tag') {
      validateAirApiToken();
      const parsedArgs = CreateAutoAssetTagArgsSchema.parse(args);
      return await autoAssetTagTools.createAutoAssetTag(parsedArgs);
    } else if (name === 'update_auto_asset_tag') {
      validateAirApiToken();
      const parsedArgs = UpdateAutoAssetTagArgsSchema.parse(args);
      return await autoAssetTagTools.updateAutoAssetTag(parsedArgs);
    } else if (name === 'list_auto_asset_tags') {
      validateAirApiToken();
      const parsedArgs = ListAutoAssetTagsArgsSchema.parse(args);
      return await autoAssetTagTools.listAutoAssetTags(parsedArgs);
    } else if (name === 'get_auto_asset_tag_by_id') {
      validateAirApiToken();
      const parsedArgs = GetAutoAssetTagByIdArgsSchema.parse(args);
      return await autoAssetTagTools.getAutoAssetTagById(parsedArgs);
    } else if (name === 'delete_auto_asset_tag_by_id') {
      validateAirApiToken();
      const parsedArgs = DeleteAutoAssetTagByIdArgsSchema.parse(args);
      return await autoAssetTagTools.deleteAutoAssetTagById(parsedArgs);
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