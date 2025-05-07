/**
 * Triage Tags API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving triage rule tags.
 */

import axios from 'axios';
import { config } from '../../../config';

export interface TriageTag {
  _id: string;
  name: string;
  count?: number;
}

export interface TriageTagsResponse {
  success: boolean;
  result: {
    entities: TriageTag[];
    totalEntityCount: number;
  };
  statusCode: number;
  errors: string[];
}

export const api = {
  async getTriageTags(
    organizationId: string | string[] = '0', 
    withCount: boolean = true
  ): Promise<TriageTagsResponse> {
    try {
      const orgId = Array.isArray(organizationId) ? organizationId.join(',') : organizationId;
      
      const response = await axios.get(
        `${config.airHost}/api/public/triages/tags`,
        {
          params: {
            'filter[organizationId]': orgId,
            'filter[withCount]': withCount
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching triage tags:', error);
      throw error;
    }
  }
};
