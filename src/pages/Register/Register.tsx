import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RegisterForm, OAuthSection } from '../../components/molecules';
import { SimpleRegisterCredentials } from '../../components/molecules/RegisterForm/RegisterForm';
import { useAuthStore } from '../../stores/authStore';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const {
    register,
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

  const handleRegister = async (credentials: SimpleRegisterCredentials) => {
    try {
      // Convert simple credentials to full credentials for the API
      const fullCredentials = {
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.password,
        fullName: credentials.email.split('@')[0], // Use email prefix as default name
      };
      await register(fullCredentials);
      // Redirect to email verification page
      navigate(`/email-verification?email=${encodeURIComponent(credentials.email)}`);
    } catch (error) {
      // Error is handled by the store
      console.error('Registration failed:', error);
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
    <div className="min-h-screen bg-white flex flex-col justify-center">
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Auth Form Container - Consistent with login page */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="px-6 py-8">
            <div className="space-y-6">
              <RegisterForm
                onSubmit={handleRegister}
                loading={isLoading}
                error={error}
              />

              {/* Google OAuth Button at the bottom - consistent with login */}
              <OAuthSection
                onOAuthLogin={handleOAuthLogin}
                loading={isLoading}
                loadingProvider={oauthLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
