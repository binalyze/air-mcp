/**
 * Task Assignments API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving task assignment information.
 * 
 * The module includes:
 * - TaskAssignment interface: Represents a single task assignment in the system
 * - TaskAssignmentsResponse interface: Represents the API response structure
 * - api object: Contains methods to interact with the Task Assignments API endpoints
 */

import axios from 'axios';
import { config } from '../../../config';

export interface TaskAssignment {
  _id: string;
  taskId: string;
  name: string;
  type: string;
  endpointId: string;
  endpointName: string;
  organizationId: number;
  status: string;
  recurrence: null | any;
  progress: number;
  duration: null | number;
  caseIds: string[];
  createdAt: string;
  updatedAt: string;
  response: null | any;
}

export interface CaseOption {
  label: string;
  value: string;
}

export interface TaskAssignmentsResponse {
  success: boolean;
  result: {
    entities: TaskAssignment[];
    filters: Array<{
      name: string;
      type: string;
      options: string[] | CaseOption[];
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

export interface CancelTaskAssignmentResponse {
  success: boolean;
  result: null;
  statusCode: number;
  errors: string[];
}

export interface DeleteTaskAssignmentResponse {
  success: boolean;
  result: null;
  statusCode: number;
  errors: string[];
}

export const api = {
  async getTaskAssignments(taskId: string): Promise<TaskAssignmentsResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/tasks/${taskId}/assignments`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching task assignments:', error);
      throw error;
    }
  },
  
  async cancelTaskAssignment(assignmentId: string): Promise<CancelTaskAssignmentResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/tasks/assignments/${assignmentId}/cancel`,
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
      console.error('Error canceling task assignment:', error);
      throw error;
    }
  },
  
  async deleteTaskAssignment(assignmentId: string): Promise<DeleteTaskAssignmentResponse> {
    try {
      const response = await axios.delete(
        `${config.airHost}/api/public/tasks/assignments/${assignmentId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting task assignment:', error);
      throw error;
    }
  },
};
