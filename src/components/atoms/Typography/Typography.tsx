import React from 'react';
import { TypographyProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  color = 'gray',
  className,
  as,
  style,
  ...props
}) => {
  const variants = {
    h1: 'text-5xl md:text-6xl font-bold tracking-tight',
    h2: 'text-4xl md:text-5xl font-bold tracking-tight',
    h3: 'text-3xl md:text-4xl font-bold tracking-tight',
    h4: 'text-2xl md:text-3xl font-semibold tracking-tight',
    h5: 'text-xl md:text-2xl font-semibold tracking-tight',
    h6: 'text-lg md:text-xl font-semibold tracking-tight',
    body1: 'text-base md:text-lg leading-relaxed',
    body2: 'text-sm md:text-base leading-relaxed',
    caption: 'text-xs md:text-sm leading-normal',
  };

  const colors = {
    primary: 'text-primary-500',
    secondary: 'text-gray-600',
    gray: 'text-gray-800',
    white: 'text-white',
    black: 'text-black',
  };

  const defaultTags = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    body1: 'p',
    body2: 'p',
    caption: 'span',
  };

  const Component = as || (defaultTags[variant] as keyof React.JSX.IntrinsicElements);

  return React.createElement(
    Component,
    {
      className: cn(
        variants[variant],
        colors[color],
        className
      ),
      style,
      ...props,
    },
    children
  );
};

export default Typography;
