import axios from 'axios';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Extract URL parameter
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    console.log(`Fetching content from: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com/',
        'Cache-Control': 'no-cache'
      },
      responseType: 'text',
      timeout: 10000 // 10 second timeout
    });
    
    // Set the appropriate content type for the response
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(response.data);
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).json({ 
      error: 'Failed to fetch URL', 
      message: error.message,
      details: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText
      } : 'No response details'
    });
  }
}
