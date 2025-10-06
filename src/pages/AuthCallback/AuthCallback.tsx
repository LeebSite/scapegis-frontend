import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { AuthContainer } from '../../components/organisms';
import { Typography } from '../../components/atoms';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { authApi } from '../../services/api';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  const { clearError, checkAuth } = useAuthStore();

  useEffect(() => {
    const processCallback = async () => {
      try {
        clearError();
        console.log('🔄 AuthCallback: Processing OAuth callback');
        console.log('🔄 AuthCallback: Full URL:', window.location.href);

        // Parse all possible parameters from URL
        const params = {
          access_token: searchParams.get('access_token'),
          refresh_token: searchParams.get('refresh_token'),
          user_id: searchParams.get('user_id'),
          email: searchParams.get('email'),
          name: searchParams.get('name'),
          avatar_url: searchParams.get('avatar_url'),
          oauth_success: searchParams.get('oauth_success'),
          provider: searchParams.get('provider'),
          error: searchParams.get('error'),
          error_description: searchParams.get('error_description'),
        };

        console.log('🔄 AuthCallback: Parsed URL parameters:', params);

        // Log all search params for debugging
        const allParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          allParams[key] = value;
        });
        console.log('🔄 AuthCallback: All URL search params:', allParams);

        // Handle error cases first
        if (params.error) {
          console.error('❌ AuthCallback: OAuth error received:', params.error, params.error_description);
          const errorParams = new URLSearchParams({
            error: params.error,
            ...(params.error_description && { error_description: params.error_description }),
            ...(params.provider && { provider: params.provider }),
          });
          navigate(`/auth/error?${errorParams.toString()}`, { replace: true });
          return;
        }

        // Check for explicit failure
        if (params.oauth_success === 'false') {
          console.error('❌ AuthCallback: OAuth explicitly failed');
          const errorParams = new URLSearchParams({
            error: 'oauth_failed',
            error_description: 'OAuth authentication was not successful',
            ...(params.provider && { provider: params.provider }),
          });
          navigate(`/auth/error?${errorParams.toString()}`, { replace: true });
          return;
        }

        // Check if we have any indication of success but no token
        if (params.oauth_success === 'true' && !params.access_token) {
          console.error('❌ AuthCallback: OAuth success indicated but no access token received');
          const errorParams = new URLSearchParams({
            error: 'no_token_after_success',
            error_description: 'OAuth was successful but no access token was provided',
            ...(params.provider && { provider: params.provider }),
          });
          navigate(`/auth/error?${errorParams.toString()}`, { replace: true });
          return;
        }

        // Process successful authentication
        if (params.access_token) {
          console.log('✅ AuthCallback: Access token received, processing...');

          // Store tokens
          localStorage.setItem('access_token', params.access_token);
          if (params.refresh_token) {
            localStorage.setItem('refresh_token', params.refresh_token);
          }

          // Prepare user data
          const userData = {
            id: params.user_id || '',
            email: params.email ? decodeURIComponent(params.email) : '',
            name: params.name ? decodeURIComponent(params.name) : '',
            avatar_url: params.avatar_url ? decodeURIComponent(params.avatar_url) : '',
          };

          console.log('👤 AuthCallback: User data prepared:', userData);

          // Verify token with backend and get complete user profile
          try {
            setMessage('Verifying authentication with server...');
            const response = await authApi.getProfile();
            const backendUser = response.data.data;

            console.log('✅ AuthCallback: Token verified with backend:', backendUser);

            // Store verified user data
            localStorage.setItem('user_data', JSON.stringify(backendUser));

            // Update auth state by calling checkAuth to refresh the store
            await checkAuth();

            setStatus('success');
            setMessage('Authentication successful! Redirecting to dashboard...');

            // Redirect to dashboard after a short delay
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1500);

          } catch (verifyError) {
            console.warn('⚠️ AuthCallback: Backend verification failed, using stored data:', verifyError);

            // Fallback to stored user data if backend verification fails
            localStorage.setItem('user_data', JSON.stringify(userData));

            // Update auth state even with fallback data
            await checkAuth();

            setStatus('success');
            setMessage('Authentication successful! Redirecting to dashboard...');

            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1500);
          }

          return;
        }

        // No token received - this might be the case causing "callback_failed"
        console.error('❌ AuthCallback: No access token received');
        console.error('❌ AuthCallback: This might indicate backend OAuth processing failed');
        console.error('❌ AuthCallback: Check backend logs for OAuth provider errors');

        const errorParams = new URLSearchParams({
          error: 'no_token',
          error_description: 'No authentication token was received from the OAuth provider. This usually means the OAuth flow failed on the backend.',
          ...(params.provider && { provider: params.provider }),
        });
        navigate(`/auth/error?${errorParams.toString()}`, { replace: true });

      } catch (error) {
        console.error('❌ AuthCallback: Unexpected error during processing:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during authentication');

        // Redirect to error page after a delay
        setTimeout(() => {
          const errorParams = new URLSearchParams({
            error: 'processing_error',
            error_description: 'An unexpected error occurred while processing authentication',
          });
          navigate(`/auth/error?${errorParams.toString()}`, { replace: true });
        }, 2000);
      }
    };

    processCallback();
  }, [searchParams, navigate, clearError, checkAuth]);

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

        {/* Debug Information - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
            <Typography variant="body2" className="text-xs font-mono text-gray-600 mb-2">
              Debug Info (Development Only):
            </Typography>
            <div className="text-xs font-mono text-gray-500 space-y-1">
              <div>URL: {window.location.href}</div>
              <div>Search Params: {window.location.search}</div>
              <div>Hash: {window.location.hash}</div>
            </div>
          </div>
        )}
      </div>
    </AuthContainer>
  );
};

export default AuthCallback;
