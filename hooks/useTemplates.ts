import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Trip } from "@/components/trips/types";
import { tripsService } from "@/services/tripsService";
import { queryKeys } from "@/hooks/queryKeys";

export const useTemplates = () => {
    // TanStack Query handles loading, error, refetching automatically
    const {
        data,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: queryKeys.trips.templates(),
        queryFn: async () => {
            console.log("📋 useTemplates: Fetching template trips...");
            const response = await tripsService.fetchTemplateTrips();
            console.log("✅ useTemplates: Template trips fetched successfully");
            return response;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 2, // Retry failed requests 2 times
        refetchOnWindowFocus: false,
    });

    const trips = useMemo(() => data ?? [], [data]);

    return {
        trips,
        isLoading,
        isRefreshing: isFetching, // isFetching is true when ANY request is in flight
        error: error?.message ?? null,
        onRefresh: refetch, // Direct refetch from useQuery
        refetch,
    };
};
