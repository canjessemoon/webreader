import { useState, useEffect } from 'react';
import axios from 'axios';

interface StatusCheck {
  name: string;
  status: 'up' | 'down' | 'checking' | 'unknown';
  details?: string;
  lastChecked?: string;
}

interface StatusPageProps {
  showInProduction?: boolean;
}

const StatusPage = ({ showInProduction = false }: StatusPageProps) => {
  const [checks, setChecks] = useState<StatusCheck[]>([
    { name: 'API Server', status: 'checking' },
    { name: 'Health Endpoint', status: 'checking' },
    { name: 'Proxy Service', status: 'checking' },
    { name: 'Browser Speech API', status: 'checking' },
  ]);
  
  const [isProduction, setIsProduction] = useState(false);
  
  // Check if we're in a production environment
  useEffect(() => {
    const productionDomains = ['railway.app', 'up.railway.app'];
    const hostname = window.location.hostname;
    const isProd = productionDomains.some(domain => hostname.includes(domain)) || 
                   hostname === 'webreader-production.up.railway.app' ||
                   window.location.href.includes('production');
    setIsProduction(isProd);
  }, []);
  
  // Don't render in production unless explicitly allowed
  if (isProduction && !showInProduction) {
    return null;
  }
  
  // Run status checks
  useEffect(() => {
    // Check API server
    checkApiServer();
    
    // Check health endpoint
    checkHealthEndpoint();
    
    // Check proxy service
    checkProxyService();
    
    // Check browser speech API
    checkSpeechAPI();
    
    // Set up periodic refreshes
    const interval = setInterval(() => {
      checkApiServer();
      checkHealthEndpoint();
      checkProxyService();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const checkApiServer = async () => {
    try {
      const start = Date.now();
      await axios.get('/api');
      const duration = Date.now() - start;
      
      updateStatus('API Server', 'up', `Response time: ${duration}ms`);
    } catch (error) {
      updateStatus('API Server', 'down', getErrorDetails(error));
    }
  };
  
  const checkHealthEndpoint = async () => {
    try {
      const response = await axios.get('/health');
      if (response.data?.status === 'ok') {
        updateStatus('Health Endpoint', 'up', `Last check: ${response.data.timestamp}`);
      } else {
        updateStatus('Health Endpoint', 'down', 'Invalid response format');
      }
    } catch (error) {
      updateStatus('Health Endpoint', 'down', getErrorDetails(error));
    }
  };
  
  const checkProxyService = async () => {
    try {
      // Test with a simple URL that should always work
      const response = await axios.get('/api/proxy?url=https://httpbin.org/status/200');
      if (response.status === 200) {
        updateStatus('Proxy Service', 'up', 'Successfully proxied test request');
      } else {
        updateStatus('Proxy Service', 'down', `Unexpected status: ${response.status}`);
      }
    } catch (error) {
      updateStatus('Proxy Service', 'down', getErrorDetails(error));
    }
  };
  
  const checkSpeechAPI = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      updateStatus('Browser Speech API', 'up', `Available voices: ${voices.length}`);
    } else {
      updateStatus('Browser Speech API', 'down', 'Speech synthesis not supported in this browser');
    }
  };
  
  const updateStatus = (name: string, status: StatusCheck['status'], details?: string) => {
    setChecks(currentChecks => 
      currentChecks.map(check => 
        check.name === name 
          ? { 
              ...check, 
              status, 
              details, 
              lastChecked: new Date().toISOString() 
            } 
          : check
      )
    );
  };
  
  const getErrorDetails = (error: unknown): string => {
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return 'Unknown error';
  };
  
  const getStatusBadgeClasses = (status: StatusCheck['status']): string => {
    switch (status) {
      case 'up':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'down':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'checking':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          System Status
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Current status of WebReader services
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <dl>
          {checks.map((check, idx) => (
            <div key={check.name} className={`
              ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'} 
              px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6
            `}>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {check.name}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(check.status)}`}>
                    {check.status}
                  </span>
                  {check.details && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      {check.details}
                    </span>
                  )}
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default StatusPage;
