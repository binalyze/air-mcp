/**
 * Organizations API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving organization information.
 * 
 * The module includes:
 * - Organization interface: Represents a single organization in the system
 * - OrganizationsResponse interface: Represents the API response structure
 * - api object: Contains methods to interact with the Organizations API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface Organization {
  _id: number;
  name: string;
  totalEndpoints: number;
  owner?: string;
  shareableDeploymentEnabled: boolean;
  deploymentToken: string;
  isDefault: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface OrganizationsResponse {
  success: boolean;
  result: {
    entities: Organization[];
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
  async getOrganizations(): Promise<OrganizationsResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/organizations`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  },
};
