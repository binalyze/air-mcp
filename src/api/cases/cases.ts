/**
 * Cases API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving case information.
 * 
 * The module includes:
 * - Case interface: Represents a single case in the system
 * - CasesResponse interface: Represents the API response structure
 * - api object: Contains methods to interact with the Cases API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface Case {
  _id: string;
  name: string;
  notes: any[];
  createdAt: string;
  updatedAt: string;
  ownerUserId: string;
  organizationId: number;
  status: 'open' | 'closed' | 'archived';
  startedOn: string;
  visibility: string;
  assignedUserIds: string[];
  source: string;
  totalDays: number;
  totalEndpoints: number;
  closedOn?: string;
}

export interface CasesResponse {
  success: boolean;
  result: {
    entities: Case[];
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
  async getCases(organizationIds: string | string[] = '0'): Promise<CasesResponse> {
    try {
      const orgIds = Array.isArray(organizationIds) ? organizationIds.join(',') : organizationIds;
      const response = await axios.get(
        `${config.airHost}/api/public/cases`,
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
      console.error('Error fetching cases:', error);
      throw error;
    }
  },
  async createCase(caseData: {
    organizationId: number;
    name: string;
    ownerUserId: string;
    visibility: string;
    assignedUserIds: string[];
  }): Promise<{ success: boolean; result: Case; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/cases`,
        caseData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating case:', error);
      throw error;
    }
  }
};
