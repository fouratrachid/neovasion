import { authService } from '@/services/authService';
import type { AuthState, User, SendOtpRequest, LoginRequest } from '@/types/api';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { queryClient } from '@/providers/QueryProvider';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const LOGIN_TIME_KEY = 'user_logged_in';

interface AuthStore extends AuthState {
  // Actions 
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;

  // Auth methods
  sendOtp: (data: SendOtpRequest) => Promise<boolean>;
  login: (data: LoginRequest) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;

  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  clearError: () => void;

  updateUser: (userData: Partial<User>) => void;
  syncNotificationLanguage: (language: string) => Promise<void>;
  clearAllData: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  // Actions
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  setError: (error) => {
    set({ error });
  },
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
  setToken: (token) => {
    set({ token });
  },
  clearError: () => {
    set({ error: null });
  },

  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...userData };
    set({ user: updatedUser });

    SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser)).catch((error) => {
      console.error('❌ Failed to update stored user:', error);
    });
  },

  sendOtp: async (data) => {
    try {
      console.log('🚀 Sending OTP...');
      set({ isLoading: true, error: null });

      const response = await authService.sendOtp(data);
      console.log("response", response)
      if (response.success === false) {
        throw new Error(response.message || 'Failed to send OTP');
      }

      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('💥 Send OTP error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      set({
        error: errorMessage,
        isLoading: false
      });
      throw error;
    }
  },

  login: async (data) => {
    try {
      console.log('🚀 Logging in...');
      set({ isLoading: true, error: null });

      // Clear any existing token before new login
      await authService.clearToken();

      const response = await authService.login(data);
      console.log("response", response)

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const user = response.data?.user;
      const token = response.data?.token;

      if (!user || !token) {
        throw new Error("Invalid response from server");
      }

      // Clear existing data first
      await Promise.all([
        SecureStore.deleteItemAsync(USER_KEY).catch(() => { }),
        SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => { }),
        SecureStore.deleteItemAsync(LOGIN_TIME_KEY).catch(() => { }),
      ]);


      // Store login time
      const loginTime = new Date().toISOString();
      await SecureStore.setItemAsync(LOGIN_TIME_KEY, loginTime);

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      await SecureStore.setItemAsync(TOKEN_KEY, token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      router.replace("/");

    } catch (error) {
      console.error('💥 Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({
        error: errorMessage,
        isLoading: false
      });
      throw error;
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      console.log('🚀 Verifying OTP...');
      set({ isLoading: true, error: null });

      const response = await authService.verifyOtp({ email, otp });
      console.log("response", response)
      if (!response.success && response.message) {
        throw new Error(response.message);
      }

      // Unwrap user and token
      const user = response.data?.user;
      const token = response.data?.token;

      if (!user || !token) {
        throw new Error("Invalid response from server");
      }

      // Clear existing data first
      await Promise.all([
        SecureStore.deleteItemAsync(USER_KEY).catch(() => { }),
        SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => { }),
        SecureStore.deleteItemAsync(LOGIN_TIME_KEY).catch(() => { }),
      ]);

      // Clear basket from previous account
      useBasketStore.getState().clearBasket();

      // Store login time
      const loginTime = new Date().toISOString();
      await SecureStore.setItemAsync(LOGIN_TIME_KEY, loginTime);

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      await SecureStore.setItemAsync(TOKEN_KEY, token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      router.replace("/");

    } catch (error) {
      console.error('💥 Verify OTP error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
      queryClient.clear();

      await Promise.all([
        SecureStore.deleteItemAsync(USER_KEY),
        SecureStore.deleteItemAsync(LOGIN_TIME_KEY),
        SecureStore.deleteItemAsync(TOKEN_KEY),
      ]);

      // Clear basket on logout
      useBasketStore.getState().clearBasket();

      get().clearAllData();
      router.replace("/(auth)/sign-in");

    } catch (error) {
      console.error('💥 Logout error:', error);
      // Clear basket even on error
      useBasketStore.getState().clearBasket();
      get().clearAllData();
      router.replace("/(auth)/sign-in");
    } finally {
      set({ isLoading: false });
    }
  },

  syncNotificationLanguage: async (language: string) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, notificationLanguage: language as any };
      set({ user: updatedUser });
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
    }
  },

  clearAllData: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
  },

  loadStoredAuth: async () => {
    try {
      set({ isLoading: true });
      const [storedToken, storedUser] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);

      if (storedToken && storedUser) {
        const user = JSON.parse(storedUser);
        set({
          user,
          token: storedToken,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('❌ Failed to load stored auth:', error);
      set({ isLoading: false });
      await get().logout();
    }
  },
}));