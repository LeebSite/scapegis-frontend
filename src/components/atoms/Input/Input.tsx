import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { InputProps } from '../../../types';

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full px-4 py-3 border rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
            'placeholder:text-gray-400',
            {
              'border-gray-300 hover:border-gray-400': !error && !isFocused,
              'border-red-500 focus:ring-red-500': error,
              'bg-gray-50 cursor-not-allowed': disabled,
              'bg-white': !disabled,
            }
          )}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
