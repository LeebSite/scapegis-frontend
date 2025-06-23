// Mock API for testing when backend is not ready
export const mockProjects = [
  {
    id: 'mock-1',
    name: 'Sample Project 1',
    description: 'A sample WebGIS project',
    workspace_id: 'workspace-1',
    owner_id: 'user-1',
    settings: { mapCenter: [0, 0], mapZoom: 2 },
    zoom_level: 2,
    is_public: false,
    layer_count: 2,
    last_accessed: new Date().toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-2',
    name: 'Urban Planning Project',
    description: 'City development analysis',
    workspace_id: 'workspace-1',
    owner_id: 'user-1',
    settings: { mapCenter: [-74.006, 40.7128], mapZoom: 10 },
    zoom_level: 10,
    is_public: true,
    layer_count: 5,
    last_accessed: new Date().toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date().toISOString()
  }
];

export const mockLayers = [
  {
    id: 'layer-1',
    name: 'Base Map',
    description: 'OpenStreetMap base layer',
    project_id: 'mock-1',
    layer_type: 'base',
    data_source: 'openstreetmap',
    style_config: {},
    is_visible: true,
    opacity: 1.0,
    z_index: 0,
    feature_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'layer-2',
    name: 'Points of Interest',
    description: 'Important locations',
    project_id: 'mock-1',
    layer_type: 'point',
    data_source: null,
    style_config: { color: '#ff0000', size: 8 },
    is_visible: true,
    opacity: 0.8,
    z_index: 1,
    feature_count: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockApiResponses = {
  '/api/v1/projects/recent': {
    status: 'success',
    data: mockProjects,
    message: 'Recent projects retrieved successfully (MOCK DATA)'
  },
  '/api/v1/projects': {
    status: 'success',
    data: {
      items: mockProjects,
      total: mockProjects.length,
      page: 1,
      size: 20,
      pages: 1
    },
    message: 'Projects retrieved successfully (MOCK DATA)'
  },
  '/api/v1/layers': {
    status: 'success',
    data: mockLayers,
    message: 'Layers retrieved successfully (MOCK DATA)'
  }
};
