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
- **Asset Details** - Get detailed information about a specific asset by its ID.
- **Asset Tasks** - Get all tasks associated with a specific asset by its ID.
- **Acquisition Profiles** - List acquisition profiles.
- **Acquisition Tasks** - Assign evidence acquisition tasks to endpoints.
- **Image Acquisition Tasks** - Assign disk image acquisition tasks to endpoints.
- **Create Acquisition Profiles** - Create new acquisition profiles with specific evidence/artifact/network settings.
- **Reboot Tasks** - Assign reboot tasks to specific endpoints.
- **Shutdown Tasks** - Assign shutdown tasks to specific endpoints.
- **Isolation Tasks** - Isolate or unisolate specific endpoints.
- **Log Retrieval Tasks** - Retrieve logs from specific endpoints.
- **Version Update Tasks** - Assign version update tasks to specific endpoints.
- **Organization Management** - List organizations.
- **Case Management** - List cases in your organization.
- **Policy Management** - See security policies across your organization.
- **Task Management** - Track forensic collection tasks and their statuses.
- **Triage Rules** - View YARA, Osquery and Sigma rules for threat detection.
- **User Management** - List users in your organization.
- **Drone Analyzers** - View available drone analyzers with supported operating systems.
- **Audit Log Export** - Initiate an export of audit logs.
- **List Audit Logs** - View audit logs from the system.

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
| `Get details about asset with ID "abc123"` | Displays detailed information about a specific asset |
| `Get tasks for asset with ID "abc123"` | Shows all tasks associated with a specific asset |
| `List all acquisition profiles` | Displays available acquisition profiles |
| `Get acquisition profile details by ID` | Shows detailed information about a specific acquisition profile, including evidence and artifacts |
| `Assign an acquisition task to endpoint 123abc using profile "full" for case "C-2022-0001"` | Assigns an evidence acquisition task to specified endpoint(s) |
| `Assign an image acquisition task to endpoint 123abc for volume /dev/sda1 saving to repository 456def` | Assigns a disk image acquisition task to a specific endpoint and volume, saving to a specified repository |
| `Create an acquisition profile named "My Custom Profile" with windows evidence ["clp"] and linux artifact ["apcl"]` | Creates a new acquisition profile with the specified configuration |
| `Reboot endpoint 123abc` | Assigns a reboot task to a specific endpoint |
| `Shutdown endpoint 123abc` | Assigns a shutdown task to a specific endpoint |
| `Isolate endpoint 123abc` | Assigns an isolation task to a specific endpoint |
| `Unisolate endpoint 123abc` | Removes isolation from a specific endpoint |
| `Retrieve logs from endpoint 123abc` | Assigns a log retrieval task to a specific endpoint |
| `Update version for endpoint 123abc` | Assigns a version update task to a specific endpoint |
| `List all organizations` | Shows all organizations in environments |
| `List all cases` | Displays cases with status and creation time |
| `List all policies` | Shows security and collection policies |
| `List all tasks` | Lists all tasks with their statuses |
| `List all triage rules` | Shows YARA, OSQuery and Sigma rules for threat detection |
| `List all users` | Shows all users in the system with their details |
| `List all drone analyzers` | Shows available drone analyzers with supported operating systems |
| `Export audit logs` | Initiates the export of audit logs. The export runs in the background on the AIR server. |
| `List audit logs` | Shows audit logs with details like timestamp, user, action, entity |

### Filtering by Organization

You can filter results by organization ID:

```
List all assets for organization 123
Show me all cases for organization 456
Get policies for organization 789
List tasks for organization 123
List triage rules for organization 123
List users for organization 123
Export audit logs for organization 0
List audit logs for organization 0
```

### Getting Asset Details

You can retrieve detailed information about a specific asset:

```
Get details for asset "bc906dea-f92d-46b3-87f2-a2fc36667f70"
Show me information about endpoint with ID "bc906dea-f92d-46b3-87f2-a2fc36667f70"
```

### Getting Asset Tasks

You can retrieve all tasks associated with a specific asset:

```
Get tasks for asset "bc906dea-f92d-46b3-87f2-a2fc36667f70"
Show me the tasks assigned to endpoint with ID "bc906dea-f92d-46b3-87f2-a2fc36667f70"
What tasks are currently running on asset "bc906dea-f92d-46b3-87f2-a2fc36667f70"
```

### Assigning Acquisition Tasks

You can assign evidence acquisition tasks to specific endpoints:

```
Assign an acquisition task to endpoint "0ccbb181-685c-4f1e-982a-6f7c7e88eadd" using profile "full" for case "C-2022-0001"
Start an acquisition on endpoints ["id1", "id2"] with profile "memory" for case "C-2023-0045" with analyzers ["bha", "wsa"]
```

### Assigning Image Acquisition Tasks

You can assign disk image acquisition tasks to specific endpoints and volumes:

