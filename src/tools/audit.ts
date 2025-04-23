import { z } from 'zod';
import { api } from '../api/audit/audit';

// Schema for export audit logs arguments
export const ExportAuditLogsArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter audit logs by before exporting. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
});

export const auditTools = {
  // Export Audit Logs
  async exportAuditLogs(args: z.infer<typeof ExportAuditLogsArgsSchema>) {
    try {
      const orgIds = args.organizationIds === undefined || args.organizationIds === "" 
        ? "0" 
        : args.organizationIds;
      
      await api.exportAuditLogs(orgIds);
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully initiated audit log export for organization IDs: ${Array.isArray(orgIds) ? orgIds.join(', ') : orgIds}. The export process runs in the background on the AIR server.`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to initiate audit log export: ${errorMessage}`
          }
        ]
      };
    }
  },
};
