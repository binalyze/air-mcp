/**
 * Webhooks API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving webhook information.
 * 
 * The module includes:
 * - WebhookResponse interface: Represents the API response structure
 * - AssignmentResponse interface: Represents the API response structure
 * - api object: Contains methods to interact with the Webhook API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface WebhookResponse {
  taskDetailsViewUrl: string;
  taskDetailsDataUrl: string;
  taskId: string;
  statusCode: number;
}

export interface AssignmentResponse {
  assignmentId: string;
  taskId: string;
  taskName: string;
  endpointId: string;
  endpointName: string;
  organizationId: number;
  assignmentStatus: string;
  progress: number;
  startedAt: string;
  hasDroneData: boolean;
  hasCasePpc: boolean;
  reportStatus: string;
  reportId: string;
  reportUrl: string;
}

export const api = {
  async callWebhook(slug: string, data: string, token: string): Promise<WebhookResponse> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/webhook/${slug}/${data}`,
        {
          params: {
            token
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error calling webhook ${slug}:`, error);
      throw error;
    }
  },
  async postWebhook(slug: string, data: any, token: string): Promise<number> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/webhook/${slug}`,
        data,
        {
          params: {
            token
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.status;
    } catch (error) {
      console.error(`Error posting to webhook ${slug}:`, error);
      throw error;
    }
  },
  async getTaskAssignments(slug: string, token: string, taskId: string): Promise<AssignmentResponse[]> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/webhook/${slug}/assignments`,
        {
          params: {
            token,
            taskId
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error getting task assignments for task ${taskId}:`, error);
      throw error;
    }
  }
};