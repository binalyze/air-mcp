/**
 * Policies API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving policies information.
 * 
 * The module includes:
 * - Policy interface: Represents a single policy in the system
 * - PoliciesResponse interface: Represents the API response structure
 * - CreatePolicyRequest interface: Represents the request body for creating a policy
 * - UpdatePolicyRequest interface: Represents the request body for updating a policy
 * - api object: Contains methods to interact with the Policies API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface FilterCondition {
  field?: string;
  operator: string;
  value?: string;
  conditions?: Array<FilterCondition>;
  id?: string;
  disabled?: boolean;
  version?: string;
}

export interface Policy {
  _id: string;
  name: string;
  organizationIds: string[];
  default: boolean;
  order: number;
  filter?: {
    operator: string;
    conditions: Array<FilterCondition>;
  };
  cpu: {
    limit: number;
  };
  saveTo: {
    windows: {
      location: string;
      path: string;
      useMostFreeVolume: boolean;
      volume: string;
      tmp?: string;
    };
    linux: {
      location: string;
      path: string;
      useMostFreeVolume: boolean;
      volume: string;
      tmp?: string;
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
      password?: string;
    };
  };
  createdBy: string;
  createdAt?: string;
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

export interface CreatePolicyRequest {
  name: string;
  organizationIds: number[] | string[];
  saveTo: {
    windows: {
      location: string;
      path: string;
      useMostFreeVolume: boolean;
      volume: string;
      tmp?: string;
    };
    linux: {
      location: string;
      path: string;
      useMostFreeVolume: boolean;
      volume: string;
      tmp?: string;
    };
    macos: {
      location: string;
      path: string;
      useMostFreeVolume: boolean;
      volume: string;
      tmp?: string;
    };
  };
  compression: {
    enabled: boolean;
    encryption: {
      enabled: boolean;
      password?: string;
    };
  };
  sendTo: {
    location: string;
  };
  cpu?: {
    limit?: number;
  };
  filter?: {
    operator: string;
    conditions: Array<FilterCondition>;
  };
}

export interface UpdatePolicyRequest extends CreatePolicyRequest {
  // Same structure as CreatePolicyRequest, just a different semantic meaning
}

export interface CreatePolicyResponse {
  success: boolean;
  result: Policy | null;
  statusCode: number;
  errors: string[];
}

export interface UpdatePolicyResponse {
  success: boolean;
  result: Policy | null;
  statusCode: number;
  errors: string[];
}

export interface GetPolicyResponse {
  success: boolean;
  result: Policy | null;
  statusCode: number;
  errors: string[];
}

export interface UpdatePolicyPrioritiesRequest {
  ids: string[];
  organizationIds: number[] | string[];
}

export interface UpdatePolicyPrioritiesResponse {
  success: boolean;
  result: null;
  statusCode: number;
  errors: string[];
}

export interface PolicyMatchStatsRequest {
  name?: string;
  searchTerm?: string;
  ipAddress?: string;
  groupId?: string;
  groupFullPath?: string;
  managedStatus?: string[];
  isolationStatus?: string[];
  platform?: string[];
  issue?: string;
  onlineStatus?: string[];
  tags?: string[];
  version?: string;
  policy?: string;
  includedEndpointIds?: string[];
  excludedEndpointIds?: string[];
  organizationIds?: (number | string)[];
}

export interface PolicyMatchStats {
  _id: string;
  name: string;
  count: number;
}

export interface PolicyMatchStatsResponse {
  success: boolean;
  result: PolicyMatchStats[];
  statusCode: number;
  errors: string[];
}

export interface DeletePolicyResponse {
  success: boolean;
  result: null;
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
  
  async getPolicyById(id: string): Promise<GetPolicyResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/policies/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching policy with ID ${id}:`, error);
      throw error;
    }
  },
  
  async createPolicy(policyData: CreatePolicyRequest): Promise<CreatePolicyResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/policies`,
        policyData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating policy:', error);
      throw error;
    }
  },
  
  async updatePolicy(id: string, policyData: UpdatePolicyRequest): Promise<UpdatePolicyResponse> {
    try {
      const response = await axios.put(
        `${config.airHost}/api/public/policies/${id}`,
        policyData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating policy:', error);
      throw error;
    }
  },
  
  async updatePolicyPriorities(data: UpdatePolicyPrioritiesRequest): Promise<UpdatePolicyPrioritiesResponse> {
    try {
      const response = await axios.put(
        `${config.airHost}/api/public/policies/priorities`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating policy priorities:', error);
      throw error;
    }
  },
  
  async getPolicyMatchStats(filter: PolicyMatchStatsRequest): Promise<PolicyMatchStatsResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/policies/match-stats`,
        filter,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching policy match stats:', error);
      throw error;
    }
  },
  
  async deletePolicyById(id: string): Promise<DeletePolicyResponse> {
    try {
      const response = await axios.delete(
        `${config.airHost}/api/public/policies/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting policy with ID ${id}:`, error);
      throw error;
    }
  },
};
