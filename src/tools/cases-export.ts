import { z } from 'zod';
import { exportApi } from '../api/cases/export/export';

// Schema for export cases arguments
export const ExportCasesArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter cases by. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
});

export const casesExportTools = {
  // Export cases
  async exportCases(args: z.infer<typeof ExportCasesArgsSchema>) {
    try {
      const orgIds = args.organizationIds === undefined || args.organizationIds === "" 
        ? "0" 
        : args.organizationIds;
      
      const response = await exportApi.exportCases(orgIds);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error exporting cases: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Cases export initiated successfully. Status code: ${response.statusCode}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to export cases: ${errorMessage}`
          }
        ]
      };
    }
  },
};
