import React from 'react';
import { Typography, Badge } from '../../atoms';
import { cn } from '../../../utils/cn';

interface ProjectCardProps {
  id: string;
  title: string;
  description?: string;
  lastModified: string;
  mapPreview?: string;
  status?: 'active' | 'draft' | 'archived';
  onClick?: () => void;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  lastModified,
  mapPreview,
  status = 'active',
  onClick,
  className,
}) => {
  const statusColors = {
    active: 'success',
    draft: 'warning',
    archived: 'default',
  } as const;

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-3 md:p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer group',
        className
      )}
    >
      {/* Map Preview */}
      <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
        {mapPreview ? (
          <img
            src={mapPreview}
            alt={`${title} map preview`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Typography variant="h6" color="gray" className="font-semibold line-clamp-1 text-sm md:text-base">
            {title}
          </Typography>
          <Badge variant={statusColors[status]} size="sm" className="flex-shrink-0">
            {status}
          </Badge>
        </div>

        {description && (
          <Typography variant="body2" color="secondary" className="line-clamp-2 text-xs md:text-sm">
            {description}
          </Typography>
        )}

        <Typography variant="caption" color="secondary" className="text-xs">
          Last modified: {lastModified}
        </Typography>
      </div>
    </div>
  );
};

export default ProjectCard;
