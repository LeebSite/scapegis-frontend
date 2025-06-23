import axios, { AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for auth
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ProjectResponse {
  id: string;
  name: string;
  description?: string;
  workspace_id: string;
  owner_id: string;
  settings: Record<string, any>;
  bounds?: any;
  center?: any;
  zoom_level: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  layer_count?: number;
  last_accessed?: string;
}

export interface LayerResponse {
  id: string;
  name: string;
  description?: string;
  project_id: string;
  layer_type: 'vector' | 'raster' | 'tile' | 'wms';
  data_source?: string;
  style_config: Record<string, any>;
  is_visible: boolean;
  opacity: number;
  z_index: number;
  bounds?: any;
  created_at: string;
  updated_at: string;
  feature_count?: number;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  workspace_id?: string;
  settings?: Record<string, any>;
  bounds?: any;
  center?: any;
  zoom_level?: number;
  is_public?: boolean;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  id: string;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AxiosResponse<ApiResponse<{
    access_token: string;
    refresh_token: string;
    user: any;
  }>>> => {
    return apiClient.post('/api/v1/auth/login', { email, password });
  },

  register: async (email: string, password: string, full_name: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    return apiClient.post('/api/v1/auth/register', { email, password, full_name });
  },

  logout: async (): Promise<AxiosResponse<ApiResponse<any>>> => {
    return apiClient.post('/api/v1/auth/logout');
  },

  refreshToken: async (refresh_token: string): Promise<AxiosResponse<ApiResponse<{
    access_token: string;
  }>>> => {
    return apiClient.post('/api/v1/auth/refresh', { refresh_token });
  },

  getProfile: async (): Promise<AxiosResponse<ApiResponse<any>>> => {
    return apiClient.get('/api/v1/auth/profile');
  },
};

// Helper function to get API path (mock or real)
const getApiPath = (path: string) => {
  if (USE_MOCK_API && path.startsWith('/api/v1/projects')) {
    return path.replace('/api/v1/projects', '/api/v1/projects-mock');
  }
  if (USE_MOCK_API && path.startsWith('/api/v1/layers')) {
    return path.replace('/api/v1/layers', '/api/v1/layers-mock');
  }
  return path;
};

// Projects API
export const projectsApi = {
  getAll: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    workspace_id?: string;
  }): Promise<AxiosResponse<ApiResponse<PaginatedResponse<ProjectResponse>>>> => {
    return apiClient.get(getApiPath('/api/v1/projects'), { params });
  },

  getById: async (id: string): Promise<AxiosResponse<ApiResponse<ProjectResponse>>> => {
    return apiClient.get(getApiPath(`/api/v1/projects/${id}`));
  },

  create: async (data: CreateProjectRequest): Promise<AxiosResponse<ApiResponse<ProjectResponse>>> => {
    return apiClient.post(getApiPath('/api/v1/projects'), data);
  },

  update: async (id: string, data: UpdateProjectRequest): Promise<AxiosResponse<ApiResponse<ProjectResponse>>> => {
    return apiClient.put(getApiPath(`/api/v1/projects/${id}`), data);
  },

  delete: async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    return apiClient.delete(getApiPath(`/api/v1/projects/${id}`));
  },

  getRecent: async (limit: number = 10): Promise<AxiosResponse<ApiResponse<ProjectResponse[]>>> => {
    return apiClient.get(getApiPath(`/api/v1/projects/recent?limit=${limit}`));
  },

  duplicate: async (id: string, name: string): Promise<AxiosResponse<ApiResponse<ProjectResponse>>> => {
    return apiClient.post(getApiPath(`/api/v1/projects/${id}/duplicate`), { name });
  },
};

// Layers API
export const layersApi = {
  getByProject: async (projectId: string): Promise<AxiosResponse<ApiResponse<LayerResponse[]>>> => {
    return apiClient.get(getApiPath(`/api/v1/layers?project_id=${projectId}`));
  },

  getById: async (id: string): Promise<AxiosResponse<ApiResponse<LayerResponse>>> => {
    return apiClient.get(getApiPath(`/api/v1/layers/${id}`));
  },

  create: async (data: {
    name: string;
    description?: string;
    project_id: string;
    layer_type: string;
    data_source?: string;
    style_config?: Record<string, any>;
  }): Promise<AxiosResponse<ApiResponse<LayerResponse>>> => {
    return apiClient.post(getApiPath('/api/v1/layers'), data);
  },

  update: async (id: string, data: Partial<LayerResponse>): Promise<AxiosResponse<ApiResponse<LayerResponse>>> => {
    return apiClient.put(getApiPath(`/api/v1/layers/${id}`), data);
  },

  delete: async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    return apiClient.delete(getApiPath(`/api/v1/layers/${id}`));
  },

  uploadFile: async (layerId: string, file: File): Promise<AxiosResponse<ApiResponse<any>>> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(getApiPath(`/api/v1/layers/${layerId}/upload`), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Workspaces API
export const workspacesApi = {
  getAll: async (): Promise<AxiosResponse<ApiResponse<any[]>>> => {
    return apiClient.get('/api/v1/workspaces');
  },

  getCurrent: async (): Promise<AxiosResponse<ApiResponse<any>>> => {
    return apiClient.get('/api/v1/workspaces/current');
  },
};

// File Upload API
export const filesApi = {
  upload: async (file: File, folder?: string): Promise<AxiosResponse<ApiResponse<{
    url: string;
    filename: string;
    size: number;
  }>>> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }
    return apiClient.post('/api/v1/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
