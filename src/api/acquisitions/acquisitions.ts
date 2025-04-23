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

// Interface for Network Capture configuration
export interface NetworkCaptureConfig {
  enabled: boolean;
  duration: number;
  pcap: { enabled: boolean };
  networkFlow: { enabled: boolean };
}

// Interface for eDiscovery Pattern
export interface EDiscoveryPattern {
  pattern: string;
  category: string;
}

// Interface for Acquisition Profile Platform specifics (update)
export interface AcquisitionProfilePlatformDetails {
  evidenceList: string[];
  artifactList?: string[]; 
  customContentProfiles: any[]; 
  networkCapture?: NetworkCaptureConfig; // Updated type
}

export interface AcquisitionProfileDetails {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  organizationIds: string[];
  deletable: boolean;
  windows?: AcquisitionProfilePlatformDetails;
  linux?: AcquisitionProfilePlatformDetails;
  macos?: AcquisitionProfilePlatformDetails; 
  aix?: AcquisitionProfilePlatformDetails; 
  eDiscovery?: { 
    patterns: any[]; 
  };
}

// Interface for the response of getting a single acquisition profile by ID
export interface AcquisitionProfileDetailsResponse {
  success: boolean;
  result: AcquisitionProfileDetails;
  statusCode: number;
  errors: string[];
}

// Interface for endpoint and volume configuration for disk image acquisition
export interface EndpointVolumeConfig {
  endpointId: string;
  volumes: string[];
}

// Interface for disk image options
export interface DiskImageOptions {
  chunkSize: number;
  chunkCount: number;
  startOffset: number;
  endpoints: EndpointVolumeConfig[];
}

// Interface for the image acquisition task request
export interface ImageAcquisitionTaskRequest {
  caseId: string | null;
  taskConfig: TaskConfig; // Reusing existing TaskConfig, assuming structure is similar enough or adaptable
  diskImageOptions: DiskImageOptions;
  filter: FilterConfig; // Reusing existing FilterConfig
}

// Interface for the image acquisition task response (structure matches AcquisitionTaskResponse)
export type ImageAcquisitionTaskResponse = AcquisitionTaskResponse;

// Interface for the request body of creating an acquisition profile
export interface CreateAcquisitionProfileRequest {
  name: string;
  organizationIds: string[];
  windows?: AcquisitionProfilePlatformDetails;
  linux?: AcquisitionProfilePlatformDetails;
  macos?: AcquisitionProfilePlatformDetails;
  aix?: Omit<AcquisitionProfilePlatformDetails, 'networkCapture'>; // AIX doesn't have networkCapture
  eDiscovery?: {
    patterns: EDiscoveryPattern[];
  };
}

// Interface for the response of creating an acquisition profile
export interface CreateAcquisitionProfileResponse {
  success: boolean;
  result: null; // Typically null on successful creation
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

  // Get Acquisition Profile by ID
  async getAcquisitionProfileById(profileId: string): Promise<AcquisitionProfileDetailsResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/acquisitions/profiles/${profileId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching acquisition profile with ID ${profileId}:`, error);
      throw error;
    }
  },

  // Assigning evidence acquisition task by filter
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

  // Assigning image acquisition task by filter
  async assignImageAcquisitionTask(request: ImageAcquisitionTaskRequest): Promise<ImageAcquisitionTaskResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/acquisitions/acquire/image`,
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
      console.error('Error assigning image acquisition task:', error);
      throw error;
    }
  },

  // Create Acquisition Profile
  async createAcquisitionProfile(request: CreateAcquisitionProfileRequest): Promise<CreateAcquisitionProfileResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/acquisitions/profiles`,
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
      console.error('Error creating acquisition profile:', error);
      // Attempt to return a structured error if possible
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as CreateAcquisitionProfileResponse; // Assume error response matches structure
      }
      throw error; // Rethrow if it's not an Axios error or doesn't have response data
    }
  },
};
