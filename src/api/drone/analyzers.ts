/**
 * Drone Analyzers API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving drone analyzers information.
 * 
 * The module includes:
 * - DroneAnalyzer interface: Represents a single drone analyzer in the system
 * - api object: Contains methods to interact with the Drone Analyzers API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface DroneAnalyzer {
  Id: string;
  Name: string;
  DefaultEnabled: boolean;
  OSes: string[];
}

export const api = {
  async getDroneAnalyzers(): Promise<DroneAnalyzer[]> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/params/drone/analyzers`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching drone analyzers:', error);
      throw error;
    }
  },
}; 