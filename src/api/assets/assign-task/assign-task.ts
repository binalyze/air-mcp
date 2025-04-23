/**
 * Assign Task API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for assigning tasks to assets. It defines the data structures for tasks and
 * provides methods to assign various tasks via the API.
 */

import axios from 'axios';
import { config } from '../../../config';

export interface AssetFilter {
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
  organizationIds?: number[];
}

export interface RebootTaskResponse {
  success: boolean;
  result: Array<{
    _id: string;
    name: string;
    organizationId: number;
  }>;
  statusCode: number;
  errors: string[];
}

export interface ShutdownTaskResponse {
  success: boolean;
  result: Array<{
    _id: string;
    name: string;
    organizationId: number;
  }>;
  statusCode: number;
  errors: string[];
}

export interface IsolationTaskResponse {
  success: boolean;
  result: Array<{
    _id: string;
    name: string;
    organizationId: number;
  }>;
  statusCode: number;
  errors: string[];
}

export interface LogRetrievalTaskResponse {
  success: boolean;
  result: Array<{
    _id: string;
    name: string;
    organizationId: number;
  }>;
  statusCode: number;
  errors: string[];
}

export interface VersionUpdateTaskResponse {
  success: boolean;
  result: Array<{
    _id: string;
    name: string;
    organizationId: number;
  }>;
  statusCode: number;
  errors: string[];
}

export const assignTaskApi = {
  /**
   * Assigns a reboot task to endpoints that match the provided filter
   * @param filter Filter criteria to select endpoints for the reboot task
   * @returns Response with the created task details
   */
  async assignRebootTask(filter: AssetFilter): Promise<RebootTaskResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/assets/tasks/reboot`,
        { filter },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error assigning reboot task:', error);
      throw error;
    }
  },

  /**
   * Assigns a shutdown task to endpoints that match the provided filter
   * @param filter Filter criteria to select endpoints for the shutdown task
   * @returns Response with the created task details
   */
  async assignShutdownTask(filter: AssetFilter): Promise<ShutdownTaskResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/assets/tasks/shutdown`,
        { filter },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error assigning shutdown task:', error);
      throw error;
    }
  },

  /**
   * Assigns an isolation task to endpoints that match the provided filter
   * @param enabled Whether to enable or disable isolation
   * @param filter Filter criteria to select endpoints for the isolation task
   * @returns Response with the created task details
   */
  async assignIsolationTask(enabled: boolean, filter: AssetFilter): Promise<IsolationTaskResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/assets/tasks/isolation`,
        { enabled, filter },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error assigning isolation task:', error);
      throw error;
    }
  },

  /**
   * Assigns a log retrieval task to endpoints that match the provided filter
   * @param filter Filter criteria to select endpoints for the log retrieval task
   * @returns Response with the created task details
   */
  async assignLogRetrievalTask(filter: AssetFilter): Promise<LogRetrievalTaskResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/assets/tasks/retrieve-logs`,
        { filter },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error assigning log retrieval task:', error);
      throw error;
    }
  },

  /**
   * Assigns a version update task to endpoints that match the provided filter
   * @param filter Filter criteria to select endpoints for the version update task
   * @returns Response with the created task details
   */
  async assignVersionUpdateTask(filter: AssetFilter): Promise<VersionUpdateTaskResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/assets/tasks/version-update`,
        { filter },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error assigning version update task:', error);
      throw error;
    }
  },
};
