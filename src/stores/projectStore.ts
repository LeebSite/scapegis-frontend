import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { projectsApi, layersApi } from '../services/api';

export interface Layer {
  id: string;
  name: string;
  type: 'base' | 'vector' | 'raster' | 'point';
  visible: boolean;
  opacity: number;
  source?: string;
  style?: any;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  layers: Layer[];
  mapCenter: [number, number];
  mapZoom: number;
  bounds?: [[number, number], [number, number]];
}

interface ProjectState {
  // Current project
  currentProject: Project | null;
  
  // Project list
  projects: Project[];
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  
  // Actions
  setCurrentProject: (project: Project | null) => void;
  createNewProject: (name?: string) => Project;
  updateProject: (updates: Partial<Project>) => void;
  saveProject: () => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  deleteProject: (projectId: string) => void;
  
  // Layer actions
  addLayer: (layer: Omit<Layer, 'id'>) => void;
  updateLayer: (layerId: string, updates: Partial<Layer>) => void;
  removeLayer: (layerId: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  
  // Map actions
  updateMapView: (center: [number, number], zoom: number) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

const createDefaultProject = (name: string = 'Untitled Project'): Project => ({
  id: generateId(),
  name,
  description: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  layers: [
    {
      id: 'base-layer',
      name: 'Base Map',
      type: 'base',
      visible: true,
      opacity: 1,
      source: 'openstreetmap'
    }
  ],
  mapCenter: [0, 0],
  mapZoom: 2,
});

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentProject: null,
      projects: [],
      isLoading: false,
      isSaving: false,

      // Project actions
      setCurrentProject: (project) => {
        set({ currentProject: project });
      },

      createNewProject: (name) => {
        const newProject = createDefaultProject(name);
        set((state) => ({
          currentProject: newProject,
          projects: [...state.projects, newProject]
        }));
        return newProject;
      },

      updateProject: (updates) => {
        const { currentProject } = get();
        if (!currentProject) return;

        const updatedProject = {
          ...currentProject,
          ...updates,
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          currentProject: updatedProject,
          projects: state.projects.map(p => 
            p.id === updatedProject.id ? updatedProject : p
          )
        }));
      },

      saveProject: async () => {
        const { currentProject } = get();
        if (!currentProject) return;

        set({ isSaving: true });

        try {
          const response = await projectsApi.update(currentProject.id, {
            id: currentProject.id,
            name: currentProject.name,
            description: currentProject.description,
            settings: {
              layers: currentProject.layers,
              mapCenter: currentProject.mapCenter,
              mapZoom: currentProject.mapZoom,
              bounds: currentProject.bounds
            }
          });

          console.log('Project saved:', response.data);
          set({ isSaving: false });
        } catch (error) {
          console.error('Failed to save project:', error);
          set({ isSaving: false });
          throw error;
        }
      },

      loadProject: async (projectId) => {
        set({ isLoading: true });

        try {
          const response = await projectsApi.getById(projectId);
          const projectData = response.data.data;

          // Convert API response to internal format
          const project: Project = {
            id: projectData.id,
            name: projectData.name,
            description: projectData.description || '',
            createdAt: projectData.created_at,
            updatedAt: projectData.updated_at,
            layers: [], // Will be loaded separately
            mapCenter: projectData.settings?.mapCenter || [0, 0],
            mapZoom: projectData.zoom_level || 2,
            bounds: projectData.bounds
          };

          set({ currentProject: project, isLoading: false });

          // Load layers for this project
          const layersResponse = await layersApi.getByProject(projectId);
          const layers = layersResponse.data.data.map(layer => ({
            id: layer.id,
            name: layer.name,
            type: layer.layer_type as 'base' | 'vector' | 'raster' | 'point',
            visible: layer.is_visible,
            opacity: layer.opacity,
            source: layer.data_source,
            style: layer.style_config
          }));

          set(state => ({
            currentProject: state.currentProject ? {
              ...state.currentProject,
              layers
            } : null
          }));

        } catch (error) {
          console.error('Failed to load project:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      deleteProject: (projectId) => {
        set((state) => ({
          projects: state.projects.filter(p => p.id !== projectId),
          currentProject: state.currentProject?.id === projectId ? null : state.currentProject
        }));
      },

      // Layer actions
      addLayer: (layerData) => {
        const { currentProject } = get();
        if (!currentProject) return;

        const newLayer: Layer = {
          ...layerData,
          id: generateId()
        };

        const updatedProject = {
          ...currentProject,
          layers: [...currentProject.layers, newLayer],
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          currentProject: updatedProject,
          projects: state.projects.map(p => 
            p.id === updatedProject.id ? updatedProject : p
          )
        }));
      },

      updateLayer: (layerId, updates) => {
        const { currentProject } = get();
        if (!currentProject) return;

        const updatedProject = {
          ...currentProject,
          layers: currentProject.layers.map(layer =>
            layer.id === layerId ? { ...layer, ...updates } : layer
          ),
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          currentProject: updatedProject,
          projects: state.projects.map(p => 
            p.id === updatedProject.id ? updatedProject : p
          )
        }));
      },

      removeLayer: (layerId) => {
        const { currentProject } = get();
        if (!currentProject) return;

        const updatedProject = {
          ...currentProject,
          layers: currentProject.layers.filter(layer => layer.id !== layerId),
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          currentProject: updatedProject,
          projects: state.projects.map(p => 
            p.id === updatedProject.id ? updatedProject : p
          )
        }));
      },

      toggleLayerVisibility: (layerId) => {
        const { updateLayer } = get();
        const { currentProject } = get();
        if (!currentProject) return;

        const layer = currentProject.layers.find(l => l.id === layerId);
        if (layer) {
          updateLayer(layerId, { visible: !layer.visible });
        }
      },

      reorderLayers: (fromIndex, toIndex) => {
        const { currentProject } = get();
        if (!currentProject) return;

        const layers = [...currentProject.layers];
        const [movedLayer] = layers.splice(fromIndex, 1);
        layers.splice(toIndex, 0, movedLayer);

        const updatedProject = {
          ...currentProject,
          layers,
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          currentProject: updatedProject,
          projects: state.projects.map(p => 
            p.id === updatedProject.id ? updatedProject : p
          )
        }));
      },

      // Map actions
      updateMapView: (center, zoom) => {
        const { updateProject } = get();
        updateProject({ mapCenter: center, mapZoom: zoom });
      },
    }),
    {
      name: 'project-store',
    }
  )
);
