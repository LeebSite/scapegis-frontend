import React from 'react';
import { cn } from '../../../utils/cn';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  badge?: string | number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  onClick,
  className,
  badge,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
        active
          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        className
      )}
    >
      <span className="mr-3 flex-shrink-0">
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className={cn(
          'ml-2 px-2 py-0.5 text-xs font-medium rounded-full',
          active
            ? 'bg-primary-100 text-primary-700'
            : 'bg-gray-200 text-gray-600'
        )}>
          {badge}
        </span>
      )}
    </button>
  );
};

export default SidebarItem;
