/**
 * Policies API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving policies information.
 * 
 * The module includes:
 * - Policy interface: Represents a single policy in the system
 * - PoliciesResponse interface: Represents the API response structure
 * - api object: Contains methods to interact with the Policies API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface Policy {
  _id: string;
  name: string;
  organizationIds: string[];
  default: boolean;
  order: number;
  cpu: {
    limit: number;
  };
  saveTo: {
    windows: {
      location: string;
      path: string;
      useMostFreeVolume: boolean;
      volume: string;
    };
    linux: {
      location: string;
      path: string;
      useMostFreeVolume: boolean;
      volume: string;
    };
    macos: {
      useMostFreeVolume: boolean;
      location: string;
      path: string;
      volume: string;
      tmp: string;
    };
  };
  sendTo: {
    location: string;
  };
  compression: {
    enabled: boolean;
    encryption: {
      enabled: boolean;
    };
  };
  createdBy: string;
  updatedAt: string;
}

export interface PoliciesResponse {
  success: boolean;
  result: {
    entities: Policy[];
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
  async getPolicies(organizationIds: string | string[] = '0'): Promise<PoliciesResponse> {
    try {
      const orgIds = Array.isArray(organizationIds) ? organizationIds.join(',') : organizationIds;
      const response = await axios.get(
        `${config.airHost}/api/public/policies`,
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
      console.error('Error fetching policies:', error);
      throw error;
    }
  },
};
