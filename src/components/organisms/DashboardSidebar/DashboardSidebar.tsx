import React, { useState } from 'react';
import { Typography, Avatar, Badge } from '../../atoms';
import { SidebarItem } from '../../molecules';
import { cn } from '../../../utils/cn';

interface DashboardSidebarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    workspace: string;
  };
  activeItem?: string;
  onItemClick?: (item: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  className?: string;
  onLogout?: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  user,
  activeItem = 'recents',
  onItemClick,
  isOpen = false,
  onClose,
  isMobile = false,
  className,
  onLogout,
}) => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };
  // Provide safe defaults for user data
  const safeUser = user || {
    name: 'Loading...',
    email: 'loading@example.com',
    workspace: 'Personal Workspace'
  };
  const menuItems = [
    {
      id: 'new-project',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      label: 'New project',
      isAction: true,
    },
    {
      id: 'recents',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Recents',
    },
    {
      id: 'projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      label: 'Projects',
    },
    {
      id: 'shared-datasets',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      label: 'Shared Datasets',
    },
  ];

  const settingsItems = [
    {
      id: 'workspace-settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Workspace Settings',
    },
    {
      id: 'team-members',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      label: 'Team Members',
    },
    {
      id: 'billing',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      label: 'Billing',
    },
  ];

  return (
    <div className={cn(
      'w-64 bg-white border-r border-gray-200 flex flex-col h-full transition-transform duration-300 ease-in-out',
      // Mobile styles
      isMobile ? [
        'fixed top-0 left-0 z-50 transform',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ] : 'relative',
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Typography variant="body2" color="white" className="font-bold">
                SG
              </Typography>
            </div>
            <Typography variant="h5" color="gray" className="font-bold">
              ScapeGIS
            </Typography>
          </div>

          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* User Workspace */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar name={safeUser.name} src={safeUser.avatar} size="sm" />
          <div className="flex-1 min-w-0">
            <Typography variant="body2" color="gray" className="font-medium truncate">
              {safeUser.workspace}
            </Typography>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeItem === item.id}
            onClick={() => onItemClick?.(item.id)}
            className={item.isAction ? 'text-primary-600 hover:bg-primary-50' : ''}
          />
        ))}
      </div>

      {/* Settings Section */}
      <div className="border-t border-gray-200 p-4 space-y-1">
        {settingsItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeItem === item.id}
            onClick={() => onItemClick?.(item.id)}
          />
        ))}
      </div>

      {/* Organization Plan */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <Typography variant="body2" color="secondary">
              Organization Plan
            </Typography>
          </div>
          <Badge variant="warning" size="sm">
            On trial
          </Badge>
        </div>
      </div>

      {/* User Profile */}
      <div className="relative p-4 border-t border-gray-200">
        {isProfileDropdownOpen && (
          <div className="absolute bottom-full mb-2 w-full left-0 bg-white rounded-md shadow-lg z-10">
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account settings</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Privacy Policy</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Terms of Service</a>
            <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
          </div>
        )}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={toggleProfileDropdown}>
          <Avatar name={safeUser.name} src={safeUser.avatar} size="sm" />
          <div className="flex-1 min-w-0">
            <Typography variant="body2" color="gray" className="font-medium truncate">
              {safeUser.name}
            </Typography>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
