import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Typography } from '../../atoms';
import { LoginCredentials } from '../../../types';
import { cn } from '../../../utils/cn';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  error,
  className,
}) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof LoginCredentials) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className={cn('w-full max-w-sm', className)}>
      <div className="text-center mb-8">
        <Typography variant="h2" className="text-gray-900 mb-2 text-2xl font-semibold">
          Welcome back
        </Typography>
        <Typography variant="body1" color="gray" className="text-sm">
          Sign in to your account
        </Typography>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
          <Typography variant="body2" className="text-red-700 text-sm">
            {error}
          </Typography>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          required
          disabled={loading}
          className="w-full"
        />

        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={errors.password}
          required
          disabled={loading}
          className="w-full"
        />

        <div className="flex items-center justify-between text-sm">
          <Link
            to="/forgot-password"
            className="text-green-600 hover:text-green-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={loading}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Typography variant="body2" color="gray" className="text-sm">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Sign up here
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default LoginForm;
