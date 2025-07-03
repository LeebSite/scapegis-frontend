import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '../../components/atoms';
import { useAuthStore } from '../../stores/authStore';

const OAuthDebug: React.FC = () => {
  const navigate = useNavigate();
  const { oauthLogin, isAuthenticated, user } = useAuthStore();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev, logEntry]);
    console.log(logEntry);
  };

  useEffect(() => {
    addLog('🔧 OAuth Debug page loaded');
    addLog(`🔧 Current URL: ${window.location.href}`);
    addLog(`🔧 Is Authenticated: ${isAuthenticated}`);
    addLog(`🔧 User: ${user ? JSON.stringify(user, null, 2) : 'null'}`);
    
    // Check localStorage
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userData = localStorage.getItem('user_data');
    
    addLog(`🔧 Access Token: ${accessToken ? `${accessToken.substring(0, 20)}...` : 'null'}`);
    addLog(`🔧 Refresh Token: ${refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null'}`);
    addLog(`🔧 User Data: ${userData ? 'present' : 'null'}`);
  }, [isAuthenticated, user]);

  const handleDirectBackendTest = () => {
    addLog('🧪 Testing direct backend OAuth URL');
    const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
    const oauthUrl = `${backendUrl}/api/v1/auth/oauth/google`;
    addLog(`🔗 Redirecting to: ${oauthUrl}`);
    window.location.href = oauthUrl;
  };

  const handleOAuthLogin = async () => {
    addLog('🧪 Testing OAuth login via auth store');
    try {
      await oauthLogin('google');
      addLog('✅ OAuth login initiated successfully');
    } catch (error) {
      addLog(`❌ OAuth login failed: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const clearAuth = () => {
    addLog('🧹 Clearing authentication data');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    addLog('✅ Authentication data cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <Typography variant="h1" className="text-2xl font-bold mb-6">
            OAuth Debug Tool
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-4">
              <Typography variant="h2" className="text-lg font-semibold">
                Test Actions
              </Typography>
              
              <div className="space-y-3">
                <Button
                  onClick={handleOAuthLogin}
                  variant="primary"
                  className="w-full"
                >
                  Test OAuth via Auth Store
                </Button>
                
                <Button
                  onClick={handleDirectBackendTest}
                  variant="secondary"
                  className="w-full"
                >
                  Test Direct Backend URL
                </Button>
                
                <Button
                  onClick={clearAuth}
                  variant="outline"
                  className="w-full"
                >
                  Clear Auth Data
                </Button>
                
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="w-full"
                >
                  Go to Login Page
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Typography variant="h3" className="text-md font-semibold mb-2">
                  Environment Info
                </Typography>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>API URL: {process.env.REACT_APP_API_URL || 'http://localhost:8001'}</div>
                  <div>Frontend URL: {process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3001'}</div>
                  <div>Environment: {process.env.NODE_ENV}</div>
                </div>
              </div>
            </div>

            {/* Logs */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h2" className="text-lg font-semibold">
                  Debug Logs
                </Typography>
                <Button
                  onClick={clearLogs}
                  variant="outline"
                  size="sm"
                >
                  Clear Logs
                </Button>
              </div>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-xs">
                {logs.length === 0 ? (
                  <div className="text-gray-500">No logs yet...</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <Typography variant="h3" className="text-md font-semibold mb-2 text-blue-800">
              How to Debug OAuth Issues:
            </Typography>
            <div className="text-sm text-blue-700 space-y-1">
              <div>1. Click "Test Direct Backend URL" to test backend OAuth endpoint directly</div>
              <div>2. Check browser network tab for redirect responses</div>
              <div>3. Look at callback URL parameters when redirected back</div>
              <div>4. Check console logs for detailed error information</div>
              <div>5. Verify backend is running on correct port (8001)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthDebug;
