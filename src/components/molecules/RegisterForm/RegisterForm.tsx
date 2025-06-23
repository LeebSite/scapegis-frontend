import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Typography } from '../../atoms';
import { RegisterCredentials } from '../../../types';
import { cn } from '../../../utils/cn';

interface RegisterFormProps {
  onSubmit: (credentials: RegisterCredentials) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading = false,
  error,
  className,
}) => {
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  const [errors, setErrors] = useState<Partial<RegisterCredentials>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterCredentials> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

  const handleInputChange = (field: keyof RegisterCredentials) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className={cn('w-full max-w-md', className)}>
      <div className="text-center mb-8">
        <Typography variant="h2" className="text-gray-900 mb-2">
          Create your account
        </Typography>
        <Typography variant="body1" color="gray">
          Join ScapeGIS and start building amazing maps
        </Typography>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <Typography variant="body2" className="text-red-700">
            {error}
          </Typography>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full name"
          type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleInputChange('fullName')}
          error={errors.fullName}
          required
          disabled={loading}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          required
          disabled={loading}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={errors.password}
          required
          disabled={loading}
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          error={errors.confirmPassword}
          required
          disabled={loading}
        />

        <div className="flex items-start">
          <input
            type="checkbox"
            required
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
          />
          <div className="ml-3">
            <Typography variant="body2" color="gray">
              I agree to the{' '}
              <Link to="/terms" className="text-green-600 hover:text-green-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-green-600 hover:text-green-500">
                Privacy Policy
              </Link>
            </Typography>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Typography variant="body2" color="gray">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-green-600 hover:text-green-500 font-medium transition-colors"
          >
            Sign in
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default RegisterForm;
