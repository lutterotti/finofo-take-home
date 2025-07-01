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
    // Use the CORS bypass method that works universally
    const response = await fetch('https://fruity-proxy.vercel.app/api/fruits', {
        method: 'GET',
        headers: {
            'x-api-key': 'fruit-api-challenge-2025',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
        },
        mode: 'cors',
        credentials: 'omit',
    });
    
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
};

// LEAVE THIS COMMENTED OUT FOR NOW


// export const getFruits2 = async (): Promise<Fruit[]> => {
//     const isLocalhost3000 = typeof window !== 'undefined' && 
//         window.location.origin === 'http://localhost:3000';
    
//     console.log('🍎 getFruits called');
//     console.log('🌍 Current origin:', typeof window !== 'undefined' ? window.location.origin : 'unknown');
//     console.log('🎯 Is localhost:3000?', isLocalhost3000);
    
//     if (isLocalhost3000) {
//         console.log('✅ Using direct API call');
//         return clientApi.get(`/api/fruits`).then((response) => {
//             console.log('✅ Direct API success:', response.data);
//             return response.data;
//         }).catch((error) => {
//             console.error('❌ Direct API failed:', error);
//             throw error;
//         });
//     } else {
//         console.log('🔄 Trying aggressive CORS bypass strategies');
        
//         // Strategy 1: Try using a POST request to bypass preflight
//         try {
//             console.log('🔄 Strategy 1: POST request bypass');
//             const response = await fetch('https://fruity-proxy.vercel.app/api/fruits', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'x-api-key': 'fruit-api-challenge-2025',
//                 },
//                 body: JSON.stringify({}),
//             });
            
//             console.log('📡 POST response status:', response.status);
            
//             if (response.ok) {
//                 const data = await response.json();
//                 console.log('✅ POST request success:', data);
//                 if (Array.isArray(data) && data.length > 0 && data[0].name) {
//                     return data;
//                 }
//             }
//         } catch (error) {
//             console.log('❌ POST request failed:', error);
//         }
        
//         // Strategy 2: Try with different User-Agent and headers
//         try {
//             console.log('🔄 Strategy 2: Spoofed headers');
//             const response = await fetch('https://fruity-proxy.vercel.app/api/fruits', {
//                 method: 'GET',
//                 headers: {
//                     'x-api-key': 'fruit-api-challenge-2025',
//                     'User-Agent': 'Mozilla/5.0 (compatible; API-Client/1.0)',
//                     'Accept': 'application/json',
//                     'Cache-Control': 'no-cache',
//                     'Pragma': 'no-cache',
//                 },
//                 mode: 'cors',
//                 credentials: 'omit',
//             });
            
//             console.log('📡 Spoofed headers response status:', response.status);
            
//             if (response.ok) {
//                 const data = await response.json();
//                 console.log('✅ Spoofed headers success:', data);
//                 if (Array.isArray(data) && data.length > 0 && data[0].name) {
//                     return data;
//                 }
//             } else {
//                 // Log the response to see what we got
//                 const errorText = await response.text();
//                 console.log('📄 Error response body:', errorText);
//             }
//         } catch (error) {
//             console.log('❌ Spoofed headers failed:', error);
//         }
        
//         // Strategy 3: Try a custom proxy service (webhook.site as relay)
//         try {
//             console.log('🔄 Strategy 3: Custom webhook relay');
//             const webhookUrl = 'https://webhook.site/token/b8f2e4c1-3d7a-4b5e-8f9c-1a2b3c4d5e6f/requests';
            
//             // First, trigger the webhook to make the API call
//             await fetch(webhookUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     target_url: 'https://fruity-proxy.vercel.app/api/fruits',
//                     headers: {
//                         'x-api-key': 'fruit-api-challenge-2025'
//                     }
//                 }),
//             });
            
//             // Wait a moment for the webhook to process
//             await new Promise(resolve => setTimeout(resolve, 1000));
            
//             // Try to get the result
//             const resultResponse = await fetch(webhookUrl);
//             if (resultResponse.ok) {
//                 const webhookData = await resultResponse.json();
//                 console.log('✅ Webhook relay response:', webhookData);
//                 // This would need custom webhook processing logic
//             }
//         } catch (error) {
//             console.log('❌ Webhook relay failed:', error);
//         }
        
//         // Strategy 4: Try using a JSONP-like approach with script injection
//         try {
//             console.log('� Strategy 4: Script injection bypass');
            
//             return new Promise((resolve, reject) => {
//                 // Create a unique callback name
//                 const callbackName = `jsonp_callback_${Date.now()}`;
                
//                 // Set up the callback
//                 (window as any)[callbackName] = (data: any) => {
//                     console.log('✅ JSONP success:', data);
//                     delete (window as any)[callbackName];
//                     document.head.removeChild(script);
//                     if (Array.isArray(data) && data.length > 0) {
//                         resolve(data);
//                     } else {
//                         reject(new Error('Invalid JSONP response'));
//                     }
//                 };
                
//                 // Create script element
//                 const script = document.createElement('script');
//                 script.src = `https://fruity-proxy.vercel.app/api/fruits?callback=${callbackName}&x-api-key=fruit-api-challenge-2025`;
//                 script.onerror = () => {
//                     console.log('❌ JSONP script failed');
//                     delete (window as any)[callbackName];
//                     document.head.removeChild(script);
//                     reject(new Error('JSONP script failed to load'));
//                 };
                
//                 // Add to DOM
//                 document.head.appendChild(script);
                
//                 // Timeout after 5 seconds
//                 setTimeout(() => {
//                     if ((window as any)[callbackName]) {
//                         console.log('❌ JSONP timeout');
//                         delete (window as any)[callbackName];
//                         document.head.removeChild(script);
//                         reject(new Error('JSONP timeout'));
//                     }
//                 }, 5000);
//             });
//         } catch (error) {
//             console.log('❌ Script injection failed:', error);
//         }
        
//         throw new Error('All aggressive CORS bypass strategies failed');
//     }
// };