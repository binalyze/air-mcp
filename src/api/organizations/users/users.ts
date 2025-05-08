import axios from 'axios';
import { config } from '../../../config';

export interface UserProfile {
  name: string;
  surname: string;
  department: string;
}

export interface UserRole {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  createdBy: string;
  tag: string;
  privilegeTypes: string[];
}

export interface User {
  _id: string;
  email: string;
  username: string;
  organizationIds: string;
  strategy: string;
  profile: UserProfile;
  tfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
}

export interface OrganizationUsersResponse {
  success: boolean;
  result: {
    entities: User[];
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
  async getOrganizationUsers(organizationId: number | string): Promise<OrganizationUsersResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/organizations/${organizationId}/users`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for organization ${organizationId}:`, error);
      throw error;
    }
  },
  async assignUsersToOrganization(organizationId: number | string, userIds: string[]): Promise<{
    success: boolean;
    result: null;
    statusCode: number;
    errors: string[];
  }> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/organizations/${organizationId}/assign-users`,
        { userIds },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error assigning users to organization ${organizationId}:`, error);
      throw error;
    }
  },
  async removeUserFromOrganization(organizationId: number | string, userId: string): Promise<{
    success: boolean;
    result: null;
    statusCode: number;
    errors: string[];
  }> {
    try {
      const response = await axios.delete(
        `${config.airHost}/api/public/organizations/${organizationId}/remove-user/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error removing user ${userId} from organization ${organizationId}:`, error);
      throw error;
    }
  }
};