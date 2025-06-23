import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '../../atoms';
import { cn } from '../../../utils/cn';

interface AuthContainerProps {
  children: React.ReactNode;
  showOAuth?: boolean;
  className?: string;
}

const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  showOAuth = true,
  className,
}) => {
  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-green-50 to-blue-50', className)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <Typography variant="h3" className="text-gray-900 font-bold">
                ScapeGIS
              </Typography>
            </div>
          </Link>
        </div>

        {/* Auth Form Container */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Typography variant="body2" color="gray">
            © 2024 ScapeGIS. All rights reserved.
          </Typography>
          <div className="mt-2 flex justify-center space-x-6">
            <Link
              to="/terms"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/support"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
