import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { projectsApi, ProjectResponse } from '../services/api';

export interface DashboardProject {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  lastAccessed?: string;
  layerCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DashboardState {
  // Projects
  recentProjects: DashboardProject[];
  allProjects: DashboardProject[];
  
  // Loading states
  isLoadingRecent: boolean;
  isLoadingAll: boolean;
  isCreating: boolean;
  
  // Search & filters
  searchQuery: string;
  filterType: 'all' | 'recent' | 'public' | 'private';
  
  // Actions
  loadRecentProjects: () => Promise<void>;
  loadAllProjects: (params?: { search?: string; page?: number }) => Promise<void>;
  createProject: (name: string, description?: string) => Promise<DashboardProject>;
  deleteProject: (projectId: string) => Promise<void>;
  duplicateProject: (projectId: string, newName: string) => Promise<DashboardProject>;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: 'all' | 'recent' | 'public' | 'private') => void;
  refreshProjects: () => Promise<void>;
}

const convertApiProject = (apiProject: ProjectResponse): DashboardProject => ({
  id: apiProject.id,
  name: apiProject.name,
  description: apiProject.description,
  lastAccessed: apiProject.last_accessed,
  layerCount: apiProject.layer_count || 0,
  isPublic: apiProject.is_public,
  createdAt: apiProject.created_at,
  updatedAt: apiProject.updated_at,
  thumbnail: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/0,0,1/300x200?access_token=pk.example`
});

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      // Initial state
      recentProjects: [],
      allProjects: [],
      isLoadingRecent: false,
      isLoadingAll: false,
      isCreating: false,
      searchQuery: '',
      filterType: 'all',

      // Load recent projects
      loadRecentProjects: async () => {
        set({ isLoadingRecent: true });
        
        try {
          const response = await projectsApi.getRecent(6);
          const projects = response.data.data.map(convertApiProject);
          
          set({ 
            recentProjects: projects,
            isLoadingRecent: false 
          });
        } catch (error) {
          console.error('Failed to load recent projects:', error);
          set({ isLoadingRecent: false });
          throw error;
        }
      },

      // Load all projects with pagination and search
      loadAllProjects: async (params = {}) => {
        set({ isLoadingAll: true });
        
        try {
          const response = await projectsApi.getAll({
            page: params.page || 1,
            size: 20,
            search: params.search || get().searchQuery
          });
          
          const projects = response.data.data.items.map(convertApiProject);
          
          set({ 
            allProjects: projects,
            isLoadingAll: false 
          });
        } catch (error) {
          console.error('Failed to load all projects:', error);
          set({ isLoadingAll: false });
          throw error;
        }
      },

      // Create new project
      createProject: async (name: string, description?: string) => {
        set({ isCreating: true });
        
        try {
          const response = await projectsApi.create({
            name,
            description,
            settings: {
              mapCenter: [0, 0],
              mapZoom: 2
            },
            is_public: false
          });
          
          const newProject = convertApiProject(response.data.data);
          
          set(state => ({
            recentProjects: [newProject, ...state.recentProjects].slice(0, 6),
            allProjects: [newProject, ...state.allProjects],
            isCreating: false
          }));
          
          return newProject;
        } catch (error) {
          console.error('Failed to create project:', error);
          set({ isCreating: false });
          throw error;
        }
      },

      // Delete project
      deleteProject: async (projectId: string) => {
        try {
          await projectsApi.delete(projectId);
          
          set(state => ({
            recentProjects: state.recentProjects.filter(p => p.id !== projectId),
            allProjects: state.allProjects.filter(p => p.id !== projectId)
          }));
        } catch (error) {
          console.error('Failed to delete project:', error);
          throw error;
        }
      },

      // Duplicate project
      duplicateProject: async (projectId: string, newName: string) => {
        try {
          const response = await projectsApi.duplicate(projectId, newName);
          const duplicatedProject = convertApiProject(response.data.data);
          
          set(state => ({
            recentProjects: [duplicatedProject, ...state.recentProjects].slice(0, 6),
            allProjects: [duplicatedProject, ...state.allProjects]
          }));
          
          return duplicatedProject;
        } catch (error) {
          console.error('Failed to duplicate project:', error);
          throw error;
        }
      },

      // Set search query
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      // Set filter type
      setFilterType: (type: 'all' | 'recent' | 'public' | 'private') => {
        set({ filterType: type });
      },

      // Refresh all projects
      refreshProjects: async () => {
        const { loadRecentProjects, loadAllProjects } = get();
        await Promise.all([
          loadRecentProjects(),
          loadAllProjects()
        ]);
      }
    }),
    {
      name: 'dashboard-store',
    }
  )
);
