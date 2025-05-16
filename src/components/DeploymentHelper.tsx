import React, { useState } from 'react';

const DeploymentHelper: React.FC = () => {
  const [showDeploySection, setShowDeploySection] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deployStep, setDeployStep] = useState(1);
  const handleCopyRailwayConfig = async () => {
    try {
      // Call the server endpoint to copy the railway config file
      const response = await fetch('/api/copy-railway-config', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to copy railway config');
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying Railway config:', error);
    }
  };

  const copyCommand = 'cp railway.simple.json railway.json';

  const steps = [
    {
      title: 'Copy Railway Configuration',
      content: 'Copy the simplified Railway configuration file to prepare for deployment',
      action: () => (
        <div className="flex items-center mt-2">
          <code className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-sm mr-2 font-mono">
            {copyCommand}
          </code>
          <button
            onClick={handleCopyRailwayConfig}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      ),
    },
    {
      title: 'Build the Project',
      content: 'Build the WebReader application for production',      action: () => (
        <div className="mt-2">
          <button
            onClick={() => {
              // Run the build task via fetch to a local endpoint
              fetch('/api/run-build', { method: 'POST' })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Failed to start build');
                  }
                  return response.json();
                })
                .then(() => {
                  console.log('Build started successfully');
                  // You could set state here to show build progress
                })
                .catch(error => {
                  console.error('Error starting build:', error);
                  // Show error to user
                });
            }}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
          >
            Run Build
          </button>
        </div>
      ),
    },
    {
      title: 'Deploy to Railway',
      content: 'Push your changes to GitHub and deploy on Railway',
      action: () => (
        <div className="mt-2">
          <ol className="list-decimal list-inside text-sm text-gray-700 dark:text-gray-300">
            <li className="mb-1">Push your changes to GitHub</li>
            <li className="mb-1">Go to Railway.app and create a new project</li>
            <li className="mb-1">Connect to your GitHub repository</li>
            <li className="mb-1">Railway will automatically detect the configuration</li>
          </ol>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (deployStep < steps.length) {
      setDeployStep(deployStep + 1);
    }
  };

  const handlePrev = () => {
    if (deployStep > 1) {
      setDeployStep(deployStep - 1);
    }
  };

  return (
    <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
      <button
        onClick={() => setShowDeploySection(!showDeploySection)}
        className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 mr-1 transition-transform ${
            showDeploySection ? 'rotate-90' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        Deployment Assistant
      </button>

      {showDeploySection && (
        <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Deploy WebReader to Railway
          </h3>
          
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded ${
                      index + 1 <= deployStep
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  ></div>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                Step {deployStep} of {steps.length}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {steps[deployStep - 1].title}
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {steps[deployStep - 1].content}
              </p>
              {steps[deployStep - 1].action()}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrev}
                disabled={deployStep === 1}
                className={`px-3 py-1 rounded text-sm ${
                  deployStep === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={deployStep === steps.length}
                className={`px-3 py-1 rounded text-sm ${
                  deployStep === steps.length
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next Step
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentHelper;
