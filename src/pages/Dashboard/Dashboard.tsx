import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardTemplate } from '../../components/templates';
import { ProjectsOverview } from '../../components/organisms';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useProjectStore } from '../../stores/projectStore';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Dashboard store
  const {
    recentProjects,
    isLoadingRecent,
    isCreating,
    loadRecentProjects,
    createProject,
    deleteProject,
    duplicateProject
  } = useDashboardStore();

  // Project store
  const { createNewProject } = useProjectStore();

  const user = {
    name: 'Muhammad Ghalib Pradipa',
    email: 'ghalib@scapegis.com',
    workspace: 'Personal Workspace',
    avatar: undefined, // You can add avatar URL here
  };

  // Load recent projects on mount
  useEffect(() => {
    loadRecentProjects().catch((error) => {
      console.error('Failed to load recent projects:', error);
      // Show user-friendly error message
      alert('Failed to load projects. Please check if backend is running on http://localhost:8001');
    });
  }, [loadRecentProjects]);

  const handleProjectClick = async (project: any) => {
    console.log('Opening project:', project);
    try {
      // Navigate to existing project editor
      navigate(`/project/${project.id}`);
    } catch (error) {
      console.error('Failed to open project:', error);
    }
  };

  const handleNewProject = async () => {
    console.log('Creating new project');
    try {
      // Create project via API
      const newProject = await createProject('Untitled Project', 'New WebGIS project');

      // Navigate to new project editor
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      // Fallback to local creation
      const localProject = createNewProject('Untitled Project');
      navigate(`/project/${localProject.id}`);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const handleDuplicateProject = async (projectId: string) => {
    const projectName = prompt('Enter name for duplicated project:');
    if (projectName) {
      try {
        const duplicated = await duplicateProject(projectId, projectName);
        navigate(`/project/${duplicated.id}`);
      } catch (error) {
        console.error('Failed to duplicate project:', error);
        alert('Failed to duplicate project. Please try again.');
      }
    }
  };

  return (
    <DashboardTemplate
      title="Recents"
      subtitle="Your recently accessed projects and maps"
      user={user}
    >
      <ProjectsOverview
        projects={recentProjects}
        isLoading={isLoadingRecent}
        isCreating={isCreating}
        onProjectClick={handleProjectClick}
        onNewProject={handleNewProject}
        onDeleteProject={handleDeleteProject}
        onDuplicateProject={handleDuplicateProject}
      />
    </DashboardTemplate>
  );
};

export default Dashboard;
