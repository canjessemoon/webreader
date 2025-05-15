import axios from 'axios';
import * as cheerio from 'cheerio';
import { convert } from 'html-to-text';

// API URL for our backend proxy service
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:3001/api/proxy?url=' 
  : '/api/proxy?url=';

// Function to extract the main content from a website
export const extractContent = async (url: string): Promise<string> => {
  try {
    // Add CORS proxy if needed for the final solution
    const response = await axios.get(`${API_URL}${url}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, nav, header, footer, iframe, .ad, .ads, .advertisement, .sidebar, [class*="side-"], [class*="nav-"], [id*="nav-"]').remove();

    // Try to find the main content
    let content = '';

    // Check for common article containers
    const articleSelectors = [
      'article', 
      '.article', 
      '.post', 
      '.content', 
      '.post-content',
      '.entry-content', 
      'main', 
      '#main',
      '.main-content'
    ];

    for (const selector of articleSelectors) {
      if ($(selector).length) {
        content = $(selector).html() || '';
        break;
      }
    }

    // If no specific content container found, use the body
    if (!content) {
      content = $('body').html() || '';
    }

    // Convert HTML to text
    const options = {
      wordwrap: 130,
      selectors: [
        { selector: 'img', format: 'skip' },
        { selector: 'a', options: { ignoreHref: true } }
      ]
    };

    const text = convert(content, options);

    // Post-processing - remove excessive whitespace and clean up the text
    return text
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  } catch (error) {
    console.error('Error extracting content:', error);
    throw new Error('Failed to extract content from the website');
  }
};
