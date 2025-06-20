import React from 'react';
import { NavigationItem as NavigationItemType } from '../../../types';
import { cn } from '../../../utils/cn';

interface NavigationItemProps extends NavigationItemType {
  onClick?: () => void;
  className?: string;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  label,
  href,
  active = false,
  onClick,
  className,
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-100',
        active 
          ? 'text-primary-500 bg-primary-50' 
          : 'text-gray-700 hover:text-primary-500',
        className
      )}
    >
      {label}
    </a>
  );
};

export default NavigationItem;
