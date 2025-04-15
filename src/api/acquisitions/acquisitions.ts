/**
 * Acquisitions API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving acquisition profiles information.
 * 
 * The module includes:
 * - AcquisitionProfile interface: Represents a single acquisition profile in the system
 * - AcquisitionProfilesResponse interface: Represents the API response structure
 * - api object: Contains methods to interact with the Acquisitions API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface AcquisitionProfile {
  _id: string;
  name: string;
  organizationIds: string[];
  createdAt: string;
  createdBy: string;
  deletable: boolean;
}

export interface AcquisitionProfilesResponse {
  success: boolean;
  result: {
    entities: AcquisitionProfile[];
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
  async getAcquisitionProfiles(organizationIds: string | string[] = '0', allOrganizations: boolean = true): Promise<AcquisitionProfilesResponse> {
    try {
      const orgIds = Array.isArray(organizationIds) ? organizationIds.join(',') : organizationIds;
      const response = await axios.get(
        `${config.airHost}/api/public/acquisitions/profiles`,
        {
          params: {
            'filter[organizationIds]': orgIds,
            'filter[allOrganizations]': allOrganizations
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching acquisition profiles:', error);
      throw error;
    }
  },
};
