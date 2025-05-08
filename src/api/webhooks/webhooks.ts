/**
 * Webhooks API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving webhook information.
 * 
 * The module includes:
 * - WebhookResponse interface: Represents the API response structure
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
  }
};