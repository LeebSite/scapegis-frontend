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

  const { clearError } = useAuthStore();

  useEffect(() => {
    const processCallback = async () => {
      try {
        clearError();
        // Ambil semua parameter yang mungkin dikirim backend
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const userId = searchParams.get('user_id');
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const avatarUrl = searchParams.get('avatar_url');
        const error = searchParams.get('error');
        // Jika error
        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          setTimeout(() => navigate('/login', { replace: true }), 2000);
          return;
        }
        // Jika ada access_token, simpan semua data user
        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
          if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
          const userData = {
            id: userId || '',
            email: email ? decodeURIComponent(email) : '',
            name: name ? decodeURIComponent(name) : '',
            avatar_url: avatarUrl ? decodeURIComponent(avatarUrl) : '',
          };
          localStorage.setItem('user_data', JSON.stringify(userData));
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
          return;
        }
        // Jika tidak ada token, redirect ke login
        setStatus('error');
        setMessage('No authentication token received. Redirecting to login...');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred during authentication');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
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
