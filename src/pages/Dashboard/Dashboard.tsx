import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardTemplate } from '../../components/templates';
import { ProjectsOverview } from '../../components/organisms';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = {
    name: 'Muhammad Ghalib Pradipa',
    email: 'ghalib@scapegis.com',
    workspace: 'Personal Workspace',
    avatar: undefined, // You can add avatar URL here
  };

  const handleProjectClick = (project: any) => {
    console.log('Opening project:', project);
    // Navigate to existing project editor
    navigate(`/project/${project.id}`);
  };

  const handleNewProject = () => {
    console.log('Creating new project');
    // Navigate to new project editor
    navigate('/project/new');
  };

  return (
    <DashboardTemplate
      title="Recents"
      subtitle="Your recently accessed projects and maps"
      user={user}
    >
      <ProjectsOverview
        onProjectClick={handleProjectClick}
        onNewProject={handleNewProject}
      />
    </DashboardTemplate>
  );
};

export default Dashboard;
