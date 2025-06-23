import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContainer } from '../../components/organisms';
import { LoginForm, OAuthSection } from '../../components/molecules';
import { useAuthStore } from '../../stores/authStore';
import { LoginCredentials } from '../../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const {
    login,
    oauthLogin,
    isLoading,
    error,
    isAuthenticated,
    clearError,
  } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      // Navigation will be handled by the useEffect above
    } catch (error) {
      // Error is handled by the store
      console.error('Login failed:', error);
    }
  };

  const handleOAuthLogin = async (providerId: string) => {
    setOauthLoading(providerId);
    try {
      await oauthLogin(providerId);
    } catch (error) {
      console.error(`${providerId} login failed:`, error);
    } finally {
      setOauthLoading(null);
    }
  };



  return (
    <AuthContainer>
      <div className="space-y-6">
        <LoginForm
          onSubmit={handleLogin}
          loading={isLoading}
          error={error}
        />

        <OAuthSection
          onOAuthLogin={handleOAuthLogin}
          loading={isLoading}
          loadingProvider={oauthLoading}
        />
      </div>
    </AuthContainer>
  );
};

export default Login;