```
Assign an image acquisition task to endpoint "7a37cfdb-..." for volume "/dev/disk3s5" saving to repository "Q2gCVO..." with case ID "C-2024-0123"
Assign image task for endpoint "ep-id-1" volumes ["/dev/sda1", "/dev/sda2"] and endpoint "ep-id-2" volume "C:" to repository "repo-xyz"
```

### Assigning Reboot Tasks

You can assign reboot tasks to specific endpoints:

```
Reboot endpoint "0ccbb181-685c-4f1e-982a-6f7c7e88eadd"
Assign a reboot task to endpoints ["id1", "id2"] for organization 123
```

### Assigning Shutdown Tasks

You can assign shutdown tasks to specific endpoints:

```
Shutdown endpoint "0ccbb181-685c-4f1e-982a-6f7c7e88eadd"
Assign a shutdown task to endpoints ["id1", "id2"] for organization 123
```

### Assigning Isolation Tasks

You can isolate or unisolate specific endpoints:

```
Isolate endpoint "0ccbb181-685c-4f1e-982a-6f7c7e88eadd"
Assign an isolation task to endpoints ["id1", "id2"] for organization 123
Unisolate endpoint "0ccbb181-685c-4f1e-982a-6f7c7e88eadd" (by setting enabled=false)
Assign an unisolation task to endpoints ["id1", "id2"] with enabled=false
```

### Assigning Log Retrieval Tasks

You can retrieve logs from specific endpoints:

```
Retrieve logs from endpoint "0ccbb181-685c-4f1e-982a-6f7c7e88eadd" with organization ID 0
Assign a log retrieval task to endpoints ["id1", "id2"] for organization 123
```

Note: Always specify the organization ID when assigning log retrieval tasks. The endpoint must exist in the specified organization.

### Assigning Version Update Tasks

You can assign version update tasks to specific endpoints:

```
Update version for endpoint "0ccbb181-685c-4f1e-982a-6f7c7e88eadd"
Assign a version update task to endpoints ["id1", "id2"] for organization 123
```

## Response Example

```
Found 3 assets:
a1b2c3d4: Win10-Workstation1 (Windows - Windows 10 Pro)
e5f6g7h8: Ubuntu-Server1 (Linux - Ubuntu 20.04)
i9j0k1l2: MacBook-Pro (macOS - macOS 12.3)
```

```
Asset details:
Asset: Endpoint - 2 (bc906dea-f92d-46b3-87f2-a2fc36667f70)
OS: Ubuntu
Platform: windows
IP Address: 127.0.0.1
Group: Computers (e5a82e99-868b-4ae5-85f3-06f05b260824)
Type: Workstation
Management: Managed
Last Seen: 5/22/2022, 6:38:38 PM
Version: 2.9.0 (2009000)
Registered: 5/22/2022, 6:38:38 PM
Created: 5/22/2022, 6:38:38 PM
Updated: 5/22/2022, 6:38:38 PM
Organization ID: 0
Online Status: offline
Isolation Status: unisolated
Tags: None
Issues: None
Waiting For Version Update Fix: No
Policies: None
```

Successfully assigned 1 acquisition task(s):
3c801542-d58e-4237-84b9-37651b455a38: Example Case Acquisition 003 (Organization: 0)

Successfully assigned 1 image acquisition task(s):
3c801542-d58e-4237-84b9-37651b455a38: Acquire Image 001 (Organization: 0)

Successfully created acquisition profile: My Custom Profile

Successfully assigned 1 reboot task(s):
8fe018d3-83de-4a6d-b7f4-bc97ed3b3156: Reboot 002 (Organization: 0)

Successfully assigned 1 shutdown task(s):
a5f2ee9d-066e-47dd-a436-ba27808d76fb: Shutdown 004 (Organization: 0)

Successfully assigned 1 isolation task(s):
26aeb2db-9fd0-467c-a3ba-b74c675ef0c8: Isolation 003 (Organization: 0)

Successfully assigned 1 log retrieval task(s):
517ac6b7-92f1-4401-8f75-79931d73c2c1: Log Retrieval 002 (Organization: 0)

Successfully assigned 1 version update task(s):
cbed8ab3-24d1-4697-8552-6ff6a6c1fae6: Version Update 002 (Organization: 0)
```

```
Found 3 tasks for asset with ID bc906dea-f92d-46b3-87f2-a2fc36667f70:
1e18c426-b00a-44d1-9102-faa80b594fd0: Example Case Acquisition 002 (Type: acquisition, Status: assigned, Progress: 0%)
dfbcdd26-6c74-4de4-8704-bf5d48b90722: Example Case Acquisition 001 (Type: acquisition, Status: assigned, Progress: 0%)
45f5bfeb-e503-4123-80f0-422229b1b097: Auto Tagging 003 (Type: auto-tagging, Status: assigned, Progress: 0%)