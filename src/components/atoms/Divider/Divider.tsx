import React from 'react';
import { cn } from '../../../utils/cn';

interface DividerProps {
  text?: string;
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ text, className }) => {
  return (
    <div className={cn('relative flex items-center', className)}>
      <div className="flex-grow border-t border-gray-300"></div>
      {text && (
        <span className="flex-shrink mx-4 text-sm text-gray-500 bg-white px-2">
          {text}
        </span>
      )}
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};

export default Divider;
