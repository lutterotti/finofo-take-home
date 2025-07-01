/**
 * Vercel serverless function to proxy fruit API requests
 * This avoids CORS issues in production while maintaining compatibility
 */

export default async function handler(req, res) {
  // Only allow GET requests aaa
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only GET requests are supported',
    });
  }

  // Set CORS headers to allow requests from your domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  try {
    // Forward the request to the external API
    const apiUrl = 'https://fruity-proxy.vercel.app/api/fruits';
    const apiKey = 'fruit-api-challenge-2025';

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://finofo-take-home-ggiu.vercel.app/',
        Origin: 'https://finofo-take-home-ggiu.vercel.app',
      },
    });

    if (!response.ok) {
      console.error(
        `External API error: ${response.status} ${response.statusText}`
      );
      return res.status(response.status).json({
        error: 'External API error',
        message: `Failed to fetch from external API: ${response.statusText}`,
        status: response.status,
      });
    }

    const data = await response.json();

    // Validate the response
    if (!Array.isArray(data)) {
      console.error('Invalid response format from external API');
      return res.status(502).json({
        error: 'Invalid response format',
        message: 'External API returned invalid data format',
      });
    }

    // Return the data with appropriate caching headers
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to proxy request to external API',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
