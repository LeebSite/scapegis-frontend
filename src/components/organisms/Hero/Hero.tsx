import React from 'react';
import { Button, Typography } from '../../atoms';
import { HeroProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  className,
}) => {
  return (
    <section className={cn(
      'relative bg-gradient-to-br from-gray-50 via-white to-primary-50 py-20 lg:py-32 overflow-hidden',
      className
    )}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12">
        <div className="w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
      </div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12">
        <div className="w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            {subtitle}
          </div>

          {/* Main heading */}
          <Typography 
            variant="h1" 
            color="gray" 
            className="mb-6 animate-slide-up"
          >
            {title}
          </Typography>

          {/* Description */}
          <Typography 
            variant="body1" 
            color="secondary" 
            className="mb-10 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            {description}
          </Typography>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {primaryAction && (
              <Button
                variant="primary"
                size="lg"
                onClick={primaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {primaryAction.label}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="outline"
                size="lg"
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>

          {/* Stats or social proof */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <Typography variant="h3" color="primary" className="font-bold">
                10K+
              </Typography>
              <Typography variant="body2" color="secondary">
                Active Users
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h3" color="primary" className="font-bold">
                50M+
              </Typography>
              <Typography variant="body2" color="secondary">
                Maps Created
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h3" color="primary" className="font-bold">
                99.9%
              </Typography>
              <Typography variant="body2" color="secondary">
                Uptime
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
