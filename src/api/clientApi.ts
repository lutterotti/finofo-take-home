import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Fruit } from '../util/types';

export interface TaxYearBrackets {
  tax_brackets: TaxBracket[];
}

export interface TaxBracket {
  min: number;
  max?: number;
  rate: number;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  url?: string;
}

export class FruitApiError extends Error {
  public status?: number;
  public statusText?: string;
  public url?: string;

  constructor(
    message: string,
    status?: number,
    statusText?: string,
    url?: string
  ) {
    super(message);
    this.name = 'FruitApiError';
    this.status = status;
    this.statusText = statusText;
    this.url = url;
  }
}

const clientApi = axios.create({
  baseURL: 'https://fruity-proxy.vercel.app',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'fruit-api-challenge-2025',
  },
});

// retry the endpoint to handle the randomly thrown 500 error
axiosRetry(clientApi, { retries: 2 });

// Determine API URL based on environment
const getApiUrl = (): string => {
  // In production (deployed), use the Vercel proxy to avoid CORS
  if (process.env.NODE_ENV === 'production') {
    return '/api/fruits';
  }

  // In development, use the external API directly (CORS works locally)
  return 'https://fruity-proxy.vercel.app/api/fruits';
};

const API_BASE_URL = getApiUrl();
const API_KEY = 'fruit-api-challenge-2025';
const REQUEST_TIMEOUT = 20000;

const createRequestHeaders = (includeUserAgent = false) => {
  const headers: HeadersInit = {
    'x-api-key': API_KEY,
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  };

  if (includeUserAgent) {
    headers['User-Agent'] = 'Mozilla/5.0 (compatible; API-Client/1.0)';
    headers['Pragma'] = 'no-cache';
  }

  return headers;
};

const handleApiResponse = async (response: Response): Promise<Fruit[]> => {
  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;

    try {
      const errorText = await response.text();
      if (errorText) {
        errorMessage += `: ${errorText}`;
      }
    } catch (parseError) {
      // If we can't parse the error response, use the status text
      errorMessage += `: ${response.statusText}`;
    }

    throw new FruitApiError(
      errorMessage,
      response.status,
      response.statusText,
      response.url
    );
  }

  try {
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new FruitApiError(
        'Invalid API response: Expected an array of fruits',
        response.status,
        'Invalid Response Format',
        response.url
      );
    }

    return data;
  } catch (error) {
    if (error instanceof FruitApiError) {
      throw error;
    }

    throw new FruitApiError(
      `Failed to parse API response: ${error instanceof Error ? error.message : 'Unknown error'}`,
      response.status,
      'Parse Error',
      response.url
    );
  }
};

export const getFruits = async (): Promise<Fruit[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const headers = createRequestHeaders(false);

    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers,
      mode: 'cors',
      credentials: 'omit',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return await handleApiResponse(response);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof FruitApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new FruitApiError(
        `Request timeout after ${REQUEST_TIMEOUT}ms`,
        408,
        'Request Timeout',
        API_BASE_URL
      );
    }

    if (error instanceof TypeError) {
      throw new FruitApiError(
        'Network error: Unable to connect to the API. Please check your internet connection.',
        0,
        'Network Error',
        API_BASE_URL
      );
    }

    throw new FruitApiError(
      `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Unknown Error',
      API_BASE_URL
    );
  }
};
