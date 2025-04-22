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

// Interface for the save location configuration
export interface SaveLocationConfig {
  location: string;
  useMostFreeVolume: boolean;
  repositoryId: string | null;
  path: string;
  volume?: string;
  tmp: string;
  directCollection: boolean;
}

// Interface for the task configuration
export interface TaskConfig {
  choice: string;
  saveTo: {
    windows: SaveLocationConfig;
    linux: SaveLocationConfig;
    macos: SaveLocationConfig;
    aix: SaveLocationConfig;
  };
  cpu: {
    limit: number;
  };
  compression: {
    enabled: boolean;
    encryption: {
      enabled: boolean;
      password: string;
    };
  };
}

// Interface for the drone configuration
export interface DroneConfig {
  autoPilot: boolean;
  enabled: boolean;
  analyzers: string[];
  keywords: string[];
}

// Interface for the filter configuration
export interface FilterConfig {
  searchTerm: string;
  name: string;
  ipAddress: string;
  groupId: string;
  groupFullPath: string;
  managedStatus: string[];
  isolationStatus: string[];
  platform: string[];
  issue: string;
  onlineStatus: string[];
  tags: string[];
  version: string;
  policy: string;
  includedEndpointIds: string[];
  excludedEndpointIds: string[];
  organizationIds: number[];
}

// Interface for the acquisition task request
export interface AcquisitionTaskRequest {
  caseId: string;
  droneConfig: DroneConfig;
  taskConfig: TaskConfig;
  acquisitionProfileId: string;
  filter: FilterConfig;
}

// Interface for the acquisition task response
export interface AcquisitionTaskResponse {
  success: boolean;
  result: Array<{
    _id: string;
    name: string;
    organizationId: number;
  }>;
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
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching acquisition profiles:', error);
      throw error;
    }
  },

  // New method for assigning evidence acquisition task by filter
  async assignAcquisitionTask(request: AcquisitionTaskRequest): Promise<AcquisitionTaskResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/acquisitions/acquire`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error assigning acquisition task:', error);
      throw error;
    }
  },
};
