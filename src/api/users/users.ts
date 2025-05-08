/**
 * Users API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving user information.
 * 
 * The module includes:
 * - User interface: Represents a single user in the system
 * - UsersResponse interface: Represents the API response structure
 * - api object: Contains methods to interact with the Users API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface User {
  _id: string;
  email: string;
  username: string;
  organizationIds: string | 'ALL';
  strategy: string;
  profile: {
    name: string;
    surname: string;
    department: string;
  };
  tfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  success: boolean;
  result: User;
  statusCode: number;
  errors: string[];
}

export interface UsersResponse {
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
  async getUsers(organizationIds: string | string[] = '0'): Promise<UsersResponse> {
    try {
      const orgIds = Array.isArray(organizationIds) ? organizationIds.join(',') : organizationIds;
      const response = await axios.get(
        `${config.airHost}/api/public/user-management/users`,
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
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  async getUserById(id: string): Promise<UserResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/user-management/users/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  }
}; 