# Binalyze AIR MCP Server

[![smithery badge](https://smithery.ai/badge/@binalyze/air-mcp)](https://smithery.ai/server/@binalyze/air-mcp)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MCP](https://img.shields.io/badge/MCP-Protocol-blue)](https://modelcontextprotocol.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<a href="https://glama.ai/mcp/servers/@binalyze/air-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@binalyze/air-mcp/badge" alt="Binalyze AIR Server MCP server" />
</a>

<p align="center">
  <img src="./src/assets/bi-logo.png" alt="AIR Logo" width="180"/>
</p>

A Node.js server implementing **Model Context Protocol (MCP)** for Binalyze AIR, enabling natural language interaction with AIR's digital forensics and incident response capabilities.

## ✨ Features

- **Asset Management** - List assets in your organization.
- **Acquisition Profiles** - List acquisition profiles.
- **Organization Management** - List organizations.
- **Case Management** - List cases in your organization.
- **Policy Management** - See security policies across your organization.
- **Task Management** - Track forensic collection tasks and their statuses.
- **Triage Rules** - View YARA, Osquery and Sigma rules for threat detection.
- **User Management** - List users in your organization.

## Overview

This MCP server creates a bridge between **Large Language Models (LLMs)** and Binalyze AIR, allowing interaction through natural language. Retrieve information about your digital forensics environment without writing code or learning complex APIs.

### 🔑 API Token Requirement

> **Important:** An API token is required for authentication. Set it using the `AIR_API_TOKEN` environment variable.

## 📦 Installation

### Local Development

```bash
# Clone the repository
git clone https://github.com/binalyze/air-mcp

# Change to the project directory
cd air-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

### Usage with Claude Desktop

Add the following configuration to your Claude Desktop config file:

```json
{
  "mcpServers": {
    "air-mcp": {
      "command": "npx",
      "args": ["-y", "@binalyze/air-mcp"],
      "env": {
        "AIR_HOST": "your-api-host.com",
        "AIR_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Usage with Cursor

1. Navigate to Cursor Settings > MCP
2. Add new MCP server with the following configuration:
   ```json
   {
     "mcpServers": {
       "air-mcp": {
         "command": "npx",
         "args": ["-y", "@binalyze/air-mcp"],
         "env": {
           "AIR_HOST": "your-api-host.com",
           "AIR_API_TOKEN": "your-api-token"
         }
       }
     }
   }
   ```

## 🧩 Usage with Smithery

> **Note:** Don't forget to activate Agent mode in your editor.

### One-Line Installation Commands

#### Claude
```bash
npx -y @smithery/cli@latest install @binalyze/air-mcp --client claude --key {smithery_key}
```

#### Cursor
```bash
npx -y @smithery/cli@latest install @binalyze/air-mcp --client cursor --key {smithery_key}
```

#### Windsurf
```bash
npx -y @smithery/cli@latest install@rapidappio/rapidapp-mcp --client windsurf --key {smithery_key}
```

#### VSCode
```bash
npx -y @smithery/cli@latest install @binalyze/air-mcp --client vscode --key {smithery_key}
```
Or use the Magic Link option in VSCode.

## How to Use

In Claude Desktop, or any MCP Client, you can use natural language commands:

| Command | Description |
|---------|-------------|
| `List all assets in the system` | Shows all managed/unmanaged endpoints with OS, platform info |
| `List all acquisition profiles` | Displays available acquisition profiles |
| `List all organizations` | Shows all organizations in environments |
| `List all cases` | Displays cases with status and creation time |
| `List all policies` | Shows security and collection policies |
| `List all tasks` | Lists all tasks with their statuses |
| `List all triage rules` | Shows YARA and Sigma rules for threat detection |
| `List all users` | Shows all users in the system with their details |

### Filtering by Organization

You can filter results by organization ID:

```
List all assets for organization 123
Show me all cases for organization 456
Get policies for organization 789
List tasks for organization 123
List triage rules for organization 123
List users for organization 123
```

## Response Example

```
Found 3 assets:
a1b2c3d4: Win10-Workstation1 (Windows - Windows 10 Pro)
e5f6g7h8: Ubuntu-Server1 (Linux - Ubuntu 20.04)
i9j0k1l2: MacBook-Pro (macOS - macOS 12.3)
```
Found 3 triage rules:
corewebshell_detection: core.webshell_detection (Engine: yara, Search In: both)
fireeye-sunburst-countermeasures: FireEye Sunburst Countermeasures (Engine: yara, Search In: both)
fireeye-red-team-tools-countermeasures: FireEye Red Team Tools Countermeasures (Engine: yara, Search In: both)
```
Found 1 user:
DtmrCWrK1o7m0bqVasdzg6Ia: demo@binalyze.com (demo@binalyze.com)