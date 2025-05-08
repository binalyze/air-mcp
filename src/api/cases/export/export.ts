/**
 * Cases Export API Module
 * 
 * This module provides functions to interact with the Binalyze AIR API
 * for exporting case information.
 */

import axios from 'axios';
import { config } from '../../../config';

export interface ExportCasesResponse {
  success: boolean;
  statusCode: number;
  errors: string[];
}

export interface ExportCaseNotesResponse {
    success: boolean;
    statusCode: number;
    errors: string[];
}

export interface ExportCaseEndpointsResponse {
    success: boolean;
    statusCode: number;
    errors: string[];
}

export interface ExportCaseActivitiesResponse {
    success: boolean;
    statusCode: number;
    errors: string[];
}

export const exportApi = {
  async exportCases(organizationIds: string | string[] = '0'): Promise<ExportCasesResponse> {
    try {
      const orgIds = Array.isArray(organizationIds) ? organizationIds.join(',') : organizationIds;
      const response = await axios.get(
        `${config.airHost}/api/public/cases/export`,
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
      
      return {
        success: response.status === 200,
        statusCode: response.status,
        errors: []
      };
    } catch (error) {
      console.error('Error exporting cases:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          statusCode: error.response.status,
          errors: [error.message]
        };
      }
      
      throw error;
    }
  },
  async exportCaseNotes(caseId: string): Promise<ExportCaseNotesResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/cases/${caseId}/notes/export`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      
      return {
        success: response.status === 200,
        statusCode: response.status,
        errors: []
      };
    } catch (error) {
      console.error('Error exporting case notes:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          statusCode: error.response.status,
          errors: [error.message]
        };
      }
      
      throw error;
    }
  },
  async exportCaseEndpoints(caseId: string, organizationIds: string | string[] = '0'): Promise<ExportCaseEndpointsResponse> {
    try {
      const orgIds = Array.isArray(organizationIds) ? organizationIds.join(',') : organizationIds;
      const response = await axios.get(
        `${config.airHost}/api/public/cases/${caseId}/endpoints/export`,
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
      
      return {
        success: response.status === 200,
        statusCode: response.status,
        errors: []
      };
    } catch (error) {
      console.error('Error exporting case endpoints:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          statusCode: error.response.status,
          errors: [error.message]
        };
      }
      
      throw error;
    }
  },
  async exportCaseActivities(caseId: string): Promise<ExportCaseActivitiesResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/cases/${caseId}/activities/export`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      
      return {
        success: response.status === 200,
        statusCode: response.status,
        errors: []
      };
    } catch (error) {
      console.error('Error exporting case activities:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          statusCode: error.response.status,
          errors: [error.message]
        };
      }
      
      throw error;
    }
  }
};
