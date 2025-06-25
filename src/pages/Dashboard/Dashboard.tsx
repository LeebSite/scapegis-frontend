import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardTemplate } from '../../components/templates';
import { ProjectsOverview } from '../../components/organisms';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useProjectStore } from '../../stores/projectStore';
import { useAuthStore } from '../../stores/authStore';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showOAuthSuccess, setShowOAuthSuccess] = useState(false);
  const [showOAuthError, setShowOAuthError] = useState(false);
  const [oauthErrorMessage, setOauthErrorMessage] = useState('');

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

  // Auth store
  const { handleOAuthCallback } = useAuthStore();

  // === Ambil user dari localStorage ===
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    if (!accessToken || !userData) {
      navigate('/login', { replace: true });
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  // Handle OAuth callback parameters
  useEffect(() => {
    const oauthSuccess = searchParams.get('oauth_success');
    const provider = searchParams.get('provider');
    const message = searchParams.get('message');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const userId = searchParams.get('user_id');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const avatarUrl = searchParams.get('avatar_url');

    console.log('🔍 Dashboard OAuth Check:', {
      oauthSuccess,
      provider,
      message,
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : null,
      userId,
      email,
      name,
      avatarUrl
    });

    if (oauthSuccess === 'true' && provider && accessToken) {
      console.log(`🚀 Processing OAuth callback for ${provider} with real JWT token`);

      // Show success notification
      setShowOAuthSuccess(true);
      console.log(`✅ Login successful with ${provider}!`);

      // Store real JWT tokens and user data from backend
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      // Create user object from URL parameters
      const userData = {
        id: userId || `user_${Date.now()}`,
        email: decodeURIComponent(email || `user@${provider}.com`),
        name: decodeURIComponent(name || `${provider} User`),
        provider: provider,
        avatar_url: avatarUrl ? decodeURIComponent(avatarUrl) : undefined
      };

      localStorage.setItem('user_data', JSON.stringify(userData));
      console.log('💾 Stored real authentication data:', userData);

      // Handle OAuth callback through auth store with real data
      handleOAuthCallback(provider, true)
        .then(() => {
          console.log('✅ OAuth callback handled successfully with real JWT');
        })
        .catch((error) => {
          console.error('❌ OAuth callback handling failed:', error);
        });

      // Clean URL parameters after a short delay to ensure processing is complete
      setTimeout(() => {
        window.history.replaceState({}, document.title, '/dashboard');
        console.log('🧹 URL parameters cleaned');
      }, 100);

      // Hide success message after 5 seconds
      setTimeout(() => setShowOAuthSuccess(false), 5000);

      setUser(userData);
    }

    // Check for OAuth error
    const oauthError = searchParams.get('oauth_error');
    const errorProvider = searchParams.get('provider');
    const errorMessage = searchParams.get('message');

    if (oauthError === 'true') {
      console.log(`❌ OAuth error for ${errorProvider}:`, errorMessage);
      setShowOAuthError(true);
      setOauthErrorMessage(`${errorProvider} login failed: ${errorMessage || 'Unknown error'}`);

      // Clean URL parameters
      setTimeout(() => {
        window.history.replaceState({}, document.title, '/dashboard');
      }, 100);

      // Hide error message after 8 seconds
      setTimeout(() => setShowOAuthError(false), 8000);
    }
  }, [searchParams, handleOAuthCallback]);

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
      {/* OAuth Success Notification */}
      {showOAuthSuccess && (
        <div className="mx-6 mb-6">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Login successful! Welcome, {user?.name || user?.email || 'User'}.</span>
            </div>
          </div>
        </div>
      )}

      {/* OAuth Error Notification */}
      {showOAuthError && (
        <div className="mx-6 mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <strong>Error!</strong> {oauthErrorMessage}
              </div>
            </div>
          </div>
        </div>
      )}

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
