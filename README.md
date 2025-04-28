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
- **Baseline Acquisition** - Acquire baseline data from specific endpoints to establish a reference point.
- **Compare Baseline** - Compare multiple baseline acquisition tasks for a specific endpoint to identify changes.
- **Get Comparison Report** - Retrieve comparison result report for a specific endpoint and task.
- **Create Acquisition Profiles** - Create new acquisition profiles with specific evidence/artifact/network settings.
- **Acquisition Artifacts** - List available artifacts for evidence collection.
- **Acquisition Evidences** - List available evidence items for forensic data collection.
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
- **Uninstall Assets** - Uninstall specific assets based on filters without purging data.
- **Purge and Uninstall Assets** - Purge data and uninstall specific assets based on filters.
- **Add Tags to Assets** - Add tags to specific assets based on filters.
- **Remove Tags from Assets** - Remove tags from specific assets based on filters.
- **Auto Asset Tagging** - Create and update rules to automatically tag assets based on specific conditions.
- **List Auto Asset Tags** - List all existing auto asset tag rules.
- **Get Auto Asset Tag Details** - Get detailed information about a specific auto asset tag rule by its ID.
- **Delete Auto Asset Tag** - Delete a specific auto asset tag rule by its ID.
- **Start Auto Tagging** - Initiate the auto tagging process for assets that match specific filter criteria.
- **E-Discovery Patterns** - List available e-discovery patterns for detecting different file types.
- **Policy Management** - List, create, update, and delete policies in your organization.
- **Policy Match Statistics** - See which policies apply to your assets based on various criteria.
- **Task Assignments** - View all assignments for a specific task by its ID.

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
| `List all acquisition artifacts` | Shows all available artifacts for evidence collection, organized by platform and category |
| `List all acquisition evidences` | Shows all available evidence items for forensic data collection, organized by platform and category |
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
| `List all policies` | Shows security policies and collection policies |
| `List all tasks` | Lists all tasks with their statuses |
| `List all triage rules` | Shows YARA, OSQuery and Sigma rules for threat detection |
| `List all users` | Shows all users in the system with their details |
| `List all drone analyzers` | Shows available drone analyzers with supported operating systems |
| `Export audit logs` | Initiates the export of audit logs. The export runs in the background on the AIR server. |
| `List audit logs` | Shows audit logs with details like timestamp, user, action, entity |
| `Uninstall asset with ID "endpoint-id"` | Uninstalls the specified asset without purging data (requires providing `filter.includedEndpointIds`) |
| `Purge and uninstall asset with ID "endpoint-id"` | Purges data and uninstalls the specified asset (requires providing `filter.includedEndpointIds`) |
| `Add tags ["tag1", "tag2"] to asset with ID "endpoint-id"` | Adds specified tags to the targeted asset(s) (requires providing `filter.includedEndpointIds` and `tags`) |
| `Remove tags ["tag1"] from asset with ID "endpoint-id"` | Removes specified tags from the targeted asset(s) (requires providing `filter.includedEndpointIds` and `tags`) |
| `Create an auto asset tag named "Web Server"` | Creates a new rule to automatically tag assets based on conditions. |
| `Update auto asset tag "fkkEPhpqMNqJeHfi4RyxiWEm" to have tag name "Updated Container" with linux process "containerd" running` | Updates an existing auto asset tag rule with new conditions. |
| `List all auto asset tag rules` | Lists all existing auto asset tag rules with their configurations. |
| `Get auto asset tag with ID "f6kEPhpqMNqJeHfi4RyxiWEm"` | Shows detailed information about a specific auto asset tag rule. |
| `Delete auto asset tag with ID "f6kEPhpqMNqJeHfi4RyxiWEm"` | Deletes a specific auto asset tag rule by its ID. |
| `Start auto tagging for windows machines` | Initiates the auto tagging process for Windows assets matching specified criteria. |
| `Acquire baseline for case "C-2022-001" from endpoints ["id1", "id2"]` | Acquires baseline data from specified endpoints for a given case ID. |
| `Compare baselines for endpoint "id1" with task IDs ["task1", "task2"]` | Compares multiple baseline acquisition tasks for a specific endpoint to identify changes. |
| `Get comparison report for endpoint "id1" and task "task1"` | Retrieves the comparison result report for a specific endpoint and comparison task. |
| `List all e-discovery patterns` | Shows all available e-discovery patterns for file type detection |
| `Create a policy named "Production Policy" with specific storage settings` | Creates a new policy with custom settings |
| `Update policy with ID "abc123"` | Updates an existing policy with new settings |
| `Get policy details for ID "System"` | Displays detailed information about a specific policy |
| `Update policy priorities to ["policy1", "policy2", "policy3"]` | Updates the order of policy application |
| `Show policy match statistics` | Shows how many endpoints match each policy |
| `Get policy distribution for Windows endpoints` | Shows policy matches filtered by platform |
| `Get policy match stats for offline endpoints` | Shows policy matches for offline assets |
| `Delete policy with ID "abc123"` | Permanently removes a policy from the system |
| `Get all assignments for task with ID "def456"` | Shows all assignments associated with a specific task |

### Viewing Acquisition Artifacts

You can list all available acquisition artifacts for evidence collection:

```
List all acquisition artifacts
Show me all available artifacts for Windows
What artifacts can be collected for evidence?
```

This will display a categorized list of artifacts that can be collected during an acquisition task, organized by platform (Windows, Linux, macOS, etc.) and group categories (Server, Communication, Cloud, etc.).

### Viewing Acquisition Evidences

You can list all available evidence items for forensic data collection:

```
List all acquisition evidences
Show me all available evidences for Windows
What evidences can be collected during an investigation?
```

