// Common types for the WebGIS application
import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption';
  color?: 'primary' | 'secondary' | 'gray' | 'white' | 'black';
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface HeaderProps {
  navigationItems: NavigationItem[];
  logo?: React.ReactNode;
  className?: string;
}

export interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export interface FeaturesSectionProps {
  title: string;
  subtitle?: string;
  features: FeatureCardProps[];
  className?: string;
}

// User and Auth types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  workspace?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface OAuthProvider {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
}

// Form Input types
export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}
