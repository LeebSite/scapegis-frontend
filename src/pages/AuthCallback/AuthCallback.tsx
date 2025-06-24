import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { AuthContainer } from '../../components/organisms';
import { Typography } from '../../components/atoms';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  const { login, clearError } = useAuthStore();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Clear any previous errors
        clearError();

        // Get parameters from URL
        const success = searchParams.get('success');
        const provider = searchParams.get('provider');
        const message = searchParams.get('message');
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const code = searchParams.get('code');

        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        // Handle success from backend (new format)
        if (success === 'true') {
          setStatus('success');
          setMessage(`${provider} authentication successful! Redirecting to dashboard...`);

          // For now, we'll create a mock token since backend doesn't provide real JWT yet
          const mockToken = `mock_token_${provider}_${Date.now()}`;
          localStorage.setItem('access_token', mockToken);

          // Also store user info (mock data for now)
          const mockUser = {
            id: `user_${Date.now()}`,
            email: `user@${provider}.com`,
            name: `${provider} User`,
            provider: provider
          };
          localStorage.setItem('user_info', JSON.stringify(mockUser));

          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
          return;
        }

        if (token) {
          // If we have a token, store it and redirect
          localStorage.setItem('access_token', token);

          setStatus('success');
          setMessage('Authentication successful! Redirecting...');

          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
        } else if (code) {
          // If we have a code, we need to exchange it for tokens
          setStatus('error');
          setMessage('OAuth code received but token exchange not implemented');
        } else if (!success) {
          setStatus('error');
          setMessage('No authentication data received');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during authentication');
      }
    };

    processCallback();
  }, [searchParams, navigate, clearError]);

  const getIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader className="w-12 h-12 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <AuthContainer>
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 mb-6">
          {getIcon()}
        </div>

        {/* Status Message */}
        <Typography variant="h2" className={`mb-3 text-2xl font-semibold ${getStatusColor()}`}>
          {status === 'processing' && 'Authenticating...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Authentication Failed'}
        </Typography>
        
        <Typography variant="body1" color="gray" className="text-sm mb-6 leading-relaxed">
          {message}
        </Typography>

        {/* Actions */}
        {status === 'error' && (
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Back to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {status === 'processing' && (
          <div className="text-xs text-gray-500 mt-4">
            Please wait while we complete your authentication...
          </div>
        )}
      </div>
    </AuthContainer>
  );
};

export default AuthCallback;
