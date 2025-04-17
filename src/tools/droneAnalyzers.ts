import { z } from 'zod';
import { api, DroneAnalyzer } from '../api/drone/analyzers';

// Schema for list drone analyzers arguments - no specific arguments needed
export const ListDroneAnalyzersArgsSchema = z.object({
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