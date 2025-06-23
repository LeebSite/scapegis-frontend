import React, { useState } from 'react';
import { apiClient } from '../../../services/api';

interface TestResult {
  status: 'success' | 'error';
  data?: any;
  statusCode?: number;
  headers?: any;
  error?: string;
  url?: string;
}

const BackendDebug: React.FC = () => {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testEndpoint = async (name: string, url: string, method: 'GET' | 'POST' = 'GET', data?: any) => {
    setLoading(name);
    try {
      const response = method === 'GET'
        ? await apiClient.get(url)
        : await apiClient.post(url, data);

      setResults((prev) => ({
        ...prev,
        [name]: {
          status: 'success' as const,
          data: response.data,
          statusCode: response.status,
          headers: response.headers
        }
      }));
    } catch (error: any) {
      console.error(`${name} Error:`, error);
      setResults((prev) => ({
        ...prev,
        [name]: {
          status: 'error' as const,
          error: error.message,
          statusCode: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
        }
      }));
    }
    setLoading(null);
  };

  const useMock = process.env.REACT_APP_USE_MOCK_API === 'true';

  const endpoints = [
    { name: 'Health Check', url: '/health', method: 'GET' as const },
    { name: 'API Test', url: '/api/v1/test', method: 'GET' as const },
    { name: 'Supabase Test', url: '/api/v1/test/supabase', method: 'GET' as const },
    {
      name: 'Projects Recent (Mock)',
      url: '/api/v1/projects-mock/recent?limit=5',
      method: 'GET' as const
    },
    {
      name: 'Projects List (Mock)',
      url: '/api/v1/projects-mock?page=1&size=10',
      method: 'GET' as const
    },
    {
      name: 'Create Project (Mock)',
      url: '/api/v1/projects-mock',
      method: 'POST' as const,
      data: {
        name: 'Debug Test Project',
        description: 'Test project for debugging',
        settings: { mapCenter: [0, 0], mapZoom: 2 }
      }
    },
    {
      name: 'Get Layers (Mock)',
      url: '/api/v1/layers-mock?project_id=jakarta-smart-city',
      method: 'GET' as const
    }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Backend Endpoint Debug</h2>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-3 h-3 rounded-full ${useMock ? 'bg-blue-500' : 'bg-green-500'}`}></span>
          <span className="text-sm text-gray-600">
            {useMock ? 'Using Mock API' : 'Using Real API'}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <div key={endpoint.name} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{endpoint.name}</h3>
                <p className="text-sm text-gray-600">
                  {endpoint.method} {endpoint.url}
                </p>
              </div>
              <button
                onClick={() => testEndpoint(endpoint.name, endpoint.url, endpoint.method, endpoint.data)}
                disabled={loading === endpoint.name}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading === endpoint.name ? 'Testing...' : 'Test'}
              </button>
            </div>
            
            {results[endpoint.name] && (
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    results[endpoint.name].status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="font-medium">
                    {results[endpoint.name].status === 'success' ? 'Success' : 'Error'}
                  </span>
                  <span className="text-sm text-gray-600">
                    Status: {results[endpoint.name].statusCode}
                  </span>
                </div>
                
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                    View Response
                  </summary>
                  <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                    {JSON.stringify(results[endpoint.name], null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">Debug Tips:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Check if backend is running on <code>http://localhost:8001</code></li>
          <li>• Open <a href="http://localhost:8001/docs" target="_blank" rel="noopener noreferrer" className="underline">API Documentation</a></li>
          <li>• Check backend console for error logs</li>
          <li>• Verify CORS is configured for <code>http://localhost:3000</code></li>
          <li>• Check if database tables exist in Supabase</li>
        </ul>
      </div>
    </div>
  );
};

export default BackendDebug;
