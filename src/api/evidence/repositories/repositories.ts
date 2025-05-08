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
  async createAzureStorageRepository(data: {
    name: string;
    SASUrl: string;
    organizationIds: number[];
  }): Promise<Repository> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/evidences/repositories/azure-storage`,
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
      console.error('Error creating Azure Storage repository:', error);
      throw error;
    }
  },
  async updateAzureStorageRepository(id: string, data: {
    name: string;
    SASUrl: string;
    organizationIds: number[];
  }): Promise<Repository> {
    try {
      const response = await axios.put(
        `${config.airHost}/api/public/evidences/repositories/azure-storage/${id}`,
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
      console.error('Error updating Azure Storage repository:', error);
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
  },
  async updateSftpRepository(id: string, data: {
    name: string;
    host: string;
    port: number;
    path: string;
    username: string;
    password: string;
    organizationIds: number[];
  }): Promise<Repository> {
    try {
      const response = await axios.put(
        `${config.airHost}/api/public/evidences/repositories/sftp/${id}`,
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
      console.error('Error updating SFTP repository:', error);
      throw error;
    }
  },
  async createFtpsRepository(data: {
    name: string;
    host: string;
    port: number;
    path: string;
    username: string;
    password: string;
    allowSelfSignedSSL: boolean;
    publicKey: string | null;
    organizationIds: number[];
  }): Promise<Repository> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/evidences/repositories/ftps`,
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
      console.error('Error creating FTPS repository:', error);
      throw error;
    }
  },
  async updateFtpsRepository(id: string, data: {
    name: string;
    host: string;
    port: number;
    path: string;
    username: string;
    password: string;
    allowSelfSignedSSL: boolean;
    publicKey: string | null;
    organizationIds: number[];
  }): Promise<Repository> {
    try {
      const response = await axios.put(
        `${config.airHost}/api/public/evidences/repositories/ftps/${id}`,
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
      console.error('Error updating FTPS repository:', error);
      throw error;
    }
  },
  async validateFtpsRepository(data: {
    name: string;
    host: string;
    port: number;
    path: string;
    username: string;
    password: string;
    allowSelfSignedSSL: boolean;
    publicKey: string | null;
  }): Promise<{ success: boolean; errors: string[]; statusCode: number }> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/evidences/repositories/validate/ftps`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return {
        success: response.data.success,
        errors: response.data.errors,
        statusCode: response.data.statusCode
      };
    } catch (error) {
      console.error('Error validating FTPS repository:', error);
      throw error;
    }
  },
  async validateAzureStorageRepository(data: {
    SASUrl: string;
  }): Promise<{ success: boolean; errors: string[]; statusCode: number }> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/evidences/repositories/validate/azure-storage`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return {
        success: response.data.success,
        errors: response.data.errors,
        statusCode: response.data.statusCode
      };
    } catch (error) {
      console.error('Error validating Azure Storage repository:', error);
      throw error;
    }
  },
  async createAmazonS3Repository(data: {
    name: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    organizationIds: number[];
  }): Promise<Repository> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/evidences/repositories/amazon-s3`,
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
      console.error('Error creating Amazon S3 repository:', error);
      throw error;
    }
  },
  async updateAmazonS3Repository(id: string, data: {
    name: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    organizationIds: number[];
  }): Promise<Repository> {
    try {
      const response = await axios.put(
        `${config.airHost}/api/public/evidences/repositories/amazon-s3/${id}`,
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
      console.error('Error updating Amazon S3 repository:', error);
      throw error;
    }
  },
  async validateAmazonS3Repository(data: {
    name: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    organizationIds: number[];
  }): Promise<{ success: boolean; errors: string[]; statusCode: number }> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/evidences/repositories/validate/amazon-s3`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return {
        success: response.data.success,
        errors: response.data.errors,
        statusCode: response.data.statusCode
      };
    } catch (error) {
      console.error('Error validating Amazon S3 repository:', error);
      throw error;
    }
  },
  async getRepositoryById(id: string): Promise<Repository> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/evidences/repositories/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data.result;
    } catch (error) {
      console.error('Error fetching repository by ID:', error);
      throw error;
    }
  },
  async deleteRepository(id: string): Promise<{ success: boolean; statusCode: number; errors: string[] }> {
    try {
      const response = await axios.delete(
        `${config.airHost}/api/public/evidences/repositories/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return {
        success: response.data.success,
        statusCode: response.data.statusCode,
        errors: response.data.errors
      };
    } catch (error) {
      console.error('Error deleting repository:', error);
      throw error;
    }
  }
};