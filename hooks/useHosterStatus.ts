import { useQuery } from '@tanstack/react-query';
import { hosterService, HosterRequestResponse } from '@/services/hosterService';
import { queryKeys } from './queryKeys';

export const useHosterStatus = () => {
    const query = useQuery<HosterRequestResponse | null, Error>({
        queryKey: queryKeys.hoster.request(),
        queryFn: async () => {
            try {
                return await hosterService.fetchHosterRequestStatus();
            } catch (error: any) {
                // 404 means no request exists - treat as success with null data
                if (error.message === 'Demande non trouvée' || error.response?.status === 404) {
                    console.log('✅ No existing hoster request found (404 is expected)');
                    return null;
                }
                // Re-throw other errors
                throw error;
            }
        },
        retry: 1,
        staleTime: 60000, // Cache for 1 minute
        gcTime: 300000, // Keep in cache for 5 minutes
    });

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        hasExistingRequest: !!query.data,
    };
};
