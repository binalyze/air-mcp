/**
 * Evidence Repositories API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving evidence repository information.
 * 
 * The module includes:
 * - Repository interface: Represents a single evidence repository in the system
 * - RepositoriesResponse interface: Represents the API response structure
 * - api object: Contains methods to interact with the Repositories API endpoints
 */

import axios from 'axios';
import { config } from '../../../config';

export interface Repository {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  path: string;
  username: string;
  password: string;
  type: string;
  host: string | null;
  port: number | null;
  SASUrl: string | null;
  region: string | null;
  bucket: string | null;
  accessKeyId: string | null;
  secretAccessKey: string | null;
  organizationIds: number[];
  allowSelfSignedSSL: boolean | null;
  publicKey: string | null;
}

export interface RepositoriesResponse {
  success: boolean;
  result: {
    entities: Repository[];
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
  async getRepositories(organizationIds: string = '0'): Promise<RepositoriesResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/evidences/repositories?filter[organizationIds]=${organizationIds}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching evidence repositories:', error);
      throw error;
    }
  },
  async createSmbRepository(data: {
    name: string;
    path: string;
    username: string;
    password: string;
    organizationIds: number[];
  }): Promise<Repository> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/evidences/repositories/smb`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data.result;
    } catch (error) {
      console.error('Error creating SMB repository:', error);
      throw error;
    }
  },
  async updateSmbRepository(id: string, data: {
    name: string;
    path: string;
    username: string;
    password: string;
    organizationIds: number[];
  }): Promise<Repository> {
    try {
      const response = await axios.put(
        `${config.airHost}/api/public/evidences/repositories/smb/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data.result;
    } catch (error) {
      console.error('Error updating SMB repository:', error);
      throw error;
    }
  },
  async createSftpRepository(data: {
    name: string;
    host: string;
    port: number;
    path: string;
    username: string;
    password: string;
    organizationIds: number[];
  }): Promise<Repository> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/evidences/repositories/sftp`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data.result;
    } catch (error) {
      console.error('Error creating SFTP repository:', error);
      throw error;
    }
  }
};