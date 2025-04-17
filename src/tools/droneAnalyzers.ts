import { z } from 'zod';
import { api, DroneAnalyzer } from '../api/drone/analyzers';

// Schema for list drone analyzers arguments - no specific arguments needed
export const ListDroneAnalyzersArgsSchema = z.object({
  // Define empty schema as this endpoint doesn't require any parameters
}).optional();

// Format the supported operating systems for display
function formatOSList(osList: string[]): string {
  return osList.map(os => {
    switch(os) {
      case 'windows': return 'Windows';
      case 'linux': return 'Linux';
      case 'darwin': return 'macOS';
      default: return os;
    }
  }).join(', ');
}

export const droneAnalyzerTools = {
  // List all drone analyzers
  async listDroneAnalyzers() {
    try {
      const response = await api.getDroneAnalyzers();
      
      if (!response || response.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No drone analyzers found.'
            }
          ]
        };
      }
      
      const analyzersList = response.map(analyzer => 
        `${analyzer.Id}: ${analyzer.Name} (Supported OS: ${formatOSList(analyzer.OSes)}, Default Enabled: ${analyzer.DefaultEnabled ? 'Yes' : 'No'})`
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