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
};
