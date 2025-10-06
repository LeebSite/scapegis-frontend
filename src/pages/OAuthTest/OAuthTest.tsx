import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

const OAuthTest: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const { isAuthenticated, user, isLoading, handleOAuthCallback, checkAuth } = useAuthStore();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog('🚀 OAuthTest component mounted');
    checkAuth();
  }, [checkAuth]);

  const testOAuthCallback = async () => {
    addLog('🧪 Testing OAuth callback...');
    try {
      await handleOAuthCallback('google', true);
      addLog('✅ OAuth callback test successful');
    } catch (error) {
      addLog(`❌ OAuth callback test failed: ${error}`);
    }
  };

  const checkLocalStorage = () => {
    addLog('🔍 Checking localStorage...');
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userData = localStorage.getItem('user_data');

    addLog(`Access Token: ${token ? `${token.substring(0, 30)}...` : 'null'}`);
    addLog(`Refresh Token: ${refreshToken ? `${refreshToken.substring(0, 30)}...` : 'null'}`);
    addLog(`User Data: ${userData || 'null'}`);
  };

  const clearStorage = () => {
    addLog('🧹 Clearing localStorage...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    addLog('✅ localStorage cleared');
  };

  const simulateOAuthRedirect = () => {
    addLog('🔄 Simulating OAuth redirect...');
    window.location.href = '/dashboard?oauth_success=true&provider=google&message=login_successful';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">OAuth Test Page</h1>
        
        {/* Current State */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Authentication State</h2>
          <div className="space-y-2">
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Is Loading:</strong> {isLoading ? '⏳ Yes' : '✅ No'}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-x-4">
            <button
              onClick={testOAuthCallback}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test OAuth Callback
            </button>
            <button
              onClick={checkLocalStorage}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Check localStorage
            </button>
            <button
              onClick={clearStorage}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Clear Storage
            </button>
            <button
              onClick={simulateOAuthRedirect}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Simulate OAuth Redirect
            </button>
            <button
              onClick={() => checkAuth()}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Check Auth
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => setLogs([])}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuthTest;
