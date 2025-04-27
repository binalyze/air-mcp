/**
 * Drone Analyzers API Module
 * 
 * This module provides interfaces and functions to interact with the Binalyze AIR API
 * for retrieving drone analyzers information and acquisition artifacts.
 * 
 * The module includes:
 * - DroneAnalyzer interface: Represents a single drone analyzer in the system
 * - AcquisitionArtifact interfaces: Represents artifacts available for acquisition
 * - AcquisitionEvidence interfaces: Represents evidence items available for collection
 * - EDiscoveryPattern interfaces: Represents e-discovery patterns for file types
 * - api object: Contains methods to interact with the API endpoints
 */

import axios from 'axios';
import { config } from '../../config';

export interface DroneAnalyzer {
  Id: string;
  Name: string;
  DefaultEnabled: boolean;
  Platforms: string[];
}

export interface ArtifactItem {
  name: string;
  desc: string;
  type: string;
}

export interface ArtifactGroup {
  group: string;
  items: ArtifactItem[];
}

export interface AcquisitionArtifacts {
  windows: ArtifactGroup[];
  linux: ArtifactGroup[];
  macos?: ArtifactGroup[];
  aix?: ArtifactGroup[];
}

export interface EvidenceItem {
  name: string;
  desc: string;
  type: string;
}

export interface EvidenceGroup {
  group: string;
  items: EvidenceItem[];
}

export interface AcquisitionEvidences {
  windows: EvidenceGroup[];
  linux: EvidenceGroup[];
  macos?: EvidenceGroup[];
  aix?: EvidenceGroup[];
}

export interface EDiscoveryApplication {
  name: string;
  pattern: string;
}

export interface EDiscoveryCategory {
  category: string;
  applications: EDiscoveryApplication[];
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
  
  async getAcquisitionArtifacts(): Promise<AcquisitionArtifacts> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/params/acquisition/artifacts`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching acquisition artifacts:', error);
      throw error;
    }
  },

  async getAcquisitionEvidences(): Promise<AcquisitionEvidences> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/params/acquisition/evidences`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching acquisition evidences:', error);
      throw error;
    }
  },
  
  async getEDiscoveryPatterns(): Promise<EDiscoveryCategory[]> {
    try {
      const response = await axios.get(
        `${config.airHost}/api/public/params/acquisition/e-discovery-patterns`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching e-discovery patterns:', error);
      throw error;
    }
  },
}; 