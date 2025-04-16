# Binalyze AIR MCP Server

A Node.js server implementing Model Context Protocol (MCP) for Binalyze AIR.

Supports:

- Asset Management
- Acquisition Profiles Management
- Organization Management

## Overview

This MCP server allows LLMs to interact with your AIR through natural language, providing tools to list assets, acquisition profiles, and organizations in your system.

## How to Use

In Claude Desktop, or any MCP Client, you can use natural language to:

- `List all assets in the system`
- `List all acquisition profiles in the system`
- `List all organizations in the system`

### API Token Requirement

**Important:** You need an API token to use this MCP server. Set it using the AIR_API_TOKEN environment variable.

## Installation

### Local Build

1. Clone the repository
   ```bash
   git clone https://github.com/binalyze/air-mcp
   ```

2. Change to the project directory
   ```bash
   cd air-mcp
   ```

3. Build the project
   ```bash
   npm build
   ```

### Usage with Cursor

1. Navigate to Cursor Settings > MCP
2. Add new MCP server with the following configuration:
   ```json
   {
     "mcpServers": {
       "air-mcp": {
         "command": "npx",
         "args": ["-y", "air-mcp"],
         "env": {
           "AIR_HOST": "your-api-host.com",
           "AIR_API_TOKEN": "your-api-token"
         }
       }
     }
   }
   ```

### Usage with Claude Desktop

Add the following configuration to your Claude Desktop config file:
```json
{
  "mcpServers": {
    "air-mcp": {
      "command": "node",
      "args": ["/path/to/your/air-mcp/build/index.js"],
      "env": {
        "AIR_HOST": "your-api-host.com",
        "AIR_API_TOKEN": "your-api-token"
      }
    }
  }
}
```