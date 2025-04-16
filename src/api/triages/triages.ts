/**
 * Triages API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving triage rules information.
 * 
 * The module includes:
 * - TriageRule interface: Represents a single triage rule in the system
 * - TriageRulesResponse interface: Represents the API response structure
 * - api object: Contains methods to interact with the Triage Rules API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface TriageRule {
  _id: string;
  description: string;
  searchIn: string;
  engine: string;
  organizationIds: string[];
  createdAt: string;
  createdBy: string;
  deletable: boolean;
}

export interface TriageRulesResponse {
  success: boolean;
  result: {
    entities: TriageRule[];
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
  async getTriageRules(organizationIds: string | string[] = '0'): Promise<TriageRulesResponse> {
    try {
      const orgIds = Array.isArray(organizationIds) ? organizationIds.join(',') : organizationIds;
      const response = await axios.get(
        `${config.airHost}/api/public/triages/rules`,
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
      console.error('Error fetching triage rules:', error);
      throw error;
    }
  },
}; 