import React from 'react';
import { Typography } from '../../atoms';
import { FeatureCardProps } from '../../../types';
import { cn } from '../../../utils/cn';

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
}) => {
  return (
    <div className={cn(
      'bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group',
      className
    )}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors duration-300">
          {icon}
        </div>
        <Typography variant="h5" color="gray" className="font-semibold">
          {title}
        </Typography>
        <Typography variant="body2" color="secondary" className="leading-relaxed">
          {description}
        </Typography>
      </div>
    </div>
  );
};

export default FeatureCard;
