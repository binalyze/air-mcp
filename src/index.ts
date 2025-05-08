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
import { CheckOrganizationNameExistsArgsSchema, CreateOrganizationArgsSchema, GetOrganizationByIdArgsSchema, GetShareableDeploymentInfoArgsSchema, organizationTools, UpdateOrganizationShareableDeploymentArgsSchema } from './tools/organizations';
import { ArchiveCaseArgsSchema, caseTools, ChangeCaseOwnerArgsSchema, CheckCaseNameArgsSchema, CloseCaseArgsSchema, CreateCaseArgsSchema, GetCaseActivitiesArgsSchema, GetCaseByIdArgsSchema, GetCaseEndpointsArgsSchema, GetCaseTasksByIdArgsSchema, GetCaseUsersArgsSchema, ImportTaskAssignmentsToCaseArgsSchema, ListCasesArgsSchema, OpenCaseArgsSchema, RemoveEndpointsFromCaseArgsSchema, RemoveTaskAssignmentFromCaseArgsSchema, UpdateCaseArgsSchema } from './tools/cases';
import { policyTools, ListPoliciesArgsSchema, CreatePolicyArgsSchema, UpdatePolicyArgsSchema, GetPolicyByIdArgsSchema, UpdatePolicyPrioritiesArgsSchema, PolicyMatchStatsArgsSchema, DeletePolicyByIdArgsSchema } from './tools/policies';
import { taskTools, ListTasksArgsSchema, GetTaskByIdArgsSchema, CancelTaskByIdArgsSchema, DeleteTaskByIdArgsSchema } from './tools/tasks';
import { triageTools, ListTriageRulesArgsSchema, CreateTriageRuleArgsSchema, UpdateTriageRuleArgsSchema, DeleteTriageRuleArgsSchema, GetTriageRuleByIdArgsSchema, ValidateTriageRuleArgsSchema, AssignTriageTaskArgsSchema } from './tools/triages';
import { userTools, ListUsersArgsSchema } from './tools/users';
import { droneAnalyzerTools, acquisitionArtifactTools, eDiscoveryTools } from './tools/params';
import { auditTools, ExportAuditLogsArgsSchema, ListAuditLogsArgsSchema } from './tools/audit';
import { assignTaskTools, AssignRebootTaskArgsSchema, AssignShutdownTaskArgsSchema, AssignIsolationTaskArgsSchema, AssignLogRetrievalTaskArgsSchema, AssignVersionUpdateTaskArgsSchema } from './tools/assign-task';
import { autoAssetTagTools, CreateAutoAssetTagArgsSchema, UpdateAutoAssetTagArgsSchema, ListAutoAssetTagsArgsSchema, GetAutoAssetTagByIdArgsSchema, DeleteAutoAssetTagByIdArgsSchema, StartTaggingArgsSchema } from './tools/auto-asset-tags';
import { validateAirApiToken } from './utils/validation';
import { AcquireBaselineArgsSchema, CompareBaselineArgsSchema, GetComparisonReportArgsSchema } from './tools/baseline';
import { baselineTools } from './tools/baseline';
import { assignmentTools, CancelTaskAssignmentArgsSchema, DeleteTaskAssignmentArgsSchema } from './tools/assignments';
import { GetTaskAssignmentsByIdArgsSchema } from './tools/assignments';
import { CreateTriageTagArgsSchema, triageTagTools } from './tools/triage-tags';
import { ListTriageTagsArgsSchema } from './tools/triage-tags';
import { AddNoteToCaseArgsSchema, caseNotesTools, DeleteNoteFromCaseArgsSchema, UpdateNoteCaseArgsSchema } from './tools/cases-notes';
import { casesExportTools, ExportCaseActivitiesArgsSchema, ExportCaseEndpointsArgsSchema, ExportCaseNotesArgsSchema, ExportCasesArgsSchema } from './tools/cases-export';
import { CreateAmazonS3RepositoryArgsSchema, CreateAzureStorageRepositoryArgsSchema, CreateFtpsRepositoryArgsSchema, CreateSftpRepositoryArgsSchema, CreateSmbRepositoryArgsSchema, DeleteRepositoryArgsSchema, GetRepositoryByIdArgsSchema, ListRepositoriesArgsSchema, repositoryTools, UpdateAmazonS3RepositoryArgsSchema, UpdateAzureStorageRepositoryArgsSchema, UpdateFtpsRepositoryArgsSchema, UpdateSftpRepositoryArgsSchema, UpdateSmbRepositoryArgsSchema, ValidateAmazonS3RepositoryArgsSchema, ValidateAzureStorageRepositoryArgsSchema, ValidateFtpsRepositoryArgsSchema } from './tools/evidence-repositories';
import { DownloadCasePpcArgsSchema, DownloadTaskReportArgsSchema, evidenceTools, GetReportFileInfoArgsSchema } from './tools/evidence';
import { AssignUsersToOrganizationArgsSchema, GetOrganizationUsersArgsSchema, organizationUsersTools, RemoveUserFromOrganizationArgsSchema } from './tools/organizations-users';
import { UpdateOrganizationArgsSchema } from './tools/organizations';

