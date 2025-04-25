import { z } from 'zod';
import { api } from '../api/params/params';

// Schema for list drone analyzers arguments - no specific arguments needed
export const ListDroneAnalyzersArgsSchema = z.object({
  // Define empty schema as this endpoint doesn't require any parameters
}).optional();

// Schema for list acquisition artifacts arguments - no specific arguments needed
export const ListAcquisitionArtifactsArgsSchema = z.object({
  // Define empty schema as this endpoint doesn't require any parameters
}).optional();

// Format the supported operating systems for display
function formatOSList(platformList: string[]): string {
  return platformList.map(platform => {
    switch(platform) {
      case 'windows': return 'Windows';
      case 'linux': return 'Linux';
      case 'darwin': return 'macOS';
      case 'gws-parselet': return 'Google Workspace';
      case 'o365-parselet': return 'Microsoft 365';
      default: return platform;
    }
  }).join(', ');
}

export const droneAnalyzerTools = {
  // List all drone analyzers
  async listDroneAnalyzers() {
    try {
      const response = await api.getDroneAnalyzers();
      
      // More robust check: ensure response is an array before mapping
      if (!Array.isArray(response) || response.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: Array.isArray(response) ? 'No drone analyzers found.' : 'Received invalid data format for drone analyzers.'
            }
          ]
        };
      }
      
      const analyzersList = response.map(analyzer => 
        `${analyzer.Id}: ${analyzer.Name} (Supported Platforms: ${formatOSList(analyzer.Platforms)}, Default Enabled: ${analyzer.DefaultEnabled ? 'Yes' : 'No'})`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.length} drone analyzers:\n${analyzersList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch drone analyzers: ${errorMessage}`
          }
        ]
      };
    }
  },
};

export const acquisitionArtifactTools = {
  // List all acquisition artifacts
  async listAcquisitionArtifacts() {
    try {
      const response = await api.getAcquisitionArtifacts();
      
      // Check if the response has the expected structure
      if (!response || typeof response !== 'object') {
        return {
          content: [
            {
              type: 'text',
              text: 'Received invalid data format for acquisition artifacts.'
            }
          ]
        };
      }
      
      // Create formatted output for each OS section
      const resultParts = [];
      
      // Process Windows artifacts
      if (response.windows && Array.isArray(response.windows) && response.windows.length > 0) {
        const windowsGroups = response.windows.map(group => {
          const artifactList = group.items.map(item => 
            `  • ${item.name} (${item.type}): ${item.desc}`
          ).join('\n');
          
          return `### ${group.group}\n${artifactList}`;
        }).join('\n\n');
        
        resultParts.push(`## Windows Artifacts\n${windowsGroups}`);
      }
      
      // Process Linux artifacts
      if (response.linux && Array.isArray(response.linux) && response.linux.length > 0) {
        const linuxGroups = response.linux.map(group => {
          const artifactList = group.items.map(item => 
            `  • ${item.name} (${item.type}): ${item.desc}`
          ).join('\n');
          
          return `### ${group.group}\n${artifactList}`;
        }).join('\n\n');
        
        resultParts.push(`## Linux Artifacts\n${linuxGroups}`);
      }
      
      // Process macOS artifacts if present
      if (response.macos && Array.isArray(response.macos) && response.macos.length > 0) {
        const macosGroups = response.macos.map(group => {
          const artifactList = group.items.map(item => 
            `  • ${item.name} (${item.type}): ${item.desc}`
          ).join('\n');
          
          return `### ${group.group}\n${artifactList}`;
        }).join('\n\n');
        
        resultParts.push(`## macOS Artifacts\n${macosGroups}`);
      }
      
      // Process AIX artifacts if present
      if (response.aix && Array.isArray(response.aix) && response.aix.length > 0) {
        const aixGroups = response.aix.map(group => {
          const artifactList = group.items.map(item => 
            `  • ${item.name} (${item.type}): ${item.desc}`
          ).join('\n');
          
          return `### ${group.group}\n${artifactList}`;
        }).join('\n\n');
        
        resultParts.push(`## AIX Artifacts\n${aixGroups}`);
      }
      
      // If no artifacts were found for any platform
      if (resultParts.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No acquisition artifacts found.'
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `# Acquisition Artifacts\n\n${resultParts.join('\n\n')}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch acquisition artifacts: ${errorMessage}`
          }
        ]
      };
    }
  },
}; 