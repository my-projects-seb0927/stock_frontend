/**
 * Environment configuration
 * In production, use .env files with VITE_ prefix
 */

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  apiVersion: 'v1',
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${config.apiBaseUrl}/api/${config.apiVersion}${endpoint}`;
};
