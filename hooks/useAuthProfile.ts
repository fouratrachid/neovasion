import { useAuthStore } from '@/store/authStore';

export const useAuthProfile = () => {
  const { user, isHydrating, isAuthenticated } = useAuthStore();
  
  return {
    data: { data: user },
    isLoading: isHydrating,
    isAuthenticated,
  };
};
