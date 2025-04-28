/**
 * Tasks API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving tasks information.
 * 
 * The module includes:
 * - Task interface: Represents a single task in the system
 * - TasksResponse interface: Represents the API response structure
 * - api object: Contains methods to interact with the Tasks API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface Task {
  _id: string;
  source: string;
  totalAssignedEndpoints: number;
  totalCompletedEndpoints: number;
  totalFailedEndpoints: number;
  totalCancelledEndpoints: number;
  isScheduled: boolean;
  name: string;
  type: string;
  organizationId: number;
  status: string;
  createdBy: string;
  baseTaskId: string | null;
  startDate: string | null;
  recurrence: string | null;
  createdAt: string;
  updatedAt: string;
  data?: {
    profileId?: string;
    profileName?: string;
    windows?: {
      evidenceTypes?: string[];
      custom?: any[];
      networkCapture?: {
        enabled: boolean;
        duration: number;
        pcap?: {
          enabled: boolean;
        };
        networkFlow?: {
          enabled: boolean;
        };
      };
    };
    linux?: {
      evidenceTypes?: string[];
      custom?: any[];
    };
    config?: {
      choice?: string;
      saveTo?: {
        windows?: {
          location: string;
          path: string;
          useMostFreeVolume: boolean;
          volume: string;
          tmp: string;
        };
        linux?: {
          location: string;
          path: string;
          useMostFreeVolume: boolean;
          volume: string;
          tmp: string;
        };
      };
      cpu?: {
        limit: number;
      };
      compression?: {
        enabled: boolean;
        encryption?: {
          enabled: boolean;
          password: string;
        };
      };
    };
    drone?: {
      minScore: number;
      autoPilot: boolean;
      enabled: boolean;
      analyzers: string[];
      keywords: string[];
    };
  };
}

export interface TasksResponse {
  success: boolean;
  result: {
    entities: Task[];
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

export interface TaskResponse {
  success: boolean;
  result: Task;
  statusCode: number;
  errors: string[];
}

export interface CancelTaskResponse {
  success: boolean;
  result: null;
  statusCode: number;
  errors: string[];
}

export interface DeleteTaskResponse {
  success: boolean;
  result: null;
  statusCode: number;
  errors: string[];
}

export const api = {
  async getTasks(organizationIds: string | string[] = '0'): Promise<TasksResponse> {
    try {
      const orgIds = Array.isArray(organizationIds) ? organizationIds.join(',') : organizationIds;
      const response = await axios.get(
        `${config.airHost}/api/public/tasks`,
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
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  async getTaskById(id: string): Promise<TaskResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/tasks/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async cancelTaskById(id: string): Promise<CancelTaskResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/tasks/${id}/cancel`,
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
      console.error(`Error cancelling task with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteTaskById(id: string): Promise<DeleteTaskResponse> {
    try {
      const response = await axios.delete(
        `${config.airHost}/api/public/tasks/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      throw error;
    }
  },
};
