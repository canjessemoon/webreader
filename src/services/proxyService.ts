// Special fallback proxy for environments where the internal proxy fails
// This module is designed to be imported and used in contentService.ts

// Detect if we're running in production (Railway)
const isProduction = typeof window !== 'undefined' && 
                     window.location && 
                     window.location.hostname.includes('railway.app');

// List of public CORS proxies that can be used as fallbacks
const PUBLIC_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://proxy.cors.sh/',
  'https://cors-anywhere.herokuapp.com/'
];

// Configuration
let useExternalProxy = isProduction; // Auto-use external proxy in production
let proxyIndex = 0;

// Function to get the current proxy URL
export const getProxyUrl = () => {
  if (useExternalProxy) {
    return PUBLIC_PROXIES[proxyIndex];
  }
  return '/api/proxy?url='; // Default internal proxy
};

// Function to enable external proxy usage
export const enableExternalProxy = (index = 0) => {
  useExternalProxy = true;
  proxyIndex = index % PUBLIC_PROXIES.length;
  console.log(`External proxy enabled: ${getProxyUrl()}`);
  return getProxyUrl();
};

// Function to disable external proxy usage
export const disableExternalProxy = () => {
  useExternalProxy = false;
  console.log('External proxy disabled, using internal proxy');
  return getProxyUrl();
};

// Function to cycle through available proxies
export const cycleProxy = () => {
  if (useExternalProxy) {
    proxyIndex = (proxyIndex + 1) % PUBLIC_PROXIES.length;
    console.log(`Switched to proxy: ${getProxyUrl()}`);
  } else {
    enableExternalProxy();
  }
  return getProxyUrl();
};
