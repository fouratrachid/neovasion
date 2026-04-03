import { create } from 'zustand';
import { authService, UserProfileResponse } from '@/services/authService';
import { apiService } from '@/services/api';

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
      // Execute the request via our authService
      await authService.login(email, password);
      // Retrieve the freshly minted authenticated profile
      const userResp = await authService.getMe();
      
      set({ 
        user: userResp.data, 
        isAuthenticated: true, 
        isLoginLoading: false 
      });
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
  },

  hydrate: async () => {
    try {
      const token = await apiService.getToken();
      if (token) {
        // We have a stored token, let's verify and get User Profile
        const userResp = await authService.getMe();
        set({ 
          user: userResp.data, 
          isAuthenticated: true, 
          isHydrating: false 
        });
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
