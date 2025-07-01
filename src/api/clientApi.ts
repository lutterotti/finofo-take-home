import { Fruit } from '@/util/types';
import axios from 'axios';
import axiosRetry from 'axios-retry';

export interface TaxYearBrackets {
  tax_brackets: TaxBracket[];
}

export interface TaxBracket {
  min: number;
  max?: number;
  rate: number;
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

export const getFruits = async (): Promise<Fruit[]> => {
  const isLocalhost3000 =
    typeof window !== 'undefined' &&
    window.location.origin === 'http://localhost:3000';

  if (isLocalhost3000) {
    const response = await fetch('https://fruity-proxy.vercel.app/api/fruits', {
      method: 'GET',
      headers: {
        'x-api-key': 'fruit-api-challenge-2025',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      },
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } else {
    const response = await fetch('https://fruity-proxy.vercel.app/api/fruits', {
      method: 'GET',
      headers: {
        'x-api-key': 'fruit-api-challenge-2025',
        'User-Agent': 'Mozilla/5.0 (compatible; API-Client/1.0)',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${errorText}`);
    }

    const data = await response.json();
    return data;
  }
};
