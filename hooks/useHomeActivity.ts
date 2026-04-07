import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { homeService } from '@/services/homeService';
import { HomeActivityResponse } from '@/components/home/types';
import { queryKeys } from '@/hooks/queryKeys';

export interface UseHomeActivityReturn {
    data: HomeActivityResponse | null;
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    refetch: () => void;
    onRefresh: () => void;
    stats: {
        trips: number;
        stays: number;
        guides: number;
        countries: number;
    };
}

export const useHomeActivity = (): UseHomeActivityReturn => {
    // TanStack Query handles loading, error, refetching automatically
    const {
        data,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: queryKeys.home.activity(),
        queryFn: async () => {
            console.log('🎣 useHomeActivity: Fetching data...');
            const response = await homeService.fetchHomeActivity();
            console.log('✅ useHomeActivity: Data fetched successfully');
            return response;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 2, // Retry failed requests 2 times
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
    });

    const stats = useMemo(
        () => ({
            trips: data?.trips?.length ?? 0,
            guides: data?.profiles?.length ?? 0,
            stays: data?.accomodations?.length ?? 0,
            countries: data?.countriesNearby?.length ?? 0,
        }),
        [data],
    );

    return {
        data: data ?? null,
        isLoading,
        isRefreshing: isFetching, // isFetching is true when ANY request is in flight
        error: error?.message ?? null,
        refetch, // Direct refetch from useQuery
        onRefresh: refetch, // Wrapper for pull-to-refresh
        stats,
    };
};
