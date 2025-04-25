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

// Define the structure of a single auto asset tag entity in responses
export interface AutoAssetTagResult {
  _id: string;
  createdAt: string;
  updatedAt: string;
  tag: string;
  conditionIdCounter?: number; // Present in create/update responses
  linuxConditions: ConditionGroup | Record<string, never>; // Can be empty object {}
  windowsConditions: ConditionGroup | Record<string, never>; // Can be empty object {}
  macosConditions: ConditionGroup | Record<string, never>; // Can be empty object {}
}

// Define the overall API response structure for create/update
export interface AutoAssetTagModifyResponse {
  success: boolean;
  result: AutoAssetTagResult | null;
  statusCode: number;
  errors: string[];
}

// Define the overall API response structure for get by id
export interface GetAutoAssetTagByIdResponse {
  success: boolean;
  result: AutoAssetTagResult | null;
  statusCode: number;
  errors: string[];
}

// Define the structure for the list response result
interface ListAutoAssetTagResult {
    entities: AutoAssetTagResult[];
    filters: { name: string; type: string; options: any[]; filterUrl: string | null }[];
    sortables: string[];
    totalEntityCount: number;
    currentPage: number;
    pageSize: number;
    previousPage: number;
    totalPageCount: number;
    nextPage: number;
  }

// Define the overall API response structure for list
export interface ListAutoAssetTagResponse {
    success: boolean;
    result: ListAutoAssetTagResult | null;
    statusCode: number;
    errors: string[];
  }

export const api = {
  /**
   * Creates a new Auto Asset Tag configuration in Binalyze AIR.
   * @param requestData The configuration for the new auto asset tag.
   * @returns The API response.
   */
  async createAutoAssetTag(requestData: CreateAutoAssetTagRequest): Promise<AutoAssetTagModifyResponse> {
    try {
      const response = await axios.post<AutoAssetTagModifyResponse>(
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
        return error.response.data as AutoAssetTagModifyResponse;
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
  async updateAutoAssetTag(id: string, requestData: UpdateAutoAssetTagRequest): Promise<AutoAssetTagModifyResponse> {
    try {
      const response = await axios.put<AutoAssetTagModifyResponse>(
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
        return error.response.data as AutoAssetTagModifyResponse;
      }
      // Fallback for other types of errors
      throw new Error(`Failed to update auto asset tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Gets a specific Auto Asset Tag configuration by ID in Binalyze AIR.
   * @param id The ID of the auto asset tag to retrieve.
   * @returns The API response containing the auto asset tag details.
   */
  async getAutoAssetTagById(id: string): Promise<GetAutoAssetTagByIdResponse> {
    try {
      const response = await axios.get<GetAutoAssetTagByIdResponse>(
        `${config.airHost}/api/public/auto-asset-tag/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting auto asset tag by ID:', error);
      if (axios.isAxiosError(error) && error.response) {
        // Return the structured error from AIR if available
        return error.response.data as GetAutoAssetTagByIdResponse;
      }
      // Fallback for other types of errors
      throw new Error(`Failed to get auto asset tag by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Lists all Auto Asset Tag configurations in Binalyze AIR.
   * @returns The API response containing the list of auto asset tags.
   */
  async listAutoAssetTags(): Promise<ListAutoAssetTagResponse> {
    try {
      const response = await axios.get<ListAutoAssetTagResponse>(
        `${config.airHost}/api/public/auto-asset-tag`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error listing auto asset tags:', error);
      if (axios.isAxiosError(error) && error.response) {
        // Return the structured error from AIR if available
        return error.response.data as ListAutoAssetTagResponse;
      }
      // Fallback for other types of errors
      throw new Error(`Failed to list auto asset tags: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
