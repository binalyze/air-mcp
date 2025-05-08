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

export interface CreateTriageRuleRequest {
  description: string;
  rule: string;
  searchIn: string;
  engine: string;
  organizationIds: (string | number)[];
}

export interface CreateTriageRuleResponse {
  success: boolean;
  result: TriageRule & {
    rule: string;
    type: string;
  };
  statusCode: number;
  errors: string[];
}

export interface UpdateTriageRuleRequest {
  description: string;
  rule: string;
  searchIn: string;
  organizationIds: (string | number)[];
}

export interface UpdateTriageRuleResponse {
  success: boolean;
  result: TriageRule & {
    rule: string;
    type: string;
  };
  statusCode: number;
  errors: string[];
}

export interface DeleteTriageRuleResponse {
  success: boolean;
  result: null;
  statusCode: number;
  errors: string[];
}

export interface GetTriageRuleResponse {
  success: boolean;
  result: TriageRule & {
    rule: string;
    type: string;
  };
  statusCode: number;
  errors: string[];
}

export interface ValidateTriageRuleRequest {
  rule: string;
}

export interface ValidateTriageRuleResponse {
  success: boolean;
  result: null;
  statusCode: number;
  errors: string[];
}

export interface AssignTriageTaskRequest {
  caseId: string;
  triageRuleIds: string[];
  taskConfig: {
    choice: string;
  };
  mitreAttack: {
    enabled: boolean;
  };
  filter: {
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
    tags?: string[];
    version?: string;
    policy?: string;
    includedEndpointIds?: string[];
    excludedEndpointIds?: string[];
    organizationIds?: (string | number)[];
  };
}

export interface AssignTriageTaskResponse {
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
  async createTriageRule(data: CreateTriageRuleRequest): Promise<CreateTriageRuleResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/triages/rules`,
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
      console.error('Error creating triage rule:', error);
      throw error;
    }
  },
  async updateTriageRule(id: string, data: UpdateTriageRuleRequest): Promise<UpdateTriageRuleResponse> {
    try {
      const response = await axios.put(
        `${config.airHost}/api/public/triages/rules/${id}`,
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
      console.error('Error updating triage rule:', error);
      throw error;
    }
  },
  async deleteTriageRule(id: string): Promise<DeleteTriageRuleResponse> {
    try {
      const response = await axios.delete(
        `${config.airHost}/api/public/triages/rules/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting triage rule:', error);
      throw error;
    }
  },
  async getTriageRuleById(id: string): Promise<GetTriageRuleResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/triages/rules/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching triage rule with ID ${id}:`, error);
      throw error;
    }
  },
  async validateTriageRule(data: ValidateTriageRuleRequest): Promise<ValidateTriageRuleResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/triages/rules/validate`,
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
      console.error('Error validating triage rule:', error);
      throw error;
    }
  },
  async assignTriageTask(data: AssignTriageTaskRequest): Promise<AssignTriageTaskResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/triages/triage`,
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
      console.error('Error assigning triage task:', error);
      throw error;
    }
  }
}; 