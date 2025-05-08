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
- **User Details** - Get detailed information about a specific user by their ID.
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
- **Task Assignment Management** - View and manage task assignments.
- **Triage Rules Management** - List, create, update, and delete triage rules for threat detection.
- **Triage Tags Management** - List and create triage tags for threat detection.
- **Validate Triage Rule** - Validate a triage rule syntax without creating it.
- **Assign Triage Task** - Assign a triage task to endpoints based on filter criteria.
- **Add Note to Case** - Add a note to a specific case by its ID.
- **Update Note in Case** - Update an existing note in a specific case.
- **Delete Note from Case** - Delete a note from a case by its ID.
- **Export Cases** - Export cases data from the system.
- **Export Case Notes** - Export notes for a specific case by its ID.
- **Export Case Endpoints** - Export endpoints for a specific case by its ID.
- **Export Case Activities** - Export activities for a specific case by its ID.
- **Create Case** - Create a new case in the system.
- **Update Case** - Update an existing case by ID.
- **Get Case by ID** - Get detailed information about a specific case by its ID.
- **Close Case by ID** - Close a specific case by its ID.
- **Open Case by ID** - Open a specific case by its ID.
- **Archive Case by ID** - Archive a specific case by its ID.
- **Check Case Name** - Check if a case name is already in use.
- **Get Case Activities** - Get activity history for a specific case by its ID.
- **Get Case Endpoints** - Get all endpoints associated with a specific case by its ID.
- **Get Case Tasks by ID** - Get all tasks associated with a specific case by its ID.
- **Get Case Users** - Get all users associated with a specific case by its ID.
- **Remove Endpoints from Case** - Remove endpoints from a case based on specified filters.
- **Remove Task Assignment from Case** - Remove a specific task assignment from a case.
- **Import Task Assignments to Case** - Import task assignments to a specific case.
- **List Repositories** - List all evidence repositories in the organization.
- **Create SMB Repository** - Create a new SMB evidence repository.
- **Update SMB Repository** - Update an existing SMB evidence repository.
- **Create SFTP Repository** - Create a new SFTP evidence repository.
- **Update SFTP Repository** - Update an existing SFTP evidence repository.
- **Create FTPS Repository** - Create a new FTPS evidence repository.
- **Update FTPS Repository** - Update an existing FTPS evidence repository.
- **Validate FTPS Repository** - Validate FTPS repository configuration without creating it.
- **Create Azure Storage Repository** - Create a new Azure Storage evidence repository.
- **Update Azure Storage Repository** - Update an existing Azure Storage evidence repository.
- **Validate Azure Storage Repository** - Validate Azure Storage repository configuration without creating it.
- **Create Amazon S3 Repository** - Create a new Amazon S3 evidence repository.
- **Update Amazon S3 Repository** - Update an existing Amazon S3 evidence repository.
- **Validate Amazon S3 Repository** - Validate Amazon S3 repository configuration without creating it.
- **Get Repository by ID** - Get detailed information about a specific evidence repository by its ID.
- **Delete Repository** - Delete an evidence repository by its ID.
- **Download Case PPC** - Download a PPC file for a specific endpoint and task.
- **Download Task Report** - Download a task report for a specific endpoint and task.
- **Get Report File Info** - Get information about a PPC file for a specific endpoint and task.
- **Get Organization Users** - Get users for a specific organization by its ID.
- **Assign Users to Organization** - Assign users to a specific organization.
- **Remove User from Organization** - Remove a user from a specific organization.
- **Create Organization** - Create a new organization.
- **Update Organization** - Update an existing organization.
- **Get Organization by ID** - Get detailed information about a specific organization by its ID.
- **Check Organization Name Exists** - Check if an organization name already exists in the system.
- **Get Shareable Deployment Info** - Get information about a shareable deployment using a deployment token.
- **Update Organization Shareable Deployment** - Update an organization's shareable deployment settings.
- **Update Organization Deployment Token** - Update the deployment token for a specific organization.
- **Delete Organization** - Delete an organization by its ID.
- **Add Tags to Organization** - Add tags to an organization.
- **Delete Tags from Organization** - Delete tags from an organization.
- **Call Webhook** - Call a webhook with the specified parameters.
- **Post Webhook** - Post data to a webhook.
- **Get Task Assignments** - Get all assignments for a specific task by its ID.
- **Update Banner Message** - Update the system banner message settings.

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
| `Get user by ID` | Retrieves the details of a specific user by their ID |
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
| `Cancel task assignment with ID "xyz789"` | Cancels a specific task assignment |
| `Delete task assignment with ID "xyz789"` | Permanently removes a task assignment |
| `Get details about task with ID "40a9dc46-d401-4bd1-82d3-ca9cf97c9024"` | Displays detailed information about a specific task including evidence types and configuration |
| `Cancel task with ID "abc123"` | Cancels a running task with the specified ID |
| `Delete task with ID "abc123"` | Permanently deletes a specific task |
| `Create triage rule named "My Rule"` | Creates a new triage rule |
| `List all triage tags` | You can work with triage rules and their associated tags |
| `Create triage tag named "My Tag"` | Creates a new triage tag |
| `Update triage rule with ID "abc123"` | Updates an existing triage rule |
| `Delete triage rule with ID "abc123"` | Permanently removes a triage rule |
| `Get triage rule with ID "abc123"` | Retrieves the details of a specific triage rule |
| `Validate triage rule syntax` | Validates a triage rule syntax without creating it |
| `Assign triage task to endpoints with IDs ["id1", "id2"]` | Assigns a triage task to endpoints based on filter criteria |
| `Add note to case with ID "C-2022-0002"` | Adds a note to a specific case by its ID |
| `Update note with ID "8d9baa16-9aa3-4e4f-a08e-a74341ce2f90" in case "C-2022-0002"` | Updates an existing note in a specific case |
| `Delete note with ID "8d9baa16-9aa3-4e4f-a08e-a74341ce2f90" from case "C-2022-0002"` | Deletes a specific note from a case by its ID |
| `Export cases data` | Initiates an export of cases data for your organization |
| `Export notes for case with ID "case123"` | Initiates an export of notes for a specific case by its ID |
| `Export endpoints for case with ID "case123"` | Initiates an export of endpoints for a specific case by its ID |
| `Export activities for case with ID "case123"` | Initiates an export of activities for a specific case by its ID |
| `Create a new case named "Incident Response"` | Creates a new case in the system |
| `Update case with ID "C-2022-0003" to have name "Updated Case"` | Updates an existing case by ID |
| `Get case with ID "C-2022-0003"` | Retrieves the details of a specific case by its ID |
| `Close case with ID "C-2022-0003"` | Closes a specific case by its ID |
| `Open case with ID "C-2022-0003"` | Opens a specific case by its ID |
| `Archive case with ID "C-2022-0003"` | Archives a specific case by its ID |
| `Change case owner with ID "C-2022-0003" to user with ID "user123"` | Changes the owner of a specific case by its ID |
| `Check if case name "Incident 2023-05" is available` | Checks if a case name is already in use |
| `Get case activities for case with ID "C-2022-0003"` | Displays the activity history for a specific case by its ID |
| `Get endpoints for case with ID "C-2022-0001"` | Retrieves all endpoints associated with a specific case by its ID |
| `Get tasks for case with ID "C-2022-0001"` | Displays all tasks associated with the specified case |
| `Get users for case with ID "C-2022-0001"` | Retrieves all users associated with a specific case by its ID |
| `Remove endpoints from case with ID "C-2022-0001"` | Removes endpoints from a case based on specified filters |
| `Remove task assignment with ID "f04666c9-62c7-4cb0-8638-967f05eb7936" from case "C-2022-0001"` | Removes a specific task assignment from a case |
| `Import task assignments to case with ID "C-2022-0001"` | Imports task assignments to a specific case |
| `List repositories` | Lists all evidence repositories in the organization |
| `Create SMB repository with name "My SMB Repository"` | Creates a new SMB evidence repository with specified credentials |
| `Update SMB repository with ID "abc123"` | Updates an existing SMB repository's configuration |
| `Create SFTP repository with name "My SFTP Repository"` | Creates a new SFTP evidence repository with specified credentials |
| `Update SFTP repository with ID "abc123"` | Updates an existing SFTP repository's configuration |
| `Validate FTPS repository configuration` | Tests if a FTPS repository configuration is valid without creating it |
| `Create Azure Storage repository with name "My Azure Storage Repository"` | Creates a new Azure Storage evidence repository with specified credentials |
| `Update Azure Storage repository with ID "abc123"` | Updates an existing Azure Storage repository's configuration |
| `Validate Azure Storage repository with SAS URL` | Checks if the provided SAS URL is valid for Azure Storage access |
| `Create a new Amazon S3 repository` | Sets up a new S3 bucket as an evidence repository |
| `Update Amazon S3 repository with ID "abc123"` | Modifies an existing S3 repository configuration |
| `Validate Amazon S3 repository configuration` | Checks if S3 credentials and bucket are valid |
| `Get details about repository with ID "abc123"` | Displays detailed information about a specific evidence repository |
| `Delete repository with ID "abc123"` | Deletes a specific evidence repository |
| `Download PPC file for endpoint "ep-1" and task "task-1"` | Downloads a PPC file for the specified endpoint and task |
| `Download task report for endpoint "123" and task "456"` | Downloads a task report for the specified endpoint and task |
| `Get report file information for endpoint "123" and task "456"` | Retrieves information about a PPC file for a specific endpoint and task |
| `Get users for organization with ID "2"` | Displays all users belonging to the specified organization |
| `Assign users with IDs ["user1", "user2"] to organization "123"` | Assigns users to the specified organization |
| `Remove user with ID "user1" from organization "123"` | Removes a user from the specified organization |
| `Create organization with name "My Organization" and contact information` | Creates a new organization with the specified name and contact information |
| `Update organization with ID "123"` | Updates an existing organization with new settings |
| `Get details about organization with ID 2` | Displays detailed information about a specific organization |
| `Check if organization name "My Organization" already exists` | Checks if an organization name is already in use |
| `Get shareable deployment information using deployment token "token123"` | Retrieves information about a shareable deployment using a deployment token |
| `Update organization shareable deployment with ID "123" to be enabled` | Updates an organization's shareable deployment settings |
| `Update deployment token for organization with ID 2` | Updates the deployment token for a specific organization |
| `Delete organization with ID "123"` | Permanently removes an organization from the system |
| `Add tags to organization with ID "123"` | Adds tags to an organization |
| `Delete tags ["tag1", "tag2" ] from organization with ID "123"` | Removes tags from an organization |
| `Call webhook with slug "air-generic-url-webhook" and data "192.168.1.100" and token "token123"` | Calls a webhook with the specified parameters |
| `Post data to webhook with slug "air-generic-url-webhook"` | Sends a POST request to a webhook with provided data |
| `Get task assignments for task with ID "task123"` | Retrieves all assignments for a specific task by its ID |
| `Update banner message` | Updates the system banner message settings |

