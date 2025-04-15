# Binalyze AIR MCP Server

A Node.js server implementing Model Context Protocol (MCP) for Binalyze AIR.

Supports:

- Asset Management.

## Overview

This MCP server allows LLMs to interact with your AIR through natural language, providing tools to list assets and retrieve detailed information about specific assets.

## How to Use

In Claude Desktop, or any MCP Client, you can use natural language to:

- `List all assets in the system`

### API Token Requirement

**Important:** You need an API token to use this MCP server. Set it using the API_TOKEN environment variable.

## Installation

### Usage with Cursor

1. Navigate to Cursor Settings > MCP
2. Add new MCP server with the following configuration:
   ```json
   {
     "mcpServers": {
       "assets": {
         "command": "npx",
         "args": ["-y", "air-mcp"],
         "env": {
           "AIR_HOST": "your-api-host.com",
           "AIR_API_TOKEN": "your-api-token"
         }
       }
     }
   }