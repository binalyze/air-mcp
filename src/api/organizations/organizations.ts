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
  tags?: string[];
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

export interface OrganizationContact {
  name: string;
  title?: string;
  phone?: string;
  mobile?: string;
  email: string;
}

// Interface for create organization request
export interface CreateOrganizationRequest {
  name: string;
  shareableDeploymentEnabled: boolean;
  contact: OrganizationContact;
  note?: string;
}

export const api = {
  async getOrganizations(): Promise<OrganizationsResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/organizations`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  },
  async createOrganization(data: CreateOrganizationRequest): Promise<{ success: boolean; result: Organization; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/organizations`,
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
      console.error('Error creating organization:', error);
      throw error;
    }
  },
  async updateOrganization(id: number, data: Partial<CreateOrganizationRequest>): Promise<{ success: boolean; result: Organization; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.patch(
        `${config.airHost}/api/public/organizations/${id}`,
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
      console.error('Error updating organization:', error);
      throw error;
    }
  },
  async getOrganizationById(id: number): Promise<{ success: boolean; result: Organization & { note?: string; contact?: OrganizationContact; statistics?: { endpoint: { total: number; managed: number }; case: { total: number; open: number; closed: number; archived: number } } }; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/organizations/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching organization with ID ${id}:`, error);
      throw error;
    }
  },
  async checkOrganizationNameExists(name: string): Promise<{ success: boolean; result: boolean; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/organizations/check`,
        {
          params: { name },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking organization name:', error);
      throw error;
    }
  },
  async getShareableDeploymentInfo(deploymentToken: string): Promise<{ 
    success: boolean; 
    result: { 
      organizationId: number; 
      consoleAddress: string; 
      agentVersion: string; 
    }; 
    statusCode: number; 
    errors: string[] 
  }> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/organizations/shareable-deployment-info/${deploymentToken}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching shareable deployment info:', error);
      throw error;
    }
  },
  async updateOrganizationShareableDeployment(id: number, status: boolean): Promise<{ success: boolean; result: null; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/organizations/${id}/shareable-deployment`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating organization ${id} shareable deployment:`, error);
      throw error;
    }
  },
  async updateOrganizationDeploymentToken(id: number, deploymentToken: string): Promise<{ success: boolean; result: null; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/organizations/${id}/deployment-token`,
        { deploymentToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating organization ${id} deployment token:`, error);
      throw error;
    }
  },
  async deleteOrganization(id: number): Promise<{ success: boolean; result: null; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.delete(
        `${config.airHost}/api/public/organizations/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting organization with ID ${id}:`, error);
      throw error;
    }
  },
  async addTagsToOrganization(id: number, tags: string[]): Promise<{ success: boolean; result: Organization; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.patch(
        `${config.airHost}/api/public/organizations/${id}/tags`,
        { tags },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding tags to organization with ID ${id}:`, error);
      throw error;
    }
  },
  async deleteTagsFromOrganization(id: number, tags: string[]): Promise<{ success: boolean; result: Organization; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.delete(
        `${config.airHost}/api/public/organizations/${id}/tags`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          },
          data: { tags }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting tags from organization with ID ${id}:`, error);
      throw error;
    }
  }
};
