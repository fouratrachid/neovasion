import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { queryKeys } from '@/hooks/queryKeys';

export const useAuthProfile = () => {
  const { user, isHydrating, isAuthenticated } = useAuthStore();

  // Use TanStack Query to fetch and cache user profile
  // Only fetch if authenticated and we have a token
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      console.log('👤 useAuthProfile: Fetching user profile...');
      const response = await authService.getMe();
      console.log('✅ useAuthProfile: User profile fetched successfully');
      return response;
    },
    // Only run query if authenticated
    enabled: isAuthenticated && !isHydrating,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
    refetchOnWindowFocus: true, // Refetch when app comes to foreground
  });

  return {
    // Use Zustand store user if available, otherwise use Query data
    data: { data: user ?? profileData?.data },
    isLoading: isHydrating || isProfileLoading,
    isAuthenticated,
    error: profileError?.message ?? null,
    refetch, // Allows manual profile refresh
  };
};