const server = new Server({
  name: 'air-mcp',
  version: '9.7.0'
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
      {
        name: 'start_tagging',
        description: 'Start the auto asset tagging process for assets matching filter criteria.',
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
                tags: { type: 'array', items: { type: 'string' }, description: 'Filter by tags.' },
                version: { type: 'string', description: 'Filter by agent version.' },
                policy: { type: 'string', description: 'Filter by policy.' },
                includedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Array of endpoint IDs to include.' },
                excludedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Array of endpoint IDs to exclude.' },
                organizationIds: { type: 'array', items: { type: 'number' }, description: 'Organization IDs filter. Defaults to [0].' },
              },
              description: 'Filter object to specify which assets to apply auto tagging to.'
            },
          },
          required: ['filter'],
        },
      },
      {
        name: 'acquire_baseline',
        description: 'Assign a baseline acquisition task to specific endpoints',
        inputSchema: {
          type: 'object',
          properties: {
            caseId: {
              type: 'string',
              description: 'The case ID to associate the baseline acquisition with',
            },
            filter: {
              type: 'object',
              properties: {
                searchTerm: { type: 'string', description: 'Optional search term' },
                name: { type: 'string', description: 'Filter by asset name' },
                ipAddress: { type: 'string', description: 'Filter by IP address' },
                groupId: { type: 'string', description: 'Filter by group ID' },
                groupFullPath: { type: 'string', description: 'Filter by full group path' },
                managedStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by managed status (e.g., ["managed"])' },
                isolationStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by isolation status (e.g., ["isolated"])' },
                platform: { type: 'array', items: { type: 'string' }, description: 'Filter by platform (e.g., ["windows"])' },
                issue: { type: 'string', description: 'Filter by issue' },
                onlineStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by online status (e.g., ["online"])' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Filter by tags' },
                version: { type: 'string', description: 'Filter by agent version' },
                policy: { type: 'string', description: 'Filter by policy' },
                includedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Array of endpoint IDs to include for baseline acquisition' },
                excludedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Array of endpoint IDs to exclude' },
                organizationIds: { type: 'array', items: { type: 'number' }, description: 'Organization IDs filter. Defaults to [0]' },
              },
              description: 'Filter object to specify which assets to acquire baseline from',
            },
          },
          required: ['caseId', 'filter'],
        },
      },
      {
        name: 'compare_baseline',
        description: 'Compare baseline acquisition tasks for a specific endpoint',
        inputSchema: {
          type: 'object',
          properties: {
            endpointId: {
              type: 'string',
              description: 'The endpoint ID to compare baselines for',
            },
            taskIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of baseline task IDs to compare (minimum 2)',
            },
          },
          required: ['endpointId', 'taskIds'],
        },
      },
      {
        name: 'get_comparison_report',
        description: 'Get comparison result report for a specific endpoint and task',
        inputSchema: {
          type: 'object',
          properties: {
            endpointId: {
              type: 'string',
              description: 'The endpoint ID associated with the comparison task',
            },
            taskId: {
              type: 'string',
              description: 'The ID of the comparison task to get the report for',
            },
          },
          required: ['endpointId', 'taskId'],
        },
      },
      {
        name: 'list_acquisition_artifacts',
        description: 'List all acquisition artifacts available for evidence collection',
        inputSchema: {
          type: 'object',
          properties: {
            random_string: {
              type: 'string',
              description: 'Dummy parameter for no-parameter tools',
            },
          },
          required: ['random_string'],
        },
      },
      {
        name: 'list_e_discovery_patterns',
        description: 'List all e-discovery patterns for file type detection',
        inputSchema: {
          type: 'object',
          properties: {
            random_string: {
              type: 'string',
              description: 'Dummy parameter for no-parameter tools',
            },
          },
          required: ['random_string'],
        },
      },
      {
        name: 'create_policy',
        description: 'Create a new policy with specific storage and compression settings',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name for the new policy' },
            organizationIds: { 
              oneOf: [
                { type: 'array', items: { type: 'number' } },
                { type: 'array', items: { type: 'string' } },
                { type: 'number' },
                { type: 'string' }
              ],
              description: 'Organization IDs to associate with policy. Defaults to [0].'
            },
            saveTo: {
              type: 'object',
              properties: {
                windows: {
                  type: 'object',
                  properties: {
                    location: { type: 'string', description: 'Storage location for Windows (e.g., "local")' },
                    path: { type: 'string', description: 'Path for evidence storage on Windows' },
                    useMostFreeVolume: { type: 'boolean', description: 'Whether to use volume with most free space' },
                    volume: { type: 'string', description: 'Volume to use for Windows (e.g., "C:")' },
                    tmp: { type: 'string', description: 'Temporary folder path for Windows' }
                  },
                  required: ['location', 'path', 'useMostFreeVolume', 'volume']
                },
                linux: {
                  type: 'object',
                  properties: {
                    location: { type: 'string', description: 'Storage location for Linux (e.g., "local")' },
                    path: { type: 'string', description: 'Path for evidence storage on Linux' },
                    useMostFreeVolume: { type: 'boolean', description: 'Whether to use volume with most free space' },
                    volume: { type: 'string', description: 'Volume to use for Linux (e.g., "/")' },
                    tmp: { type: 'string', description: 'Temporary folder path for Linux' }
                  },
                  required: ['location', 'path', 'useMostFreeVolume', 'volume']
                },
                macos: {
                  type: 'object',
                  properties: {
                    location: { type: 'string', description: 'Storage location for macOS (e.g., "local")' },
                    path: { type: 'string', description: 'Path for evidence storage on macOS' },
                    useMostFreeVolume: { type: 'boolean', description: 'Whether to use volume with most free space' },
                    volume: { type: 'string', description: 'Volume to use for macOS (e.g., "/")' },
                    tmp: { type: 'string', description: 'Temporary folder path for macOS' }
                  },
                  required: ['location', 'path', 'useMostFreeVolume', 'volume']
                }
              },
              required: ['windows', 'linux', 'macos'],
              description: 'Configuration for where to save evidence'
            },
            compression: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean', description: 'Whether compression is enabled' },
                encryption: {
                  type: 'object',
                  properties: {
                    enabled: { type: 'boolean', description: 'Whether encryption is enabled' },
                    password: { type: 'string', description: 'Password for encryption when enabled' }
                  },
                  required: ['enabled']
                }
              },
              required: ['enabled', 'encryption'],
              description: 'Compression and encryption settings'
            },
            sendTo: {
              type: 'object',
              properties: {
                location: { type: 'string', description: 'Location to send evidence to (e.g., "user-local")' }
              },
              required: ['location'],
              description: 'Configuration for where to send evidence'
            },
            cpu: {
              type: 'object',
              properties: {
                limit: { type: 'number', description: 'CPU usage limit percentage (1-100)' }
              },
              description: 'CPU usage limits'
            }
          },
          required: ['name', 'saveTo', 'compression', 'sendTo'],
        },
      },
      {
        name: 'update_policy',
        description: 'Update an existing policy with specific storage and filter settings',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'The ID of the policy to update' },
            name: { type: 'string', description: 'Name for the policy' },
            organizationIds: { 
              oneOf: [
                { type: 'array', items: { type: 'number' } },
                { type: 'array', items: { type: 'string' } },
                { type: 'number' },
                { type: 'string' }
              ],
              description: 'Organization IDs to associate with policy. Defaults to [0].'
            },
            filter: {
              type: 'object',
              properties: {
                operator: { type: 'string', description: 'Logical operator for combining conditions (e.g., "and", "or")' },
                conditions: { type: 'array', description: 'Array of conditions for policy filtering' }
              },
              description: 'Filter conditions to determine which endpoints the policy applies to'
            },
            saveTo: {
              type: 'object',
              properties: {
                windows: {
                  type: 'object',
                  properties: {
                    location: { type: 'string', description: 'Storage location for Windows (e.g., "local")' },
                    path: { type: 'string', description: 'Path for evidence storage on Windows' },
                    useMostFreeVolume: { type: 'boolean', description: 'Whether to use volume with most free space' },
                    volume: { type: 'string', description: 'Volume to use for Windows (e.g., "C:")' },
                    tmp: { type: 'string', description: 'Temporary folder path for Windows' }
                  },
                  required: ['location', 'path', 'useMostFreeVolume', 'volume']
                },
                linux: {
                  type: 'object',
                  properties: {
                    location: { type: 'string', description: 'Storage location for Linux (e.g., "local")' },
                    path: { type: 'string', description: 'Path for evidence storage on Linux' },
                    useMostFreeVolume: { type: 'boolean', description: 'Whether to use volume with most free space' },
                    volume: { type: 'string', description: 'Volume to use for Linux (e.g., "/")' },
                    tmp: { type: 'string', description: 'Temporary folder path for Linux' }
                  },
                  required: ['location', 'path', 'useMostFreeVolume', 'volume']
                },
                macos: {
                  type: 'object',
                  properties: {
                    location: { type: 'string', description: 'Storage location for macOS (e.g., "local")' },
                    path: { type: 'string', description: 'Path for evidence storage on macOS' },
                    useMostFreeVolume: { type: 'boolean', description: 'Whether to use volume with most free space' },
                    volume: { type: 'string', description: 'Volume to use for macOS (e.g., "/")' },
                    tmp: { type: 'string', description: 'Temporary folder path for macOS' }
                  },
                  required: ['location', 'path', 'useMostFreeVolume', 'volume']
                }
              },
              required: ['windows', 'linux', 'macos'],
              description: 'Configuration for where to save evidence'
            },
            compression: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean', description: 'Whether compression is enabled' },
                encryption: {
                  type: 'object',
                  properties: {
                    enabled: { type: 'boolean', description: 'Whether encryption is enabled' },
                    password: { type: 'string', description: 'Password for encryption when enabled' }
                  },
                  required: ['enabled']
                }
              },
              required: ['enabled', 'encryption'],
              description: 'Compression and encryption settings'
            },
            sendTo: {
              type: 'object',
              properties: {
                location: { type: 'string', description: 'Location to send evidence to (e.g., "user-local")' }
              },
              required: ['location'],
              description: 'Configuration for where to send evidence'
            },
            cpu: {
              type: 'object',
              properties: {
                limit: { type: 'number', description: 'CPU usage limit percentage (1-100)' }
              },
              description: 'CPU usage limits'
            }
          },
          required: ['id', 'name', 'saveTo', 'compression', 'sendTo'],
        },
      },
      {
        name: 'get_policy_by_id',
        description: 'Get detailed information about a specific policy by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the policy to retrieve',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'update_policy_priorities',
        description: 'Update the priority order of policies',
        inputSchema: {
          type: 'object',
          properties: {
            ids: { 
              type: 'array', 
              items: { type: 'string' }, 
              description: 'Ordered list of policy IDs that defines their priority (first has highest priority)' 
            },
            organizationIds: { 
              oneOf: [
                { type: 'array', items: { type: 'number' } },
                { type: 'array', items: { type: 'string' } },
                { type: 'number' },
                { type: 'string' }
              ],
              description: 'Organization IDs to associate with priority update. Defaults to [0].' 
            },
          },
          required: ['ids'],
        },
      },
      {
        name: 'get_policy_match_stats',
        description: 'Get statistics on how many endpoints match each policy based on filter criteria',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Filter assets by name' },
            searchTerm: { type: 'string', description: 'General search term for filtering assets' },
            ipAddress: { type: 'string', description: 'Filter assets by IP address' },
            groupId: { type: 'string', description: 'Filter assets by group ID' },
            groupFullPath: { type: 'string', description: 'Filter assets by full group path' },
            managedStatus: { type: 'array', items: { type: 'string' }, description: 'Filter assets by managed status (e.g., ["managed"])' },
            isolationStatus: { type: 'array', items: { type: 'string' }, description: 'Filter assets by isolation status (e.g., ["isolated"])' },
            platform: { type: 'array', items: { type: 'string' }, description: 'Filter assets by platform (e.g., ["windows"])' },
            issue: { type: 'string', description: 'Filter assets by issue' },
            onlineStatus: { type: 'array', items: { type: 'string' }, description: 'Filter assets by online status (e.g., ["online"])' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Filter assets by tags' },
            version: { type: 'string', description: 'Filter assets by agent version' },
            policy: { type: 'string', description: 'Filter assets by policy name' },
            includedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Include only these endpoint IDs' },
            excludedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Exclude these endpoint IDs' },
            organizationIds: { type: 'array', items: { oneOf: [{ type: 'number' }, { type: 'string' }] }, description: 'Organization IDs to filter by. Defaults to [0].' },
          },
          required: [],
        },
      },
      {
        name: 'delete_policy_by_id',
        description: 'Delete a specific policy by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the policy to delete',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_task_assignments_by_id',
        description: 'Get all assignments associated with a specific task by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: {
              type: 'string',
              description: 'The ID of the task to retrieve assignments for',
            },
          },
          required: ['taskId'],
        },
      },
      {
        name: 'cancel_task_assignment',
        description: 'Cancel a task assignment by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            assignmentId: {
              type: 'string',
              description: 'The ID of the task assignment to cancel',
            },
          },
          required: ['assignmentId'],
        },
      },
      {
        name: 'delete_task_assignment',
        description: 'Delete a specific task assignment by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            assignmentId: {
              type: 'string',
              description: 'The ID of the task assignment to delete',
            },
          },
          required: ['assignmentId'],
        },
      },
      {
        name: 'get_task_by_id',
        description: 'Get detailed information about a specific task by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the task to retrieve',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'cancel_task_by_id',
        description: 'Cancel a specific task by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the task to cancel',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_task_by_id',
        description: 'Delete a specific task by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the task to delete',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'list_triage_tags',
        description: 'List all triage rule tags in the system',
        inputSchema: {
          type: 'object',
          properties: {
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter triage tags by. Leave empty to use default (0).',
            },
            withCount: {
              type: 'boolean',
              description: 'Whether to include count of rules for each tag. Defaults to true.',
            },
          },
          required: [],
        },
      },
      {
        name: 'create_triage_tag',
        description: 'Create a new triage rule tag',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the tag to create',
            },
            organizationId: {
              oneOf: [{ type: 'string' }, { type: 'number' }],
              description: 'Organization ID to associate the tag with. Defaults to 0.',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'create_triage_rule',
        description: 'Create a new triage rule',
        inputSchema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'A descriptive name for the triage rule',
            },
            rule: {
              type: 'string',
              description: 'The YARA rule content',
            },
            searchIn: {
              type: 'string',
              description: 'Where to search, e.g., "filesystem"',
            },
            engine: {
              type: 'string',
              description: 'Rule engine to use, e.g., "yara"',
            },
            organizationIds: {
              type: 'array',
              items: { 
                oneOf: [
                  { type: 'string' },
                  { type: 'number' }
                ]
              },
              description: 'Organization IDs to associate with this rule. Defaults to [0]',
            },
          },
          required: ['description', 'rule', 'searchIn', 'engine'],
        },
      },   
      {
        name: 'update_triage_rule',
        description: 'Update an existing triage rule by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID of the triage rule to update' },
            description: { type: 'string', description: 'A descriptive name for the triage rule' },
            rule: { type: 'string', description: 'The YARA rule content' },
            searchIn: { type: 'string', description: 'Where to search, e.g., "filesystem"' },
            organizationIds: { 
              type: 'array', 
              items: { oneOf: [{ type: 'number' }, { type: 'string' }] }, 
              description: 'Organization IDs to associate with this rule. Defaults to [0]' 
            },
          },
          required: ['id', 'description', 'rule', 'searchIn'],
        },
      },   
      {
        name: 'delete_triage_rule',
        description: 'Delete an existing triage rule by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID of the triage rule to delete' },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_triage_rule_by_id',
        description: 'Get a specific triage rule by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the triage rule to retrieve',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'validate_triage_rule',
        description: 'Validate a triage rule syntax without creating it',
        inputSchema: {
          type: 'object',
          properties: {
            rule: { type: 'string', description: 'The YARA rule content to validate' },
          },
          required: ['rule'],
        },
      },
      {
        name: 'assign_triage_task',
        description: 'Assign a triage task to endpoints based on filter criteria',
        inputSchema: {
          type: 'object',
          properties: {
            caseId: { type: 'string', description: 'Case ID for the triage task' },
            triageRuleIds: { type: 'array', items: { type: 'string' }, description: 'Array of triage rule IDs to apply' },
            taskConfig: { 
              type: 'object', 
              properties: {
                choice: { type: 'string', description: 'Configuration choice, e.g., "use-custom-options"' }
              },
              required: ['choice'],
              description: 'Task configuration options'
            },
            mitreAttack: { 
              type: 'object', 
              properties: {
                enabled: { type: 'boolean', description: 'Whether to enable MITRE ATT&CK framework' }
              },
              required: ['enabled'],
              description: 'MITRE ATT&CK configuration'
            },
            filter: {
              type: 'object',
              properties: {
                searchTerm: { type: 'string', description: 'Optional search term' },
                name: { type: 'string', description: 'Filter by asset name' },
                ipAddress: { type: 'string', description: 'Filter by IP address' },
                groupId: { type: 'string', description: 'Filter by group ID' },
                groupFullPath: { type: 'string', description: 'Filter by full group path' },
                managedStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by managed status (e.g., ["managed"])' },
                isolationStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by isolation status' },
                platform: { type: 'array', items: { type: 'string' }, description: 'Filter by platform (e.g., ["windows"])' },
                issue: { type: 'string', description: 'Filter by issue' },
                onlineStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by online status' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Filter by tags' },
                version: { type: 'string', description: 'Filter by agent version' },
                policy: { type: 'string', description: 'Filter by policy' },
                includedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Array of endpoint IDs to include' },
                excludedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Array of endpoint IDs to exclude' },
                organizationIds: { type: 'array', items: { oneOf: [{ type: 'number' }, { type: 'string' }] }, description: 'Organization IDs filter' }
              },
              description: 'Filter criteria for selecting endpoints'
            }
          },
          required: ['caseId', 'triageRuleIds', 'taskConfig', 'mitreAttack', 'filter'],
        },
      },
      {
        name: 'add_note_to_case',
        description: 'Add a note to a specific case by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            caseId: {
              type: 'string',
              description: 'The ID of the case to add a note to (e.g., "C-2022-0002")',
            },
            note: {
              type: 'string',
              description: 'The content of the note to add to the case',
            },
          },
          required: ['caseId', 'note'],
        },
      },
      {
        name: 'update_note_in_case',
        description: 'Update an existing note in a specific case',
        inputSchema: {
          type: 'object',
          properties: {
            caseId: {
              type: 'string',
              description: 'The ID of the case containing the note (e.g., "C-2022-0002")',
            },
            noteId: {
              type: 'string',
              description: 'The ID of the note to update (e.g., "8d9baa16-9aa3-4e4f-a08e-a74341ce2f90")',
            },
            note: {
              type: 'string',
              description: 'The new content for the note',
            },
          },
          required: ['caseId', 'noteId', 'note'],
        },
      },
      {
        name: 'delete_note_from_case',
        description: 'Delete a note from a case by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            caseId: {
              type: 'string',
              description: 'The ID of the case containing the note (e.g., "C-2022-0002")',
            },
            noteId: {
              type: 'string',
              description: 'The ID of the note to delete (e.g., "8d9baa16-9aa3-4e4f-a08e-a74341ce2f90")',
            },
          },
          required: ['caseId', 'noteId'],
        },
      },
      {
        name: 'export_cases',
        description: 'Export cases data from the system',
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
        name: 'export_case_notes',
        description: 'Export notes for a specific case by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            caseId: {
              type: 'string',
              description: 'The ID of the case to export notes for',
            },
          },
          required: ['caseId'],
        },
      },
      {
        name: 'export_case_endpoints',
        description: 'Export endpoints for a specific case by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            caseId: {
              type: 'string',
              description: 'The ID of the case to export endpoints for',
            },
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter by. Defaults to "0".',
            },
          },
          required: ['caseId'],
        },
      },
      {
        name: 'export_case_activities',
        description: 'Export activities for a specific case by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            caseId: {
              type: 'string',
              description: 'The ID of the case to export activities for',
            },
          },
          required: ['caseId'],
        },
      },
      {
        name: 'create_case',
        description: 'Create a new case in the system',
        inputSchema: {
          type: 'object',
          properties: {
            organizationId: {
              type: 'number',
              description: 'Organization ID to create the case in. Defaults to 0.',
            },
            name: {
              type: 'string',
              description: 'Name of the case',
            },
            ownerUserId: {
              type: 'string',
              description: 'User ID of the case owner',
            },
            visibility: {
              type: 'string',
              description: 'Visibility of the case. Defaults to "public-to-organization"',
            },
            assignedUserIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of user IDs to assign to the case. Defaults to empty array.',
            },
          },
          required: ['name', 'ownerUserId'],
        },
      },
      {
        name: 'update_case',
        description: 'Update an existing case by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID of the case to update' },
            name: { type: 'string', description: 'New name for the case' },
            ownerUserId: { type: 'string', description: 'New owner user ID for the case' },
            visibility: { type: 'string', description: 'New visibility setting for the case' },
            assignedUserIds: { type: 'array', items: { type: 'string' }, description: 'New array of user IDs to assign to the case' },
            status: { type: 'string', enum: ['open', 'closed', 'archived'], description: 'New status for the case' },
            notes: { type: 'array', description: 'New notes for the case' },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_case_by_id',
        description: 'Get detailed information about a specific case by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the case to retrieve',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'close_case_by_id',
        description: 'Close a case by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the case to close',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'open_case_by_id',
        description: 'Open a previously closed case by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the case to open',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'archive_case_by_id',
        description: 'Archive a case by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the case to archive',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'change_case_owner',
        description: 'Change the owner of a case',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID of the case to change owner for',
            },
            newOwnerId: {
              type: 'string',
              description: 'User ID of the new owner',
            },
          },
          required: ['id', 'newOwnerId'],
        },
      },
      {
        name: 'check_case_name',
        description: 'Check if a case name is already in use',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The case name to check for availability',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'get_case_activities',
        description: 'Get activity history for a specific case by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the case to retrieve activities for',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_case_endpoints',
        description: 'Get all endpoints associated with a specific case by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the case to retrieve endpoints for',
            },
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter endpoints by. Defaults to 0.',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_case_tasks_by_id',
        description: 'Get all tasks associated with a specific case by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the case to retrieve tasks for',
            },
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter tasks by. Leave empty to use default (0).',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_case_users',
        description: 'Get all users associated with a specific case by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the case to retrieve users for (e.g., C-2022-0001)',
            },
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter users by. Leave empty to use default (0).',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'remove_endpoints_from_case',
        description: 'Remove endpoints from a case based on specified filters',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID of the case to remove endpoints from',
            },
            filter: {
              type: 'object',
              properties: {
                searchTerm: { type: 'string', description: 'Optional search term' },
                name: { type: 'string', description: 'Filter by asset name' },
                ipAddress: { type: 'string', description: 'Filter by IP address' },
                groupId: { type: 'string', description: 'Filter by group ID' },
                groupFullPath: { type: 'string', description: 'Filter by full group path' },
                managedStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by managed status (e.g., ["managed"])' },
                isolationStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by isolation status (e.g., ["isolated"])' },
                platform: { type: 'array', items: { type: 'string' }, description: 'Filter by platform (e.g., ["windows"])' },
                issue: { type: 'string', description: 'Filter by issue' },
                onlineStatus: { type: 'array', items: { type: 'string' }, description: 'Filter by online status (e.g., ["online"])' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Filter by tags' },
                version: { type: 'string', description: 'Filter by agent version' },
                policy: { type: 'string', description: 'Filter by policy' },
                includedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Array of endpoint IDs to remove' },
                excludedEndpointIds: { type: 'array', items: { type: 'string' }, description: 'Array of endpoint IDs to exclude' },
                organizationIds: { type: 'array', items: { oneOf: [{ type: 'number' }, { type: 'string' }] }, description: 'Organization IDs filter. Defaults to [0]' },
              },
              required: [],
              description: 'Filter object to specify which endpoints to remove'
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'remove_task_assignment_from_case',
        description: 'Remove a specific task assignment from a case',
        inputSchema: {
          type: 'object',
          properties: {
            caseId: {
              type: 'string',
              description: 'The ID of the case to remove the task assignment from',
            },
            taskAssignmentId: {
              type: 'string',
              description: 'The ID of the task assignment to remove',
            },
          },
          required: ['caseId', 'taskAssignmentId'],
        },
      },
      {
        name: 'import_task_assignments_to_case',
        description: 'Import task assignments to a specific case',
        inputSchema: {
          type: 'object',
          properties: {
            caseId: {
              type: 'string',
              description: 'ID of the case to import task assignments to',
            },
            taskAssignmentIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of task assignment IDs to import to the case',
            },
          },
          required: ['caseId', 'taskAssignmentIds'],
        },
      },
      {
        name: 'list_repositories',
        description: 'List all evidence repositories in the system',
        inputSchema: {
          type: 'object',
          properties: {
            organizationIds: {
              type: 'string',
              description: 'Organization IDs to filter repositories by. Leave empty to use default (0).',
            },
          },
          required: [],
        },
      },
      {
        name: 'get_repository_by_id',
        description: 'Get detailed information about a specific evidence repository by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the repository to retrieve',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'create_smb_repository',
        description: 'Create a new SMB evidence repository',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name for the SMB repository',
            },
            path: {
              type: 'string',
              description: 'Network share path (e.g. \\\\Network\\Share)',
            },
            username: {
              type: 'string',
              description: 'Username for SMB authentication',
            },
            password: {
              type: 'string',
              description: 'Password for SMB authentication',
            },
            organizationIds: {
              type: 'array',
              items: { type: 'number' },
              description: 'Organization IDs to associate the repository with. Defaults to empty array.',
            },
          },
          required: ['name', 'path', 'username', 'password'],
        },
      },
      {
        name: 'update_smb_repository',
        description: 'Update an existing SMB repository by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID of the SMB repository to update' },
            name: { type: 'string', description: 'Updated name for the SMB repository' },
            path: { type: 'string', description: 'Updated network share path (e.g. \\\\Network\\Share)' },
            username: { type: 'string', description: 'Updated username for SMB authentication' },
            password: { type: 'string', description: 'Updated password for SMB authentication' },
            organizationIds: { type: 'array', items: { type: 'number' }, description: 'Updated organization IDs to associate the repository with' },
          },
          required: ['id', 'name', 'path', 'username', 'password'],
        },
      },
      {
        name: 'create_sftp_repository',
        description: 'Create a new SFTP evidence repository',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name for the SFTP repository' },
            host: { type: 'string', description: 'SFTP server hostname or IP address' },
            port: { type: 'number', description: 'SFTP server port (default: 22)' },
            path: { type: 'string', description: 'Path on the SFTP server (e.g. /)' },
            username: { type: 'string', description: 'Username for SFTP authentication' },
            password: { type: 'string', description: 'Password for SFTP authentication' },
            organizationIds: { type: 'array', items: { type: 'number' }, description: 'Organization IDs to associate the repository with' },
          },
          required: ['name', 'host', 'path', 'username', 'password'],
        },
      },
      {
        name: 'update_sftp_repository',
        description: 'Update an existing SFTP repository',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID of the SFTP repository to update' },
            name: { type: 'string', description: 'Updated name for the SFTP repository' },
            host: { type: 'string', description: 'Updated SFTP server hostname or IP address' },
            port: { type: 'number', description: 'Updated SFTP server port (default: 22)' },
            path: { type: 'string', description: 'Updated path on the SFTP server (e.g. /)' },
            username: { type: 'string', description: 'Updated username for SFTP authentication' },
            password: { type: 'string', description: 'Updated password for SFTP authentication' },
            organizationIds: { type: 'array', items: { type: 'number' }, description: 'Updated organization IDs to associate the repository with' },
          },
          required: ['id', 'name', 'host', 'path', 'username', 'password'],
        },
      },
      {
        name: 'create_ftps_repository',
        description: 'Create a new FTPS evidence repository',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name for the FTPS repository' },
            host: { type: 'string', description: 'FTPS server hostname or IP address' },
            port: { type: 'number', description: 'FTPS server port (default: 22)' },
            path: { type: 'string', description: 'Path on the FTPS server (e.g. /)' },
            username: { type: 'string', description: 'Username for FTPS authentication' },
            password: { type: 'string', description: 'Password for FTPS authentication' },
            allowSelfSignedSSL: { type: 'boolean', description: 'Whether to allow self-signed SSL certificates' },
            publicKey: { type: 'string', description: 'Public key for FTPS authentication (optional)' },
            organizationIds: { type: 'array', items: { type: 'number' }, description: 'Organization IDs to associate the repository with' },
          },
          required: ['name', 'host', 'path', 'username', 'password'],
        },
      },
      {
        name: 'update_ftps_repository',
        description: 'Update an existing FTPS evidence repository',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID of the FTPS repository to update' },
            name: { type: 'string', description: 'Updated name for the FTPS repository' },
            host: { type: 'string', description: 'Updated FTPS server hostname or IP address' },
            port: { type: 'number', description: 'Updated FTPS server port (default: 22)' },
            path: { type: 'string', description: 'Updated path on the FTPS server (e.g. /)' },
            username: { type: 'string', description: 'Updated username for FTPS authentication' },
            password: { type: 'string', description: 'Updated password for FTPS authentication' },
            allowSelfSignedSSL: { type: 'boolean', description: 'Whether to allow self-signed SSL certificates' },
            publicKey: { type: 'string', description: 'Public key for FTPS authentication (optional)' },
            organizationIds: { type: 'array', items: { type: 'number' }, description: 'Updated organization IDs to associate the repository with' },
          },
          required: ['id', 'name', 'host', 'path', 'username', 'password'],
        },
      },
      {
        name: 'validate_ftps_repository',
        description: 'Validate FTPS repository configuration without creating it',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name for the FTPS repository' },
            host: { type: 'string', description: 'FTPS server hostname or IP address' },
            port: { type: 'number', description: 'FTPS server port (default: 22)' },
            path: { type: 'string', description: 'Path on the FTPS server (e.g. /)' },
            username: { type: 'string', description: 'Username for FTPS authentication' },
            password: { type: 'string', description: 'Password for FTPS authentication' },
            allowSelfSignedSSL: { type: 'boolean', description: 'Whether to allow self-signed SSL certificates' },
            publicKey: { type: 'string', description: 'Public key for FTPS authentication (optional)' }
          },
          required: ['name', 'host', 'path', 'username', 'password'],
        },
      },
      {
        name: 'create_azure_storage_repository',
        description: 'Create a new Azure Storage repository',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name for the Azure Storage repository' },
            SASUrl: { type: 'string', description: 'SAS URL for Azure Storage access' },
            organizationIds: { type: 'array', items: { type: 'number' }, description: 'Organization IDs to associate the repository with. Defaults to empty array.' },
          },
          required: ['name', 'SASUrl'],
        },
      },
      {
        name: 'update_azure_storage_repository',
        description: 'Update an existing Azure Storage repository',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID of the Azure Storage repository to update' },
            name: { type: 'string', description: 'Updated name for the Azure Storage repository' },
            SASUrl: { type: 'string', description: 'Updated SAS URL for Azure Storage access' },
            organizationIds: { type: 'array', items: { type: 'number' }, description: 'Updated organization IDs to associate the repository with. Defaults to empty array.' },
          },
          required: ['id', 'name', 'SASUrl'],
        },
      },
      {
        name: 'validate_azure_storage_repository',
        description: 'Validate an Azure Storage repository configuration',
        inputSchema: {
          type: 'object',
          properties: {
            SASUrl: {
              type: 'string',
              description: 'SAS URL for Azure Storage access',
            },
          },
          required: ['SASUrl'],
        },
      },
      {
        name: 'create_amazon_s3_repository',
        description: 'Create a new Amazon S3 repository for evidence storage',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name for the Amazon S3 repository' },
            region: { type: 'string', description: 'AWS region (e.g. eu-west-1)' },
            bucket: { type: 'string', description: 'S3 bucket name' },
            accessKeyId: { type: 'string', description: 'AWS access key ID' },
            secretAccessKey: { type: 'string', description: 'AWS secret access key' },
            organizationIds: { type: 'array', items: { type: 'number' }, description: 'Organization IDs to associate the repository with. Defaults to empty array.' }
          },
          required: ['name', 'region', 'bucket', 'accessKeyId', 'secretAccessKey'],
        },
      },
      {
        name: 'update_amazon_s3_repository',
        description: 'Update an existing Amazon S3 repository',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID of the Amazon S3 repository to update' },
            name: { type: 'string', description: 'Updated name for the Amazon S3 repository' },
            region: { type: 'string', description: 'Updated AWS region (e.g. eu-west-1)' },
            bucket: { type: 'string', description: 'Updated S3 bucket name' },
            accessKeyId: { type: 'string', description: 'Updated AWS access key ID' },
            secretAccessKey: { type: 'string', description: 'Updated AWS secret access key' },
            organizationIds: { type: 'array', items: { type: 'number' }, description: 'Updated organization IDs to associate the repository with. Defaults to empty array.' }
          },
          required: ['id', 'name', 'region', 'bucket', 'accessKeyId', 'secretAccessKey'],
        },
      },
      {
        name: 'validate_amazon_s3_repository',
        description: 'Validate Amazon S3 repository configuration',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name for the Amazon S3 repository' },
            region: { type: 'string', description: 'AWS region (e.g. eu-west-1)' },
            bucket: { type: 'string', description: 'S3 bucket name' },
            accessKeyId: { type: 'string', description: 'AWS access key ID' },
            secretAccessKey: { type: 'string', description: 'AWS secret access key' },
            organizationIds: { type: 'array', items: { type: 'number' }, description: 'Organization IDs to associate the repository with. Defaults to empty array.' }
          },
          required: ['name', 'region', 'bucket', 'accessKeyId', 'secretAccessKey'],
        },
      },
      {
        name: 'get_repository_by_id',
        description: 'Get detailed information about a specific evidence repository by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the repository to retrieve',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_repository',
        description: 'Delete an evidence repository by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the repository to delete',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'download_case_ppc',
        description: 'Download a PPC file for a specific endpoint and task',
        inputSchema: {
          type: 'object',
          properties: {
            endpointId: {
              type: 'string',
              description: 'The ID of the endpoint to download the PPC file for',
            },
            taskId: {
              type: 'string',
              description: 'The ID of the task to download the PPC file for',
            },
          },
          required: ['endpointId', 'taskId'],
        },
      },
      {
        name: 'download_task_report',
        description: 'Download a task report for a specific endpoint and task',
        inputSchema: {
          type: 'object',
          properties: {
            endpointId: {
              type: 'string',
              description: 'The ID of the endpoint to download the task report for',
            },
            taskId: {
              type: 'string',
              description: 'The ID of the task to download the task report for',
            },
          },
          required: ['endpointId', 'taskId'],
        },
      },
      {
        name: 'get_report_file_info',
        description: 'Get information about a PPC file for a specific endpoint and task',
        inputSchema: {
          type: 'object',
          properties: {
            endpointId: {
              type: 'string',
              description: 'The ID of the endpoint to get report file information for',
            },
            taskId: {
              type: 'string',
              description: 'The ID of the task to get report file information for',
            },
          },
          required: ['endpointId', 'taskId'],
        },
      },
      {
        name: 'get_organization_users',
        description: 'Get users for a specific organization by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the organization to retrieve users for',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'assign_users_to_organization',
        description: 'Assign users to a specific organization',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the organization to assign users to',
            },
            userIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of user IDs to assign to the organization',
            },
          },
          required: ['id', 'userIds'],
        },
      },
      {
        name: 'remove_user_from_organization',
        description: 'Remove a user from an organization',
        inputSchema: {
          type: 'object',
          properties: {
            organizationId: {
              type: 'string',
              description: 'The ID of the organization to remove the user from',
            },
            userId: {
              type: 'string',
              description: 'The ID of the user to remove from the organization',
            },
          },
          required: ['organizationId', 'userId'],
        },
      },
      {
        name: 'create_organization',
        description: 'Create a new organization',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name of the organization' },
            shareableDeploymentEnabled: { type: 'boolean', description: 'Whether shareable deployment is enabled. Defaults to false.' },
            contact: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Contact name' },
                title: { type: 'string', description: 'Contact title (optional)' },
                phone: { type: 'string', description: 'Contact phone number (optional)' },
                mobile: { type: 'string', description: 'Contact mobile number (optional)' },
                email: { type: 'string', description: 'Contact email address' }
              },
              required: ['name', 'email'],
              description: 'Contact information for the organization'
            },
            note: { type: 'string', description: 'Additional notes about the organization (optional)' }
          },
          required: ['name', 'contact'],
        },
      },
      {
        name: 'update_organization_by_id',
        description: 'Update an existing organization by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'The ID of the organization to update',
            },
            name: {
              type: 'string',
              description: 'Updated name of the organization',
            },
            shareableDeploymentEnabled: {
              type: 'boolean',
              description: 'Whether shareable deployment is enabled',
            },
            contact: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Contact name' },
                title: { type: 'string', description: 'Contact title' },
                phone: { type: 'string', description: 'Contact phone number' },
                mobile: { type: 'string', description: 'Contact mobile number' },
                email: { type: 'string', description: 'Contact email address' }
              },
              description: 'Updated contact information for the organization',
            },
            note: {
              type: 'string',
              description: 'Additional notes about the organization',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_organization_by_id',
        description: 'Get detailed information about a specific organization by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'The ID of the organization to retrieve',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'check_organization_name_exists',
        description: 'Check if an organization name already exists in the system',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the organization to check',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'get_shareable_deployment_info',
        description: 'Get shareable deployment information using a deployment token',
        inputSchema: {
          type: 'object',
          properties: {
            deploymentToken: {
              type: 'string',
              description: 'The deployment token to retrieve information for',
            },
          },
          required: ['deploymentToken'],
        },
      },
      {
        name: 'update_organization_shareable_deployment',
        description: 'Update an organization\'s shareable deployment settings',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'The ID of the organization to update',
            },
            status: {
              type: 'boolean',
              description: 'Whether shareable deployment should be enabled (true) or disabled (false)',
            },
          },
          required: ['id', 'status'],
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
    } else if (name === 'start_tagging') {
      validateAirApiToken();
      const parsedArgs = StartTaggingArgsSchema.parse(args);
      return await autoAssetTagTools.startTagging(parsedArgs);
    } else if (name === 'acquire_baseline') {
      validateAirApiToken();
      const parsedArgs = AcquireBaselineArgsSchema.parse(args);
      return await baselineTools.acquireBaseline(parsedArgs);
    } else if (name === 'compare_baseline') {
      validateAirApiToken();
      const parsedArgs = CompareBaselineArgsSchema.parse(args);
      return await baselineTools.compareBaseline(parsedArgs);
    } else if (name === 'get_comparison_report') {
      validateAirApiToken();
      const parsedArgs = GetComparisonReportArgsSchema.parse(args);
      return await baselineTools.getComparisonReport(parsedArgs);
    } else if (name === 'list_acquisition_artifacts') {
      validateAirApiToken();
      return await acquisitionArtifactTools.listAcquisitionArtifacts();
    } else if (name === 'list_e_discovery_patterns') {
      validateAirApiToken();
      return await eDiscoveryTools.listEDiscoveryPatterns();
    } else if (name === 'create_policy') {
      validateAirApiToken();
      const parsedArgs = CreatePolicyArgsSchema.parse(args);
      return await policyTools.createPolicy(parsedArgs);
    } else if (name === 'update_policy') {
      validateAirApiToken();
      const parsedArgs = UpdatePolicyArgsSchema.parse(args);
      return await policyTools.updatePolicy(parsedArgs);
    } else if (name === 'get_policy_by_id') {
      validateAirApiToken();
      const parsedArgs = GetPolicyByIdArgsSchema.parse(args);
      return await policyTools.getPolicyById(parsedArgs);
    } else if (name === 'update_policy_priorities') {
      validateAirApiToken();
      const parsedArgs = UpdatePolicyPrioritiesArgsSchema.parse(args);
      return await policyTools.updatePolicyPriorities(parsedArgs);
    } else if (name === 'get_policy_match_stats') {
      validateAirApiToken();
      const parsedArgs = PolicyMatchStatsArgsSchema.parse(args);
      return await policyTools.getPolicyMatchStats(parsedArgs);
    } else if (name === 'delete_policy_by_id') {
      validateAirApiToken();
      const parsedArgs = DeletePolicyByIdArgsSchema.parse(args);
      return await policyTools.deletePolicyById(parsedArgs);
    } else if (name === 'get_task_assignments_by_id') {
      validateAirApiToken();
      const parsedArgs = GetTaskAssignmentsByIdArgsSchema.parse(args);
      return await assignmentTools.getTaskAssignmentsById(parsedArgs);
    } else if (name === 'cancel_task_assignment') {
      validateAirApiToken();
      const parsedArgs = CancelTaskAssignmentArgsSchema.parse(args);
      return await assignmentTools.cancelTaskAssignment(parsedArgs);
    } else if (name === 'delete_task_assignment') {
      validateAirApiToken();
      const parsedArgs = DeleteTaskAssignmentArgsSchema.parse(args);
      return await assignmentTools.deleteTaskAssignment(parsedArgs);
    } else if (name === 'get_task_by_id') {
      validateAirApiToken();
      const parsedArgs = GetTaskByIdArgsSchema.parse(args);
      return await taskTools.getTaskById(parsedArgs);
    } else if (name === 'cancel_task_by_id') {
      validateAirApiToken();
      const parsedArgs = CancelTaskByIdArgsSchema.parse(args);
      return await taskTools.cancelTaskById(parsedArgs);
    } else if (name === 'delete_task_by_id') {
      validateAirApiToken();
      const parsedArgs = DeleteTaskByIdArgsSchema.parse(args);
      return await taskTools.deleteTaskById(parsedArgs);
    } else if (name === 'list_triage_tags') {
      validateAirApiToken();
      const parsedArgs = ListTriageTagsArgsSchema.parse(args);
      return await triageTagTools.listTriageTags(parsedArgs);
    } else if (name === 'create_triage_tag') {
      validateAirApiToken();
      const parsedArgs = CreateTriageTagArgsSchema.parse(args);
      return await triageTagTools.createTriageTag(parsedArgs);
    } else if (name === 'create_triage_rule') {
      validateAirApiToken();
      const parsedArgs = CreateTriageRuleArgsSchema.parse(args);
      return await triageTools.createTriageRule(parsedArgs);
    } else if (name === 'update_triage_rule') {
      validateAirApiToken();
      const parsedArgs = UpdateTriageRuleArgsSchema.parse(args);
      return await triageTools.updateTriageRule(parsedArgs);
    } else if (name === 'delete_triage_rule') {
      validateAirApiToken();
      const parsedArgs = DeleteTriageRuleArgsSchema.parse(args);
      return await triageTools.deleteTriageRule(parsedArgs);
    } else if (name === 'get_triage_rule_by_id') {
      validateAirApiToken();
      const parsedArgs = GetTriageRuleByIdArgsSchema.parse(args);
      return await triageTools.getTriageRuleById(parsedArgs);
    } else if (name === 'validate_triage_rule') {
      validateAirApiToken();
      const parsedArgs = ValidateTriageRuleArgsSchema.parse(args);
      return await triageTools.validateTriageRule(parsedArgs);
    } else if (name === 'assign_triage_task') {
      validateAirApiToken();
      const parsedArgs = AssignTriageTaskArgsSchema.parse(args);
      return await triageTools.assignTriageTask(parsedArgs);
    } else if (name === 'add_note_to_case') {
      validateAirApiToken();
      const parsedArgs = AddNoteToCaseArgsSchema.parse(args);
      return await caseNotesTools.addNoteToCase(parsedArgs);
    } else if (name === 'update_note_in_case') {
      validateAirApiToken();
      const parsedArgs = UpdateNoteCaseArgsSchema.parse(args);
      return await caseNotesTools.updateNoteInCase(parsedArgs);
    } else if (name === 'delete_note_from_case') {
      validateAirApiToken();
      const parsedArgs = DeleteNoteFromCaseArgsSchema.parse(args);
      return await caseNotesTools.deleteNoteFromCase(parsedArgs);
    } else if (name === 'export_cases') {
      validateAirApiToken();
      const parsedArgs = ExportCasesArgsSchema.parse(args);
      return await casesExportTools.exportCases(parsedArgs);
    } else if (name === 'export_case_notes') {
      validateAirApiToken();
      const parsedArgs = ExportCaseNotesArgsSchema.parse(args);
      return await casesExportTools.exportCaseNotes(parsedArgs);
    } else if (name === 'export_case_endpoints') {
      validateAirApiToken();
      const parsedArgs = ExportCaseEndpointsArgsSchema.parse(args);
      return await casesExportTools.exportCaseEndpoints(parsedArgs);
    } else if (name === 'export_case_activities') {
      validateAirApiToken();
      const parsedArgs = ExportCaseActivitiesArgsSchema.parse(args);
      return await casesExportTools.exportCaseActivities(parsedArgs);
    } else if (name === 'create_case') {
      validateAirApiToken();
      const parsedArgs = CreateCaseArgsSchema.parse(args);
      return await caseTools.createCase(parsedArgs);
    } else if (name === 'update_case') {
      validateAirApiToken();
      const parsedArgs = UpdateCaseArgsSchema.parse(args);
      return await caseTools.updateCase(parsedArgs);
    } else if (name === 'get_case_by_id') {
      validateAirApiToken();
      const parsedArgs = GetCaseByIdArgsSchema.parse(args);
      return await caseTools.getCaseById(parsedArgs);
    } else if (name === 'close_case_by_id') {
      validateAirApiToken();
      const parsedArgs = CloseCaseArgsSchema.parse(args);
      return await caseTools.closeCase(parsedArgs);
    } else if (name === 'open_case_by_id') {
      validateAirApiToken();
      const parsedArgs = OpenCaseArgsSchema.parse(args);
      return await caseTools.openCase(parsedArgs);
    } else if (name === 'archive_case_by_id') {
      validateAirApiToken();
      const parsedArgs = ArchiveCaseArgsSchema.parse(args);
      return await caseTools.archiveCase(parsedArgs);
    } else if (name === 'change_case_owner') {
      validateAirApiToken();
      const parsedArgs = ChangeCaseOwnerArgsSchema.parse(args);
      return await caseTools.changeCaseOwner(parsedArgs);
    } else if (name === 'check_case_name') {
      validateAirApiToken();
      const parsedArgs = CheckCaseNameArgsSchema.parse(args);
      return await caseTools.checkCaseName(parsedArgs);
    } else if (name === 'get_case_activities') {
      validateAirApiToken();
      const parsedArgs = GetCaseActivitiesArgsSchema.parse(args);
      return await caseTools.getCaseActivities(parsedArgs);
    } else if (name === 'get_case_endpoints') {
      validateAirApiToken();
      const parsedArgs = GetCaseEndpointsArgsSchema.parse(args);
      return await caseTools.getCaseEndpoints(parsedArgs);
    } else if (name === 'get_case_tasks_by_id') {
      validateAirApiToken();
      const parsedArgs = GetCaseTasksByIdArgsSchema.parse(args);
      return await caseTools.getCaseTasksById(parsedArgs);
    } else if (name === 'get_case_users') {
      validateAirApiToken();
      const parsedArgs = GetCaseUsersArgsSchema.parse(args);
      return await caseTools.getCaseUsers(parsedArgs);
    } else if (name === 'remove_endpoints_from_case') {
      validateAirApiToken();
      const parsedArgs = RemoveEndpointsFromCaseArgsSchema.parse(args);
      return await caseTools.removeEndpointsFromCase(parsedArgs);
    } else if (name === 'remove_task_assignment_from_case') {
      validateAirApiToken();
      const parsedArgs = RemoveTaskAssignmentFromCaseArgsSchema.parse(args);
      return await caseTools.removeTaskAssignmentFromCase(parsedArgs);
    } else if (name === 'import_task_assignments_to_case') {
      validateAirApiToken();
      const parsedArgs = ImportTaskAssignmentsToCaseArgsSchema.parse(args);
      return await caseTools.importTaskAssignmentsToCase(parsedArgs);
    } else if (name === 'list_repositories') {
      validateAirApiToken();
      const parsedArgs = ListRepositoriesArgsSchema.parse(args);
      return await repositoryTools.listRepositories(parsedArgs);
    } else if (name === 'create_smb_repository') {
      validateAirApiToken();
      const parsedArgs = CreateSmbRepositoryArgsSchema.parse(args); 
      return await repositoryTools.createSmbRepository(parsedArgs);
    } else if (name === 'update_smb_repository') {
      validateAirApiToken();
      const parsedArgs = UpdateSmbRepositoryArgsSchema.parse(args);
      return await repositoryTools.updateSmbRepository(parsedArgs);
    } else if (name === 'create_sftp_repository') {
      validateAirApiToken();
      const parsedArgs = CreateSftpRepositoryArgsSchema.parse(args);
      return await repositoryTools.createSftpRepository(parsedArgs);
    } else if (name === 'update_sftp_repository') {
      validateAirApiToken();
      const parsedArgs = UpdateSftpRepositoryArgsSchema.parse(args);
      return await repositoryTools.updateSftpRepository(parsedArgs);
    } else if (name === 'create_ftps_repository') {
      validateAirApiToken();
      const parsedArgs = CreateFtpsRepositoryArgsSchema.parse(args);
      return await repositoryTools.createFtpsRepository(parsedArgs);
    } else if (name === 'update_ftps_repository') {
      validateAirApiToken();
      const parsedArgs = UpdateFtpsRepositoryArgsSchema.parse(args);
      return await repositoryTools.updateFtpsRepository(parsedArgs);
    } else if (name === 'validate_ftps_repository') {
      validateAirApiToken();
      const parsedArgs = ValidateFtpsRepositoryArgsSchema.parse(args);
      return await repositoryTools.validateFtpsRepository(parsedArgs);
    } else if (name === 'create_azure_storage_repository') {
      validateAirApiToken();
      const parsedArgs = CreateAzureStorageRepositoryArgsSchema.parse(args);
      return await repositoryTools.createAzureStorageRepository(parsedArgs);
    } else if (name === 'update_azure_storage_repository') {
      validateAirApiToken();
      const parsedArgs = UpdateAzureStorageRepositoryArgsSchema.parse(args);
      return await repositoryTools.updateAzureStorageRepository(parsedArgs);
    } else if (name === 'validate_azure_storage_repository') {
      validateAirApiToken();
      const parsedArgs = ValidateAzureStorageRepositoryArgsSchema.parse(args);
      return await repositoryTools.validateAzureStorageRepository(parsedArgs);
    } else if (name === 'create_amazon_s3_repository') {
      validateAirApiToken();
      const parsedArgs = CreateAmazonS3RepositoryArgsSchema.parse(args);
      return await repositoryTools.createAmazonS3Repository(parsedArgs);
    } else if (name === 'update_amazon_s3_repository') {
      validateAirApiToken();
      const parsedArgs = UpdateAmazonS3RepositoryArgsSchema.parse(args);
      return await repositoryTools.updateAmazonS3Repository(parsedArgs);
    } else if (name === 'validate_amazon_s3_repository') {
      validateAirApiToken();
      const parsedArgs = ValidateAmazonS3RepositoryArgsSchema.parse(args);
      return await repositoryTools.validateAmazonS3Repository(parsedArgs);
    } else if (name === 'get_repository_by_id') {
      validateAirApiToken();
      const parsedArgs = GetRepositoryByIdArgsSchema.parse(args);
      return await repositoryTools.getRepositoryById(parsedArgs);
    } else if (name === 'delete_repository') {
      validateAirApiToken();
      const parsedArgs = DeleteRepositoryArgsSchema.parse(args);
      return await repositoryTools.deleteRepository(parsedArgs);
    } else if (name === 'download_case_ppc') {
      validateAirApiToken();
      const parsedArgs = DownloadCasePpcArgsSchema.parse(args);
      return await evidenceTools.downloadCasePpc(parsedArgs);
    } else if (name === 'download_task_report') {
      validateAirApiToken();
      const parsedArgs = DownloadTaskReportArgsSchema.parse(args);
      return await evidenceTools.downloadTaskReport(parsedArgs);
    } else if (name === 'get_report_file_info') {
      validateAirApiToken();
      const parsedArgs = GetReportFileInfoArgsSchema.parse(args);
      return await evidenceTools.getReportFileInfo(parsedArgs);
    } else if (name === 'get_organization_users') { 
      validateAirApiToken();
      const parsedArgs = GetOrganizationUsersArgsSchema.parse(args);
      return await organizationUsersTools.getOrganizationUsers(parsedArgs);
    } else if (name === 'assign_users_to_organization') {
      validateAirApiToken();
      const parsedArgs = AssignUsersToOrganizationArgsSchema.parse(args);
      return await organizationUsersTools.assignUsersToOrganization(parsedArgs);
    } else if (name === 'remove_user_from_organization') {
      validateAirApiToken();
      const parsedArgs = RemoveUserFromOrganizationArgsSchema.parse(args);
      return await organizationUsersTools.removeUserFromOrganization(parsedArgs);
    } else if (name === 'create_organization') {
      validateAirApiToken();
      const parsedArgs = CreateOrganizationArgsSchema.parse(args);
      return await organizationTools.createOrganization(parsedArgs);
    } else if (name === 'update_organization_by_id') {
      validateAirApiToken();
      const parsedArgs = UpdateOrganizationArgsSchema.parse(args);
      return await organizationTools.updateOrganization(parsedArgs);
    } else if (name === 'get_organization_by_id') {
      validateAirApiToken();
      const parsedArgs = GetOrganizationByIdArgsSchema.parse(args);
      return await organizationTools.getOrganizationById(parsedArgs);
    } else if (name === 'check_organization_name_exists') {
      validateAirApiToken();
      const parsedArgs = CheckOrganizationNameExistsArgsSchema.parse(args);
      return await organizationTools.checkOrganizationNameExists(parsedArgs);
    } else if (name === 'get_shareable_deployment_info') {
      validateAirApiToken();
      const parsedArgs = GetShareableDeploymentInfoArgsSchema.parse(args);
      return await organizationTools.getShareableDeploymentInfo(parsedArgs);
    } else if (name === 'update_organization_shareable_deployment') {
      validateAirApiToken();
      const parsedArgs = UpdateOrganizationShareableDeploymentArgsSchema.parse(args);
      return await organizationTools.updateOrganizationShareableDeployment(parsedArgs);
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