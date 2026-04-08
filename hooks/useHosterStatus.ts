import { useQuery } from '@tanstack/react-query';
import { hosterService, HosterRequestResponse } from '@/services/hosterService';
import { queryKeys } from './queryKeys';

export const useHosterStatus = () => {
    const query = useQuery<HosterRequestResponse, Error>({
        queryKey: queryKeys.hoster.request(),
        queryFn: () => hosterService.fetchHosterRequestStatus(),
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
