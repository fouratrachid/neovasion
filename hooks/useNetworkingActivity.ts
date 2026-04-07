import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { NetworkingActivityResponse } from "@/components/networking/types";
import { networkingService } from "@/services/networkingService";
import { queryKeys } from "@/hooks/queryKeys";
import { useAuthStore } from "@/store/authStore";

export interface UseNetworkingActivityReturn {
    data: NetworkingActivityResponse | null;
    posts: NetworkingActivityResponse["posts"];
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    onRefresh: () => void;
    refetch: () => void;
    isAuthenticated: boolean;
}

export const useNetworkingActivity = (): UseNetworkingActivityReturn => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
            console.log(
                `🌐 useNetworkingActivity: Fetching ${isAuthenticated ? "connected" : "public"} networking activity...`
            );
            const response = isAuthenticated
                ? await networkingService.fetchConnectedNetworking()
                : await networkingService.fetchPublicNetworking();
            console.log(
                `✅ useNetworkingActivity: ${isAuthenticated ? "Connected" : "Public"} networking activity fetched successfully`
            );
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
        isAuthenticated,
    };
};
