import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Make the request to the external API
    const response = await fetch('https://fruity-proxy.vercel.app/api/fruits', {
      method: 'GET',
      headers: {
        'x-api-key': 'fruit-api-challenge-2025',
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; FiNoFo-Proxy/1.0)',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'External API error',
        message: errorText || 'Unknown error',
      });
    }

    const data = await response.json();

    // Validate the response
    if (!Array.isArray(data)) {
      console.error('Invalid response format:', data);
      return res.status(500).json({
        error: 'Invalid response format',
        message: 'Expected an array of fruits',
      });
    }

    // Set CORS headers to allow requests from your frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Return the data
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
