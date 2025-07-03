import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthContainer } from '../../components/organisms';
import { Typography, Button } from '../../components/atoms';
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from 'lucide-react';

const AuthError: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorDetails, setErrorDetails] = useState<{
    message: string;
    code?: string;
    provider?: string;
  }>({
    message: 'An authentication error occurred',
  });

  useEffect(() => {
    // Parse error parameters from URL
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const errorCode = searchParams.get('error_code');
    const provider = searchParams.get('provider');
    const state = searchParams.get('state');

    // Log error for debugging
    const errorInfo = {
      error,
      errorDescription,
      errorCode,
      provider,
      state,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.error('🚨 OAuth Authentication Error:', errorInfo);

    // You can also send this to your error tracking service
    // Example: errorTrackingService.logError('oauth_error', errorInfo);

    // Set user-friendly error message
    let message = 'Authentication failed. Please try again.';
    
    if (error) {
      switch (error.toLowerCase()) {
        case 'access_denied':
          message = 'Access was denied. You need to grant permission to continue.';
          break;
        case 'invalid_request':
          message = 'Invalid authentication request. Please try again.';
          break;
        case 'unauthorized_client':
          message = 'Authentication service is not properly configured.';
          break;
        case 'unsupported_response_type':
          message = 'Authentication method is not supported.';
          break;
        case 'invalid_scope':
          message = 'Invalid authentication scope requested.';
          break;
        case 'server_error':
          message = 'Server error occurred during authentication.';
          break;
        case 'temporarily_unavailable':
          message = 'Authentication service is temporarily unavailable.';
          break;
        default:
          message = errorDescription || `Authentication error: ${error}`;
      }
    }

    setErrorDetails({
      message,
      code: errorCode || error || undefined,
      provider: provider || undefined,
    });
  }, [searchParams]);

  const handleRetry = () => {
    // Clear any stored auth data that might be corrupted
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    
    // Navigate back to login
    navigate('/login', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <AuthContainer>
      <div className="text-center">
        {/* Error Icon */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 mb-6">
          <AlertTriangle className="w-12 h-12 text-red-600" />
        </div>

        {/* Error Title */}
        <Typography variant="h2" className="mb-3 text-2xl font-semibold text-red-600">
          Authentication Failed
        </Typography>
        
        {/* Error Message */}
        <Typography variant="body1" color="gray" className="text-sm mb-6 leading-relaxed max-w-md mx-auto">
          {errorDetails.message}
        </Typography>

        {/* Error Details */}
        {(errorDetails.code || errorDetails.provider) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
            <Typography variant="body2" className="text-xs text-gray-600 mb-2 font-medium">
              Error Details:
            </Typography>
            {errorDetails.provider && (
              <div className="text-xs text-gray-500 mb-1">
                <span className="font-medium">Provider:</span> {errorDetails.provider}
              </div>
            )}
            {errorDetails.code && (
              <div className="text-xs text-gray-500">
                <span className="font-medium">Code:</span> {errorDetails.code}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 max-w-sm mx-auto">
          <Button
            onClick={handleRetry}
            variant="primary"
            className="w-full"
            size="md"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button
            onClick={handleGoBack}
            variant="secondary"
            className="w-full"
            size="md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full"
            size="md"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Typography variant="body2" className="text-xs text-gray-500 mb-2">
            Still having trouble?
          </Typography>
          <Link 
            to="/login" 
            className="text-xs text-green-600 hover:text-green-700 underline"
          >
            Try a different login method
          </Link>
        </div>
      </div>
    </AuthContainer>
  );
};

export default AuthError;
