/**
 * Settings API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for managing system settings.
 * 
 * The module includes:
 * - BannerSettings interface: Represents the banner settings structure
 * - ApiResponse interface: Represents the standard API response structure
 * - api object: Contains methods to interact with the Settings API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface BannerSettings {
  enabled: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  result: T | null;
  statusCode: number;
  errors: string[];
}

export const api = {
  async updateBannerMessage(settings: BannerSettings): Promise<ApiResponse<null>> {
    try {
      const response = await axios.put(
        `${config.airHost}/api/public/settings/banner`,
        settings,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating banner message:', error);
      throw error;
    }
  }
};