import { z } from 'zod';
import { api, AuditLog } from '../api/audit/audit';

// Schema for export audit logs arguments
export const ExportAuditLogsArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter audit logs by before exporting. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
});

// Schema for list audit logs arguments
export const ListAuditLogsArgsSchema = z.object({
  organizationIds: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().describe('Organization IDs to filter audit logs by. Defaults to "0" or specific IDs like "123" or ["123", "456"]'),
});

// Format audit log for display
function formatAuditLog(log: AuditLog): string {
  return `${new Date(log.timestamp).toISOString()} | User: ${log.userId} | Action: ${log.action} | Entity: ${log.entity} (${log.entityId}) | Org: ${log.organizationId} | Details: ${JSON.stringify(log.details)}`;
}

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

  // List Audit Logs
  async listAuditLogs(args: z.infer<typeof ListAuditLogsArgsSchema>) {
    try {
      const orgIds = args.organizationIds === undefined || args.organizationIds === "" 
        ? "0" 
        : args.organizationIds;
      
      const response = await api.getAuditLogs(orgIds);

      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching audit logs: ${response.errors.join(', ')}`
            }
          ]
        };
      }

      if (response.result.entities.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No audit logs found matching the criteria.'
            }
          ]
        };
      }
      
      const logList = response.result.entities.map(formatAuditLog).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${response.result.totalEntityCount} audit logs:\n${logList}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fetch audit logs: ${errorMessage}`
          }
        ]
      };
    }
  },
};
