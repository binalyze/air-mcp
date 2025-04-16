#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { config } from './config';
import { assetTools, ListAssetsArgsSchema } from './tools/assets';
import { acquisitionTools, ListAcquisitionProfilesArgsSchema } from './tools/acquisitions';
import { organizationTools, ListOrganizationsArgsSchema } from './tools/organizations';

const server = new Server({
  name: 'air-mcp',
  version: '1.1.1'
}, {
  capabilities: {
    tools: {}
  }
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error('Listing tools');
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
        name: 'list_organizations',
        description: 'List all organizations in the system',
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
      if (!config.airApiToken || config.airApiToken.trim() === '') {
        throw new Error('AIR_API_TOKEN not provided. Please configure the MCP server with a valid airApiToken to execute tools.');
      }
      const parsedArgs = ListAssetsArgsSchema.parse(args);
      return await assetTools.listAssets(parsedArgs);
    } else if (name === 'list_acquisition_profiles') {
      if (!config.airApiToken || config.airApiToken.trim() === '') {
        throw new Error('AIR_API_TOKEN not provided. Please configure the MCP server with a valid airApiToken to execute tools.');
      }
      const parsedArgs = ListAcquisitionProfilesArgsSchema.parse(args);
      return await acquisitionTools.listAcquisitionProfiles(parsedArgs);
    } else if (name === 'list_organizations') {
      if (!config.airApiToken || config.airApiToken.trim() === '') {
        throw new Error('AIR_API_TOKEN not provided. Please configure the MCP server with a valid airApiToken to execute tools.');
      }
      return await organizationTools.listOrganizations();
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
    console.error('Binalyze AIR MCP server started');
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
});