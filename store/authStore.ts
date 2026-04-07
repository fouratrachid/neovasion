import { create } from 'zustand';
import { authService, UserProfileResponse } from '@/services/authService';
import { apiService } from '@/services/api';
import { queryClient } from '@/providers/QueryProvider';
import { queryKeys } from '@/hooks/queryKeys';

type UserData = UserProfileResponse['data'];

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  isLoginLoading: boolean;

  // Actions
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>; // Call this on app bootstrap
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrating: true, // Start in a loading state for session check
  isLoginLoading: false,

  login: async (email, password) => {
    set({ isLoginLoading: true });
    try {
      await authService.login(email, password);
      const userResp = await authService.getMe();

      set({
        user: userResp.data,
        isAuthenticated: true,
        isLoginLoading: false
      });

      // Invalidate profile query cache to trigger refetch in useAuthProfile
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    } catch (error) {
      set({
        isLoginLoading: false,
        isAuthenticated: false,
        user: null
      });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false, isHydrating: false });

    // Clear all auth-related caches
    queryClient.removeQueries({ queryKey: queryKeys.auth.all });
  },

  hydrate: async () => {
    try {
      const token = await apiService.getToken();
      if (token) {
        const userResp = await authService.getMe();
        set({
          user: userResp.data,
          isAuthenticated: true,
          isHydrating: false
        });

        // Pre-populate cache so useAuthProfile doesn't refetch
        queryClient.setQueryData(queryKeys.auth.me(), userResp);
      } else {
        // No token found locally
        set({ isAuthenticated: false, isHydrating: false });
      }
    } catch (error) {
      // The token is expired or unauthorized, clearly delete it
      await apiService.removeToken();
      set({ user: null, isAuthenticated: false, isHydrating: false });
    }
  }
}));
