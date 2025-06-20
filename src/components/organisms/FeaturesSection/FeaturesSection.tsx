import React from 'react';
import { Typography } from '../../atoms';
import { FeatureCard } from '../../molecules';
import { FeaturesSectionProps } from '../../../types';
import { cn } from '../../../utils/cn';

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title,
  subtitle,
  features,
  className,
}) => {
  return (
    <section className={cn(
      'py-20 lg:py-32 bg-white',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {subtitle && (
            <Typography variant="body1" color="primary" className="font-semibold mb-4">
              {subtitle}
            </Typography>
          )}
          <Typography variant="h2" color="gray" className="mb-6">
            {title}
          </Typography>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className={feature.className}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
