import { useAuthStore } from '@/stores/authStore';
import type { SendOtpRequest } from '@/types/api';
import { useCallback } from 'react';

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    error,
    sendOtp,
    verifyOtp,
    logout,
    clearError,
  } = useAuthStore();

  const handleSendOtp = useCallback(async (data: SendOtpRequest) => {
    try {
      console.log(' useAuth sendOtp called with:', data);
      await sendOtp(data);
    } catch (error) {
      console.error(' useAuth sendOtp failed:', error);
      throw error;
    }
  }, [sendOtp]);

  const handleLogout = useCallback(async () => {
    try {
      console.log(' useAuth logout called');
      await logout();
      console.log(' useAuth logout completed');
    } catch (error) {
      console.error('💥 useAuth logout failed:', error);
    }
  }, [logout]);


  return {
    // State
    user,
    token,
    isLoading,
    isAuthenticated,
    error,

    // Actions
    sendOtp: handleSendOtp,
    verifyOtp,
    logout: handleLogout,
    clearError,



  };
};