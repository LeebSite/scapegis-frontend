import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContainer } from '../../components/organisms';
import { Button, Input, Typography } from '../../components/atoms';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatus('idle');

    try {
      // Simulate API call to send reset password email
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send reset email');
        setStatus('error');
      }
    } catch (error) {
      console.error('Failed to send reset email:', error);
      setError('Something went wrong. Please try again.');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <AuthContainer>
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* Success Message */}
          <Typography variant="h2" className="text-gray-900 mb-3 text-2xl font-semibold">
            Check your email
          </Typography>
          
          <Typography variant="body1" color="gray" className="text-sm mb-6 leading-relaxed">
            We've sent a password reset link to{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </Typography>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <Typography variant="body2" className="text-gray-700 text-sm">
              <strong>Next steps:</strong>
            </Typography>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              <li>• Click the reset link in your email</li>
              <li>• Create a new password</li>
              <li>• The link will expire in 1 hour</li>
            </ul>
          </div>

          {/* Back to Login */}
          <Link
            to="/login"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to sign in
          </Link>
        </div>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <div>
        {/* Back Button */}
        <Link
          to="/login"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>

        {/* Header */}
        <div className="mb-8">
          <Typography variant="h2" className="text-gray-900 mb-2 text-2xl font-semibold">
            Forgot your password?
          </Typography>
          <Typography variant="body1" color="gray" className="text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
        </div>

        {/* Error Message */}
        {status === 'error' && error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
            <Typography variant="body2" className="text-red-700 text-sm">
              {error}
            </Typography>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={setEmail}
            error={error && !email ? error : undefined}
            required
            disabled={isLoading}
            className="w-full"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            disabled={isLoading}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>
      </div>
    </AuthContainer>
  );
};

export default ForgotPassword;
