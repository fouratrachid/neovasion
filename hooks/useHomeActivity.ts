import { useCallback, useEffect, useMemo, useState } from 'react';
import { homeService } from '@/services/homeService';
import { HomeActivityResponse } from '@/components/home/types';

export interface UseHomeActivityReturn {
    data: HomeActivityResponse | null;
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    fetchHomeActivity: () => Promise<void>;
    onRefresh: () => Promise<void>;
    stats: {
        trips: number;
        stays: number;
        guides: number;
        countries: number;
    };
}

export const useHomeActivity = (): UseHomeActivityReturn => {
    const [data, setData] = useState<HomeActivityResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHomeActivity = useCallback(async () => {
        try {
            setError(null);
            console.log('🎣 useHomeActivity: Fetching data...');
            const response = await homeService.fetchHomeActivity();
            setData(response);
            console.log('✅ useHomeActivity: Data fetched successfully');
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Failed to load travel content';
            console.error('❌ useHomeActivity: Error fetching data:', message);
            setError(message);
        }
    }, []);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await fetchHomeActivity();
            setIsLoading(false);
        };

        void load();
    }, [fetchHomeActivity]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchHomeActivity();
        setIsRefreshing(false);
    }, [fetchHomeActivity]);

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
        data,
        isLoading,
        isRefreshing,
        error,
        fetchHomeActivity,
        onRefresh,
        stats,
    };
};
