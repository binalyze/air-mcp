/**
 * Baseline API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for acquiring baseline information.
 * 
 * The module includes:
 * - BaselineFilter interface: Represents filter criteria for baseline acquisition
 * - BaselineAcquisitionRequest interface: Represents the request payload
 * - BaselineResponse interface: Represents the API response structure
 * - api object: Contains methods to interact with the Baseline API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface BaselineFilter {
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

export interface BaselineAcquisitionRequest {
  caseId: string;
  filter: BaselineFilter;
}

export interface BaselineComparisonRequest {
  endpointId: string;
  taskIds: string[];
}

export interface BaselineResult {
  _id: string;
  name: string;
  organizationId: number;
}

export interface BaselineResponse {
  success: boolean;
  result: BaselineResult[];
  statusCode: number;
  errors: string[];
}

export const api = {
  async acquireBaseline(request: BaselineAcquisitionRequest): Promise<BaselineResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/baseline/acquire`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error acquiring baseline:', error);
      throw error;
    }
  },
  
  async compareBaseline(request: BaselineComparisonRequest): Promise<BaselineResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/baseline/compare`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error comparing baseline:', error);
      throw error;
    }
  },
  
  async getComparisonReport(endpointId: string, taskId: string): Promise<void> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/baseline/comparison/report/${endpointId}/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${config.airApiToken}`
          },
        }
      );
      
      // The endpoint doesn't return a response body, but we can check the status
      if (response.status === 200) {
        return;
      } else {
        throw new Error(`Failed to get comparison report: ${response.status}`);
      }
    } catch (error) {
      console.error('Error getting comparison report:', error);
      throw error;
    }
  }
};
