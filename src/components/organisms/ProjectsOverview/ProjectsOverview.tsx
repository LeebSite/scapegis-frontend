import React from 'react';
import { Typography, Button } from '../../atoms';
import { ProjectCard } from '../../molecules';
import { cn } from '../../../utils/cn';

interface Project {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  lastModified?: string;
  updatedAt?: string;
  createdAt?: string;
  mapPreview?: string;
  thumbnail?: string;
  status?: 'active' | 'draft' | 'archived';
  isPublic?: boolean;
  layerCount?: number;
}

interface ProjectsOverviewProps {
  projects?: Project[];
  isLoading?: boolean;
  isCreating?: boolean;
  onProjectClick?: (project: Project) => void;
  onNewProject?: () => void;
  onDeleteProject?: (projectId: string) => void;
  onDuplicateProject?: (projectId: string) => void;
  className?: string;
}

const ProjectsOverview: React.FC<ProjectsOverviewProps> = ({
  projects = [],
  isLoading = false,
  isCreating = false,
  onProjectClick,
  onNewProject,
  onDeleteProject,
  onDuplicateProject,
  className,
}) => {

  // Helper function to format project data for display
  const formatProject = (project: Project) => ({
    ...project,
    title: project.title || project.name || 'Untitled Project',
    lastModified: project.lastModified ||
      (project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() :
       project.createdAt ? new Date(project.createdAt).toLocaleDateString() :
       'Unknown'),
    mapPreview: project.mapPreview || project.thumbnail,
    status: project.status || (project.isPublic ? 'active' : 'draft') as 'active' | 'draft' | 'archived'
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn('p-4 md:p-6', className)}>
        <div className="hidden md:flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <Typography variant="h4" color="gray" className="font-semibold text-xl md:text-2xl">
              Recent Projects
            </Typography>
            <Typography variant="body2" color="secondary" className="mt-1 text-sm md:text-base">
              Loading your projects...
            </Typography>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-48 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className={cn('p-4 md:p-6', className)}>
      {/* Mobile Title Section */}
      <div className="md:hidden mb-4">
        <Typography variant="h4" color="gray" className="font-semibold text-lg">
          Recents
        </Typography>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <Typography variant="h4" color="gray" className="font-semibold text-xl md:text-2xl">
            Recent Projects
          </Typography>
          <Typography variant="body2" color="secondary" className="mt-1 text-sm md:text-base">
            Continue working on your recent projects
          </Typography>
        </div>
        <Button
          variant="primary"
          onClick={onNewProject}
          disabled={isCreating}
          className="flex items-center justify-center space-x-2 w-full sm:w-auto"
          size="sm"
        >
          {isCreating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New project</span>
            </>
          )}
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {projects.map((project) => {
            const formattedProject = formatProject(project);
            return (
              <ProjectCard
                key={project.id}
                id={formattedProject.id}
                title={formattedProject.title}
                description={formattedProject.description}
                lastModified={formattedProject.lastModified}
                status={formattedProject.status}
                mapPreview={formattedProject.mapPreview}
                onClick={() => onProjectClick?.(project)}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-8 md:py-12">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <Typography variant="h5" color="gray" className="font-semibold mb-2 text-lg md:text-xl">
            No projects yet
          </Typography>
          <Typography variant="body1" color="secondary" className="mb-6 max-w-md mx-auto text-sm md:text-base px-4">
            Create your first project to start mapping and analyzing geospatial data with ScapeGIS.
          </Typography>
          <Button
            variant="primary"
            onClick={onNewProject}
            className="flex items-center justify-center space-x-2 mx-auto w-full sm:w-auto max-w-xs"
            size="sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create your first project</span>
          </Button>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      <div className="md:hidden">
        <button
          onClick={onNewProject}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-30"
          aria-label="New project"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProjectsOverview;
