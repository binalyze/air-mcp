import axios from 'axios';
import { config } from '../../config';

// Response type for the evidence case PPC download endpoint
export interface EvidenceCasePpcResponse {
  success: boolean;
  errors?: string[];
  statusCode: number;
  result: any;
}

// API client for evidence-related operations
export const api = {
  // Download PPC file for a specific endpoint and task
  async downloadCasePpc(endpointId: string, taskId: string): Promise<EvidenceCasePpcResponse> {
    try {
      const url = `http://${config.airHost}/api/public/evidence/case/ppc/${endpointId}/${taskId}`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.airApiToken}`
        },
        responseType: 'json'
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as EvidenceCasePpcResponse;
      }
      
      // If we don't have a structured error response, create one
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        statusCode: 500,
        result: null
      };
    }
  },
  // Download task report for a specific endpoint and task
  async downloadTaskReport(endpointId: string, taskId: string): Promise<EvidenceCasePpcResponse> {
    try {
      const url = `http://${config.airHost}/api/public/evidence/case/report/${endpointId}/${taskId}`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.airApiToken}`
        },
        responseType: 'json'
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as EvidenceCasePpcResponse;
      }
      
      // If we don't have a structured error response, create one
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        statusCode: 500,
        result: null
      };
    }
  },
  async getReportFileInfo(endpointId: string, taskId: string): Promise<EvidenceCasePpcResponse> {
    try {
      const url = `http://${config.airHost}/api/public/evidence/case/report-file-info/${endpointId}/${taskId}`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.airApiToken}`
        },
        responseType: 'json'
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as EvidenceCasePpcResponse;
      }
      
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        statusCode: 500,
        result: null
      };
    }
  }
}
