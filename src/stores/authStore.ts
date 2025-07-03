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
  handleOAuthCallback: (provider: string, success: boolean) => Promise<void>;
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
            await authApi.register(
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
            localStorage.removeItem('user_data'); // Clear user data

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
            console.log(`🚀 AuthStore: Initiating OAuth login for ${provider}`);

            // Construct OAuth URL with proper callback
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';

            // The backend should handle the redirect back to frontend
            const oauthUrl = `${apiUrl}/api/v1/auth/oauth/${provider}`;

            console.log(`🔗 AuthStore: Redirecting to OAuth URL: ${oauthUrl}`);

            // Redirect to OAuth provider via backend
            window.location.href = oauthUrl;
          } catch (error: any) {
            console.error(`❌ AuthStore: OAuth login failed for ${provider}:`, error);
            const errorMessage = error.response?.data?.message || `${provider} login failed. Please try again.`;
            set({
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },

        // Handle OAuth callback
        handleOAuthCallback: async (provider: string, success: boolean) => {
          console.log(`🔄 AuthStore: Handling OAuth callback for ${provider}, success: ${success}`);
          set({ isLoading: true, error: null });

          try {
            if (success) {
              // Check if we have real JWT token and user data from localStorage
              const token = localStorage.getItem('access_token');
              const userInfo = localStorage.getItem('user_data'); // Changed from user_info to user_data

              if (token && userInfo) {
                const user = JSON.parse(userInfo);
                console.log('💾 AuthStore: Using real JWT token and user data', {
                  token: `${token.substring(0, 20)}...`,
                  user
                });

                // Verify token with backend by getting user profile
                try {
                  const response = await authApi.getProfile();
                  const backendUser = response.data.data;
                  console.log('✅ AuthStore: Token verified with backend', backendUser);

                  // Update state with backend user data
                  set({
                    user: backendUser,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                  });

                  // Update stored user data with backend data
                  localStorage.setItem('user_data', JSON.stringify(backendUser));

                } catch (verifyError) {
                  console.log('⚠️ AuthStore: Token verification failed, using stored data');
                  // Fallback to stored user data if backend verification fails
                  set({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                  });
                }

                console.log('✅ AuthStore: Authentication state updated with real JWT');
              } else {
                console.log('❌ AuthStore: No JWT token or user data found');
                set({
                  isLoading: false,
                  error: `${provider} authentication failed - no token received`,
                });
              }
            } else {
              console.log('❌ AuthStore: OAuth callback failed');
              set({
                isLoading: false,
                error: `${provider} authentication failed`,
              });
            }
          } catch (error: any) {
            console.error('❌ AuthStore: Error in handleOAuthCallback:', error);
            const errorMessage = error.response?.data?.message || `${provider} authentication failed. Please try again.`;
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
          console.log('🔍 AuthStore: Checking authentication status');
          const token = localStorage.getItem('access_token');
          const userInfo = localStorage.getItem('user_data');
          console.log('🔍 AuthStore: Token found:', token ? `${token.substring(0, 20)}...` : 'null');
          console.log('🔍 AuthStore: User info found:', userInfo ? 'yes' : 'no');

          if (!token) {
            console.log('🔍 AuthStore: No token found, setting unauthenticated');
            set({ isAuthenticated: false, user: null, isLoading: false });
            return;
          }

          set({ isLoading: true });

          try {
            // If we have stored user info, use it first for faster loading
            if (userInfo) {
              const user = JSON.parse(userInfo);
              console.log('✅ AuthStore: Using stored user info for quick auth', user);
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });

              // Optionally verify token in background (don't await)
              authApi.getProfile()
                .then(response => {
                  const backendUser = response.data.data;
                  console.log('🔄 AuthStore: Background token verification successful, updating user data');

                  // Update with fresh data from backend
                  set({ user: backendUser });
                  localStorage.setItem('user_data', JSON.stringify(backendUser));
                })
                .catch(error => {
                  console.warn('⚠️ AuthStore: Background token verification failed:', error);
                  // Don't logout here as user might be offline
                });

              return;
            }

            // No stored user info, must verify with backend
            console.log('🔍 AuthStore: No stored user info, verifying token with backend');
            const response = await authApi.getProfile();
            const user = response.data.data;

            console.log('✅ AuthStore: Token verified with backend', user);
            localStorage.setItem('user_data', JSON.stringify(user));

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            console.warn('⚠️ AuthStore: Token verification failed, attempting refresh');

            // Token might be expired, try to refresh
            try {
              await get().refreshToken();

              // Retry getting profile after refresh
              const response = await authApi.getProfile();
              const user = response.data.data;

              console.log('✅ AuthStore: Token refreshed and profile retrieved', user);
              localStorage.setItem('user_data', JSON.stringify(user));

              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch (refreshError) {
              console.error('❌ AuthStore: Token refresh failed, logging out:', refreshError);
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
