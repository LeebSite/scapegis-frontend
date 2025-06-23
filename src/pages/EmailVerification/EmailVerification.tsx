import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthContainer } from '../../components/organisms';
import { Button, Typography } from '../../components/atoms';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const email = searchParams.get('email') || 'your email';

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendStatus('idle');

    try {
      // Simulate API call to resend verification email
      const response = await fetch('/api/resend-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResendStatus('success');
      } else {
        setResendStatus('error');
      }
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      setResendStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthContainer>
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <Mail className="w-8 h-8 text-green-600" />
        </div>

        {/* Main Message */}
        <Typography variant="h2" className="text-gray-900 mb-3 text-2xl font-semibold">
          Check your email
        </Typography>
        
        <Typography variant="body1" color="gray" className="text-sm mb-6 leading-relaxed">
          We've sent a verification link to{' '}
          <span className="font-medium text-gray-900">{email}</span>
        </Typography>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <Typography variant="body2" className="text-gray-700 text-sm">
            <strong>Next steps:</strong>
          </Typography>
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            <li>• Click the verification link in your email</li>
            <li>• Check your spam folder if you don't see it</li>
            <li>• The link will expire in 24 hours</li>
          </ul>
        </div>

        {/* Resend Status Messages */}
        {resendStatus === 'success' && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <Typography variant="body2" className="text-green-700 text-sm">
              Verification email sent successfully!
            </Typography>
          </div>
        )}

        {resendStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
            <Typography variant="body2" className="text-red-700 text-sm">
              Failed to send email. Please try again.
            </Typography>
          </div>
        )}

        {/* Resend Button */}
        <Button
          onClick={handleResendEmail}
          loading={isResending}
          disabled={isResending || resendStatus === 'success'}
          variant="outline"
          className="w-full mb-4 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {isResending ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
              Sending...
            </div>
          ) : resendStatus === 'success' ? (
            'Email sent!'
          ) : (
            'Resend verification email'
          )}
        </Button>

        {/* Back to Login */}
        <div className="text-center">
          <Typography variant="body2" color="gray" className="text-sm">
            <Link
              to="/login"
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Back to sign in
            </Link>
          </Typography>
        </div>
      </div>
    </AuthContainer>
  );
};

export default EmailVerification;
