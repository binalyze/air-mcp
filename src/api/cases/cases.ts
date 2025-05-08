/**
 * Cases API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving case information.
 * 
 * The module includes:
 * - Case interface: Represents a single case in the system
 * - CasesResponse interface: Represents the API response structure
 * - api object: Contains methods to interact with the Cases API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface Case {
  _id: string;
  name: string;
  notes: any[];
  createdAt: string;
  updatedAt: string;
  ownerUserId: string;
  organizationId: number;
  status: 'open' | 'closed' | 'archived';
  startedOn: string;
  visibility: string;
  assignedUserIds: string[];
  source: string;
  totalDays: number;
  totalEndpoints: number;
  closedOn?: string;
}

export interface CasesResponse {
  success: boolean;
  result: {
    entities: Case[];
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

export interface CaseActivity {
  _id: number;
  createdAt: string;
  updatedAt: string;
  type: string;
  performedBy: string;
  data: any;
  organizationIds: number[];
  description: string;
}

export interface CaseActivitiesResponse {
  success: boolean;
  result: {
    entities: CaseActivity[];
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
  async getCases(organizationIds: string | string[] = '0'): Promise<CasesResponse> {
    try {
      const orgIds = Array.isArray(organizationIds) ? organizationIds.join(',') : organizationIds;
      const response = await axios.get(
        `${config.airHost}/api/public/cases`,
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
      console.error('Error fetching cases:', error);
      throw error;
    }
  },
  async createCase(caseData: {
    organizationId: number;
    name: string;
    ownerUserId: string;
    visibility: string;
    assignedUserIds: string[];
  }): Promise<{ success: boolean; result: Case; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/cases`,
        caseData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating case:', error);
      throw error;
    }
  },
  async updateCase(
    id: string, 
    updateData: Partial<{
      name: string;
      ownerUserId: string;
      visibility: string;
      assignedUserIds: string[];
      status: 'open' | 'closed' | 'archived';
      notes: any[];
    }>
  ): Promise<{ success: boolean; result: Case; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.patch(
        `${config.airHost}/api/public/cases/${id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating case:', error);
      throw error;
    }
  },
  async getCase(id: string): Promise<{ success: boolean; result: Case; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/cases/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching case with ID ${id}:`, error);
      throw error;
    }
  },
  async closeCase(id: string): Promise<{ success: boolean; result: Case; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/cases/${id}/close`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error closing case with ID ${id}:`, error);
      throw error;
    }
  },
  async openCase(id: string): Promise<{ success: boolean; result: Case; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/cases/${id}/open`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error opening case with ID ${id}:`, error);
      throw error;
    }
  },
  async archiveCase(id: string): Promise<{ success: boolean; result: Case; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/cases/${id}/archive`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error archiving case with ID ${id}:`, error);
      throw error;
    }
  },
  async changeOwner(id: string, newOwnerId: string): Promise<{ success: boolean; result: Case; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/cases/${id}/change-owner`,
        { newOwnerId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error changing owner for case with ID ${id}:`, error);
      throw error;
    }
  },
  async checkCaseName(name: string): Promise<{ success: boolean; result: boolean; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/cases/check`,
        {
          params: {
            name: name
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking case name:', error);
      throw error;
    }
  },
  async getCaseActivities(id: string): Promise<CaseActivitiesResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/cases/${id}/activities`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching activities for case with ID ${id}:`, error);
      throw error;
    }
  }
};
