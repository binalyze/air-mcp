import { config } from '../config';

/**
 * Validates that the Air API token is set and not empty
 * @throws Error if the token is missing or empty
 */
export function validateAirApiToken(): void {
  if (!config.airApiToken || config.airApiToken.trim() === '') {
    throw new Error('AIR_API_TOKEN not provided. Please configure the MCP server with a valid airApiToken to execute tools.');
  }
} 