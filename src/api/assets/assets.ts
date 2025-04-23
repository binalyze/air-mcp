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
};