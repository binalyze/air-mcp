import axios from 'axios';
import { config } from '../../config';
import { validateAirApiToken } from '../../utils/validation';

export interface AuditLog {
  _id: string;
  timestamp: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  organizationId: number;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
}

export interface AuditLogsResponse {
  success: boolean;
  result: {
    entities: AuditLog[];
    filters: Array<{
      name: string;
      type: string;
      options: string[];
      filterUrl: string | null;
    }>;
    sortables: string[];
    totalEntityCount: number;
    currentPage: number;
    pageSize: number;
    previousPage: number;
    totalPageCount: number;
    nextPage: number;
  };
  statusCode: number;
  errors: string[];
}

export const api = {
  async exportAuditLogs(organizationIds: string | string[] = '0'): Promise<void> {
    validateAirApiToken();
    try {
      const orgIds = Array.isArray(organizationIds) ? organizationIds.join(',') : organizationIds;
      const response = await axios.get(
        `${config.airHost}/api/public/audit-logs/export`,
        {
          params: {
            'filter[organizationIds]': orgIds
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );

      // Check for successful status code (e.g., 200 OK or 202 Accepted)
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`API request failed with status code ${response.status}`);
      }
      // No response body expected, resolve on success
      return;
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      throw error;
    }
  },

  async getAuditLogs(organizationIds: string | string[] = '0'): Promise<AuditLogsResponse> {
    validateAirApiToken();
    try {
      const orgIds = Array.isArray(organizationIds) ? organizationIds.join(',') : organizationIds;
      const response = await axios.get<AuditLogsResponse>(
        `${config.airHost}/api/public/audit-logs`,
        {
          params: {
            'filter[organizationIds]': orgIds
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }
};
