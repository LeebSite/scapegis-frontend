import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Typography } from '../../atoms';
import { cn } from '../../../utils/cn';

// Simplified register credentials for minimalist design
export interface SimpleRegisterCredentials {
  email: string;
  password: string;
}

interface RegisterFormProps {
  onSubmit: (credentials: SimpleRegisterCredentials) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading = false,
  error,
  className,
}) => {
  const [formData, setFormData] = useState<SimpleRegisterCredentials>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<SimpleRegisterCredentials>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<SimpleRegisterCredentials> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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

  const handleInputChange = (field: keyof SimpleRegisterCredentials) => (value: string) => {
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
          Create your account
        </Typography>
        <Typography variant="body1" color="gray" className="text-sm">
          Welcome to ScapeGIS
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
          placeholder="Password (8+ characters)"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={errors.password}
          required
          disabled={loading}
          className="w-full"
        />

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
              Creating account...
            </div>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Typography variant="body2" color="gray" className="text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Sign in here
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default RegisterForm;