This will display a categorized list of evidence items that can be collected during a forensic investigation, organized by platform (Windows, Linux, macOS, etc.) and group categories (System, Network, Memory, etc.).

### Viewing E-Discovery Patterns

You can list all available e-discovery patterns for file type detection:

```
List all e-discovery patterns
Show me all file patterns for e-discovery
What file patterns are available for e-discovery?
```

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

### Uninstalling Assets

You can uninstall assets without purging their data using filters. You **must** specify the exact IDs of the assets to uninstall via `filter.includedEndpointIds`.

```
Uninstall asset with ID "0ccbb181-685c-4f1e-982a-6f7c7e88eadd"
Uninstall assets with IDs ["id1", "id2"] for organization 0
```

### Purging and Uninstalling Assets

You can purge asset data and uninstall assets using filters. You **must** specify the exact IDs of the assets to purge and uninstall via `filter.includedEndpointIds`.

```
Purge and uninstall asset with ID "0ccbb181-685c-4f1e-982a-6f7c7e88eadd"
Purge and uninstall assets with IDs ["id1", "id2"] for organization 0
```

### Adding Tags to Assets

You can add tags to specific assets using filters. You **must** specify the exact IDs of the assets to add tags to via `filter.includedEndpointIds` and provide at least one tag in the `tags` array.

```
Add tags ["important", "review-needed"] to asset with ID "0ccbb181-685c-4f1e-982a-6f7c7e88eadd"
Add tag "critical" to assets with IDs ["id1", "id2"] for organization 0
```

### Removing Tags from Assets

You can remove tags from specific assets using filters. You **must** specify the exact IDs of the assets to remove tags from via `filter.includedEndpointIds` and provide at least one tag in the `tags` array.

```
Remove tags ["obsolete"] from asset with ID "0ccbb181-685c-4f1e-982a-6f7c7e88eadd"
Remove tag "needs-review" from assets with IDs ["id1", "id2"] for organization 0
```

### Creating Auto Asset Tag Rules

You can define rules to automatically tag assets based on conditions across different operating systems. Describe the tag name and the conditions for Linux, Windows, and macOS.

```
Create an auto asset tag named "Web Server"
- For Linux: if process "apache2" is running OR process "nginx" is running
- For Windows: if process "httpd.exe" is running OR process "nginx.exe" is running
- For macOS: if process "httpd" is running

Create auto asset tag "Domain Controller" if windows registry key "HKLM\\SYSTEM\\CurrentControlSet\\Services\\NTDS\\Parameters" exists
```

### Getting Auto Asset Tag Details

You can retrieve detailed information about a specific auto asset tag rule by its ID:

```
Get auto asset tag with ID "f6kEPhpqMNqJeHfi4RyxiWEm"
Show me details about the auto asset tag rule "f6kEPhpqMNqJeHfi4RyxiWEm"
Fetch information about auto asset tag "f6kEPhpqMNqJeHfi4RyxiWEm"
```

### Deleting Auto Asset Tag

You can delete an auto asset tag rule by its ID:

```
Delete auto asset tag with ID "f6kEPhpqMNqJeHfi4RyxiWEm"
Remove the auto asset tag rule "f6kEPhpqMNqJeHfi4RyxiWEm"
Delete the auto asset tagging rule "f6kEPhpqMNqJeHfi4RyxiWEm"
```

### Listing Auto Asset Tag Rules

You can list all configured auto asset tag rules to see their IDs, tags, and conditions.

```
List all auto asset tags
Show me the auto asset tag rules
```

### Starting Auto Asset Tagging Process

You can initiate the auto tagging process for assets that match specific filter criteria.

```
Start auto tagging for all Windows assets
Start tagging for managed Windows endpoints
Initiate auto tagging process for assets with platform "linux"
Start auto tagging for endpoints with IDs ["id1", "id2"]
```

### Acquiring Baseline

You can acquire baseline data from specific endpoints by providing a case ID and filter criteria. Baselines establish a reference point for comparison in forensic investigations.

```
Acquire baseline for case "C-2022-001" from endpoints ["0ccbb181-685c-4f1e-982a-6f7c7e88eadd", "7a37cfdb-..."]
Get baseline data for case "C-2023-042" from all Windows endpoints
Acquire baseline for online endpoints with case ID "C-2024-099"
Collect baseline from managed endpoints with IDs ["id1", "id2", "id3"] for case "C-2024-100"
```

### Comparing Baseline Acquisition Tasks

You can compare multiple baseline acquisition tasks for a specific endpoint to identify changes over time or between different system states:

```
Compare baselines for endpoint "0ccbb181-685c-4f1e-982a-6f7c7e88eadd" with task IDs ["task1", "task2"]
Compare baseline tasks ["task-id-1", "task-id-2", "task-id-3"] for endpoint "7a37cfdb-..."
Create baseline comparison between tasks "pre-update-task-id" and "post-update-task-id" for endpoint "bc906dea-..."
```

### Getting Comparison Report

You can retrieve the comparison result report for a specific endpoint and comparison task:

```
Get comparison report for endpoint "0ccbb181-685c-4f1e-982a-6f7c7e88eadd" and task "task1"
Show me the comparison result for endpoint "7a37cfdb-..." and task "comparison-task-id"
Download the baseline comparison report for endpoint "bc906dea-..." task "task-xyz"
```

### Creating Policies

You can create new policies with specific storage, compression, and security settings:

```
Create a policy named "Dev Policy" with:
Windows storage at C:\Binalyze\AIR
Linux storage at /opt/binalyze/air
macOS storage at /opt/binalyze/air
Compression enabled
Encryption enable with password "secure123"
```  

### Viewing Task Assignments

You can check the status of task assignments:

```
Show me all assignments for task abc-123-456
```