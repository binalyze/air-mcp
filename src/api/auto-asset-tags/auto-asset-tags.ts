import axios from 'axios';
import { config } from '../../config';

// Define the structure for a single condition
export interface Condition {
  field: string;
  operator: string; 
  value: string;
  conditionId?: number;
}

// Define the structure for a group of conditions (can be nested)
export interface ConditionGroup {
  operator: 'and' | 'or';
  conditions: (Condition | ConditionGroup)[];
}

// Define the request body for creating an auto asset tag
export interface CreateAutoAssetTagRequest {
  tag: string;
  linuxConditions: ConditionGroup;
  windowsConditions: ConditionGroup;
  macosConditions: ConditionGroup;
}

// Define the request body for updating an auto asset tag
export interface UpdateAutoAssetTagRequest {
  tag: string;
  linuxConditions: ConditionGroup;
  windowsConditions: ConditionGroup;
  macosConditions: ConditionGroup;
}

// Define the structure of the successful result in the response
export interface AutoAssetTagResult {
  _id: string;
  createdAt: string;
  updatedAt: string;
  tag: string;
  conditionIdCounter: number;
  linuxConditions: ConditionGroup; // Note: Response includes conditionId in nested Conditions
  windowsConditions: ConditionGroup; // Note: Response includes conditionId in nested Conditions
  macosConditions: ConditionGroup; // Note: Response includes conditionId in nested Conditions
}

// Define the overall API response structure
export interface CreateAutoAssetTagResponse {
  success: boolean;
  result: AutoAssetTagResult | null;
  statusCode: number;
  errors: string[];
}

// The update response structure is the same as the create response
export interface UpdateAutoAssetTagResponse extends CreateAutoAssetTagResponse {}

export const api = {
  /**
   * Creates a new Auto Asset Tag configuration in Binalyze AIR.
   * @param requestData The configuration for the new auto asset tag.
   * @returns The API response.
   */
  async createAutoAssetTag(requestData: CreateAutoAssetTagRequest): Promise<CreateAutoAssetTagResponse> {
    try {
      const response = await axios.post<CreateAutoAssetTagResponse>(
        `${config.airHost}/api/public/auto-asset-tag`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating auto asset tag:', error);
      if (axios.isAxiosError(error) && error.response) {
        // Return the structured error from AIR if available
        return error.response.data as CreateAutoAssetTagResponse;
      }
      // Fallback for other types of errors
      throw new Error(`Failed to create auto asset tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Updates an existing Auto Asset Tag configuration in Binalyze AIR.
   * @param id The ID of the auto asset tag to update.
   * @param requestData The updated configuration for the auto asset tag.
   * @returns The API response.
   */
  async updateAutoAssetTag(id: string, requestData: UpdateAutoAssetTagRequest): Promise<UpdateAutoAssetTagResponse> {
    try {
      const response = await axios.put<UpdateAutoAssetTagResponse>(
        `${config.airHost}/api/public/auto-asset-tag/${id}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating auto asset tag:', error);
      if (axios.isAxiosError(error) && error.response) {
        // Return the structured error from AIR if available
        return error.response.data as UpdateAutoAssetTagResponse;
      }
      // Fallback for other types of errors
      throw new Error(`Failed to update auto asset tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
