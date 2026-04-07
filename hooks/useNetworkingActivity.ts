import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { NetworkingActivityResponse } from "@/components/networking/types";
import { networkingService } from "@/services/networkingService";
import { queryKeys } from "@/hooks/queryKeys";

export interface UseNetworkingActivityReturn {
    data: NetworkingActivityResponse | null;
    posts: NetworkingActivityResponse["posts"];
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    onRefresh: () => void;
    refetch: () => void;
}

export const useNetworkingActivity = (): UseNetworkingActivityReturn => {
    // TanStack Query handles loading, error, refetching automatically
    const {
        data,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: queryKeys.networking.activity(),
        queryFn: async () => {
            console.log("🌐 useNetworkingActivity: Fetching networking activity...");
            const response = await networkingService.fetchPublicNetworking();
            console.log("✅ useNetworkingActivity: Networking activity fetched successfully");
            return response;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 2, // Retry failed requests 2 times
        refetchOnWindowFocus: false,
    });

    const posts = useMemo(() => data?.posts ?? [], [data]);

    return {
        data: data ?? null,
        posts,
        isLoading,
        isRefreshing: isFetching, // isFetching is true when ANY request is in flight
        error: error?.message ?? null,
        onRefresh: refetch, // Direct refetch from useQuery
        refetch,
    };
};
