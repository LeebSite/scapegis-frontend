import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authApi } from '../services/api';
import { User, LoginCredentials, RegisterCredentials } from '../types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<{ email: string } | void>;
  logout: () => Promise<void>;
  oauthLogin: (provider: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Login action
        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await authApi.login(credentials.email, credentials.password);
            const { access_token, refresh_token, user } = response.data.data;

            // Store tokens
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            set({
              isLoading: false,
              error: errorMessage,
              isAuthenticated: false,
              user: null,
            });
            throw error;
          }
        },

        // Register action
        register: async (credentials: RegisterCredentials) => {
          set({ isLoading: true, error: null });

          try {
            const response = await authApi.register(
              credentials.email,
              credentials.password,
              credentials.fullName
            );

            set({ isLoading: false });

            // Don't auto-login, redirect to email verification instead
            // The page component will handle the redirect
            return { email: credentials.email };
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            set({
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },

        // Logout action
        logout: async () => {
          set({ isLoading: true });

          try {
            // Call logout API if token exists and it's not a mock token
            const token = localStorage.getItem('access_token');
            if (token && !token.startsWith('mock_token_')) {
              await authApi.logout();
            }
          } catch (error) {
            console.error('Logout error:', error);
          } finally {
            // Clear tokens and state regardless of API call result
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_info'); // Clear mock user info

            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },

        // OAuth login action
        oauthLogin: async (provider: string) => {
          set({ isLoading: true, error: null });
          
          try {
            // In a real implementation, this would redirect to OAuth provider
            // For now, we'll simulate the OAuth flow
            const oauthUrl = `${process.env.REACT_APP_API_URL}/api/v1/auth/oauth/${provider}`;
            
            // Redirect to OAuth provider
            window.location.href = oauthUrl;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || `${provider} login failed. Please try again.`;
            set({
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },

        // Refresh token action
        refreshToken: async () => {
          const refresh_token = localStorage.getItem('refresh_token');
          if (!refresh_token) {
            throw new Error('No refresh token available');
          }

          try {
            const response = await authApi.refreshToken(refresh_token);
            const { access_token } = response.data.data;

            localStorage.setItem('access_token', access_token);
          } catch (error) {
            // If refresh fails, logout user
            get().logout();
            throw error;
          }
        },

        // Clear error action
        clearError: () => {
          set({ error: null });
        },

        // Check authentication status
        checkAuth: async () => {
          const token = localStorage.getItem('access_token');
          if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
          }

          set({ isLoading: true });

          try {
            // Check if it's a mock token (for OAuth testing without database)
            if (token.startsWith('mock_token_')) {
              const userInfo = localStorage.getItem('user_info');
              if (userInfo) {
                const user = JSON.parse(userInfo);
                set({
                  user,
                  isAuthenticated: true,
                  isLoading: false,
                });
                return;
              }
            }

            // Try to get profile from backend
            const response = await authApi.getProfile();
            const user = response.data.data;

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            // Token might be expired, try to refresh
            try {
              await get().refreshToken();
              // Retry getting profile
              const response = await authApi.getProfile();
              const user = response.data.data;

              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch (refreshError) {
              // Both token and refresh failed, logout
              get().logout();
            }
          }
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);
