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
    <div className={cn('min-h-screen bg-white flex flex-col justify-center', className)}>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link to="/" className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
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
              <Typography variant="h3" className="text-gray-900 font-semibold text-xl">
                ScapeGIS
              </Typography>
            </div>
          </Link>
        </div>

        {/* Auth Form Container */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="px-6 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
