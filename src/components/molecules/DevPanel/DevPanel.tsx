import React, { useState } from 'react';
import { Settings, Database, Server, TestTube, ChevronDown, ChevronUp } from 'lucide-react';
import { ApiStatus } from '../../atoms';
import { apiClient } from '../../../services/api';

const DevPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runApiTests = async () => {
    setIsLoading(true);
    const results: any = {
      health: { status: 'pending', response: null, error: null },
      test: { status: 'pending', response: null, error: null },
      supabase: { status: 'pending', response: null, error: null }
    };

    try {
      // Test health endpoint
      try {
        const healthResponse = await apiClient.get('/health');
        results.health = { status: 'success', response: healthResponse.data, error: null };
      } catch (error) {
        results.health = { status: 'error', response: null, error };
      }

      // Test API v1 endpoint
      try {
        const testResponse = await apiClient.get('/api/v1/test');
        results.test = { status: 'success', response: testResponse.data, error: null };
      } catch (error) {
        results.test = { status: 'error', response: null, error };
      }

      // Test Supabase connection (if endpoint exists)
      try {
        const supabaseResponse = await apiClient.get('/api/v1/test/supabase');
        results.supabase = { status: 'success', response: supabaseResponse.data, error: null };
      } catch (error) {
        results.supabase = { status: 'error', response: null, error };
      }

    } catch (error) {
      console.error('Test failed:', error);
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      case 'pending':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Dev Panel</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </div>

        {/* Content */}
        {isOpen && (
          <div className="border-t border-gray-200 p-3 space-y-3 min-w-[300px]">
            {/* API Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Backend Status</span>
              </div>
              <div className="pl-6">
                <ApiStatus />
              </div>
            </div>

            {/* Test Button */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TestTube className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">API Tests</span>
              </div>
              <div className="pl-6">
                <button
                  onClick={runApiTests}
                  disabled={isLoading}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Testing...' : 'Run Tests'}
                </button>
              </div>
            </div>

            {/* Test Results */}
            {testResults && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Test Results</span>
                </div>
                <div className="pl-6 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    {getStatusIcon(testResults.health.status)}
                    <span>Health Check</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {getStatusIcon(testResults.test.status)}
                    <span>API v1 Test</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {getStatusIcon(testResults.supabase.status)}
                    <span>Supabase Connection</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="text-xs font-medium text-gray-700 mb-2">Quick Actions</div>
              <div className="space-y-1">
                <a
                  href="/test"
                  className="block text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  → Full Integration Test
                </a>
                <a
                  href="http://localhost:8001/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  → Backend API Docs
                </a>
              </div>
            </div>

            {/* Environment Info */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                <div>API URL: {process.env.REACT_APP_API_URL}</div>
                <div>Environment: {process.env.NODE_ENV}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevPanel;
