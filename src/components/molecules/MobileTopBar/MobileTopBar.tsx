import React from 'react';
import { Typography } from '../../atoms';
import { cn } from '../../../utils/cn';

interface MobileTopBarProps {
  title: string;
  onMenuClick?: () => void;
  className?: string;
}

const MobileTopBar: React.FC<MobileTopBarProps> = ({
  title,
  onMenuClick,
  className,
}) => {
  return (
    <div className={cn(
      'flex items-center justify-between p-4 bg-white border-b border-gray-200 md:hidden',
      className
    )}>
      {/* Menu Button */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo and Title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
          <Typography variant="body2" color="white" className="font-bold text-sm">
            SG
          </Typography>
        </div>
        <Typography variant="h6" color="gray" className="font-bold">
          ScapeGIS
        </Typography>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MobileTopBar;
