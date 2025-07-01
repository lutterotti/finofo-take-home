import { Fruit } from '@/util/types';
import axios from 'axios';
import axiosRetry from 'axios-retry';

export interface TaxYearBrackets {
    tax_brackets: TaxBracket[];
};

export interface TaxBracket {
    min: number;
    max?: number;
    rate: number;
};

const clientApi = axios.create({
    baseURL: 'https://fruity-proxy.vercel.app',
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'fruit-api-challenge-2025'
    },
});

// retry the endpoint to handle the randomly thrown 500 error
axiosRetry(clientApi, {retries: 3});

export const getFruits = async (): Promise<Fruit[]> => {
    return clientApi.get(`/api/fruits`).then((response) => response.data);
};