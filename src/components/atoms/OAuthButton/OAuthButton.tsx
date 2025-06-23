import React from 'react';
import { cn } from '../../../utils/cn';

interface OAuthButtonProps {
  provider: {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    color: string;
  };
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  onClick,
  disabled = false,
  loading = false,
  className,
}) => {
  const IconComponent = provider.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg',
        'text-sm font-medium text-gray-700 bg-white hover:bg-gray-50',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
        'transition-all duration-200 transform hover:scale-[1.02]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        className
      )}
      style={{
        borderColor: disabled ? undefined : provider.color + '20',
      }}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
      ) : (
        <>
          <IconComponent 
            className="h-5 w-5 mr-3" 
            style={{ color: provider.color }}
          />
          <span>Continue with {provider.name}</span>
        </>
      )}
    </button>
  );
};

export default OAuthButton;
