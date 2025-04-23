/**
 * Assets API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving asset information. It defines the data structures for assets and
 * provides methods to fetch assets from the API.
 * 
 * The module includes:
 * - Asset interface: Represents a single endpoint/device in the system
 * - AssetsResponse interface: Represents the API response structure
 * - AssetResponse interface: Represents the single asset API response structure
 * - AssetTask interface: Represents a task associated with an asset
 * - AssetTasksResponse interface: Represents the asset tasks API response structure
 * - api object: Contains methods to interact with the Assets API endpoints
 * 
 * Reference: https://docs.binalyze.com/#728bbaed-0c3e-482e-9756-9f4816e36ba8
 */

import axios from 'axios';
import { config } from '../../config';

export interface Asset {
  _id: string;
  name: string;
  os: string;
  platform: string;
  systemResources: {
    cpu: {
      model: string;
      usage: number;
    };
    ram: {
      freeSpace: number;
      totalSize: number;
    };
    disks: Array<{
      path: string;
      type: string;
      freeSpace: number;
      totalSize: number;
    }>;
  };
  onlineStatus: string;
  issues: string[];
}

export interface AssetDetail {
  _id: string;
  name: string;
  os: string;
  platform: string;
  ipAddress: string;
  groupId: string;
  groupFullPath: string;
  isServer: boolean;
  isManaged: boolean;
  lastSeen: string;
  version: string;
  versionNo: number;
  registeredAt: string;
  createdAt: string;
  updatedAt: string;
  organizationId: number;
  securityToken: string;
  onlineStatus: string;
  issues: string[];
  isolationStatus: string;
  tags: string[];
  label: string | null;
  waitingForVersionUpdateFix: boolean;
  policies: any[];
}

export interface AssetsResponse {
  success: boolean;
  result: {
    entities: Asset[];
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
    totalPageCount: number;
  };
  statusCode: number;
  errors: string[];
}

export interface AssetResponse {
  success: boolean;
  result: AssetDetail;
  statusCode: number;
  errors: string[];
}

export interface AssetTask {
  _id: string;
  taskId: string;
  name: string;
  type: string;
  endpointId: string;
  endpointName: string;
  organizationId: number;
  status: string;
  recurrence: string | null;
  progress: number;
  duration: number | null;
  caseIds: string[] | null;
  createdAt: string;
  updatedAt: string;
  response: any | null;
}

export interface AssetTasksResponse {
  success: boolean;
  result: {
    entities: AssetTask[];
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

// Structure for the filter used in uninstalling assets
export interface AssetFilter {
  searchTerm?: string;
  name?: string;
  ipAddress?: string;
  groupId?: string;
  groupFullPath?: string;
  managedStatus?: string[];
  isolationStatus?: string[];
  platform?: string[];
  issue?: string;
  onlineStatus?: string[];
  tagId?: string;
  version?: string;
  policy?: string;
  includedEndpointIds?: string[];
  excludedEndpointIds?: string[];
  organizationIds?: (number | string)[];
}

// Structure for the uninstall operation
export interface UninstallAssetsResponse {
  success: boolean;
  result: null; // Result is typically null for DELETE operations
  statusCode: number;
  errors: string[];
}

// Structure for the response when modifying tags (add/remove)
export interface ModifyTagsResponse {
  success: boolean;
  result: null; // Result is typically null for tag operations
  statusCode: number;
  errors: string[];
}

export const api = {
  async getAssets(organizationIds: string | string[] = '0'): Promise<AssetsResponse> {
    try {
      const orgIds = Array.isArray(organizationIds) ? organizationIds.join(',') : organizationIds;
      const response = await axios.get(
        `${config.airHost}/api/public/assets`,
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
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  async getAssetById(id: string): Promise<AssetResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/assets/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching asset with ID ${id}:`, error);
      throw error;
    }
  },

  async getAssetTasksById(id: string): Promise<AssetTasksResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/assets/${id}/tasks`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for asset with ID ${id}:`, error);
      throw error;
    }
  },

  async uninstallAssetsByFilter(filter: AssetFilter): Promise<UninstallAssetsResponse> {
    try {
      const response = await axios.delete(
        `${config.airHost}/api/public/assets/uninstall-without-purge`,
        {
          data: { filter }, // Send filter object within a data key
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uninstalling assets:', error);
      // Attempt to return a standardized error format if possible
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as UninstallAssetsResponse; // Assuming error response follows the same structure
      }
      throw error; // Re-throw if it's not an Axios error or has no response
    }
  },

  // New function for purge and uninstall
  async purgeAndUninstallAssetsByFilter(filter: AssetFilter): Promise<UninstallAssetsResponse> { // Reusing UninstallAssetsResponse as structure is likely identical
    try {
      const response = await axios.delete(
        `${config.airHost}/api/public/assets/purge-and-uninstall`,
        {
          data: { filter },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error purging and uninstalling assets:', error);
      if (axios.isAxiosError(error) && error.response) {
        // Assuming the error response structure is the same as UninstallAssetsResponse
        return error.response.data as UninstallAssetsResponse; 
      }
      throw error;
    }
  },

  // New function to add tags to assets by filter
  async addTagsToAssetsByFilter(filter: AssetFilter, tags: string[]): Promise<ModifyTagsResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/assets/tags`,
        { filter, tags }, // Send filter and tags in the request body
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding tags to assets:', error);
      if (axios.isAxiosError(error) && error.response) {
        // Assuming the error response structure is the same as ModifyTagsResponse
        return error.response.data as ModifyTagsResponse; 
      }
      throw error;
    }
  },

  // New function to remove tags from assets by filter
  async removeTagsFromAssetsByFilter(filter: AssetFilter, tags: string[]): Promise<ModifyTagsResponse> {
    try {
      const response = await axios.delete(
        `${config.airHost}/api/public/assets/tags`,
        {
          data: { filter, tags }, // Send filter and tags in the request body
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error removing tags from assets:', error);
      if (axios.isAxiosError(error) && error.response) {
        // Assuming the error response structure is the same as ModifyTagsResponse
        return error.response.data as ModifyTagsResponse;
      }
      throw error;
    }
  },
};