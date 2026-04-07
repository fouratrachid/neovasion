import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AccommodationsResponse, Accommodation, AccommodationFilterType } from "@/components/accommodations/types";
import { accommodationsService } from "@/services/accommodationsService";
import { queryKeys } from "@/hooks/queryKeys";

export interface UseAccommodationsReturn {
    data: AccommodationsResponse | null;
    accommodations: Accommodation[];
    filteredAccommodations: Accommodation[];
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
    availableTypes: string[];
    onRefresh: () => void;
    refetch: () => void;
}

export const useAccommodations = (): UseAccommodationsReturn => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    // TanStack Query handles loading, error, refetching automatically
    const {
        data,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: queryKeys.accommodations.list(),
        queryFn: async () => {
            console.log("🏨 useAccommodations: Fetching accommodations...");
            const response = await accommodationsService.fetchAccommodations();
            console.log("✅ useAccommodations: Accommodations fetched successfully");
            return response;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 2, // Retry failed requests 2 times
        refetchOnWindowFocus: false,
    });

    const accommodations = useMemo(() => data?.accomodations ?? [], [data]);

    const availableTypes = useMemo(() => {
        const types = new Set(accommodations.map(a => a.type));
        return ["all", ...Array.from(types)];
    }, [accommodations]);

    const filteredAccommodations = useMemo(() => {
        let result = accommodations;

        if (activeFilter !== "all") {
            result = result.filter(a => a.type === activeFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(a =>
                a.name.toLowerCase().includes(q) ||
                a.type.toLowerCase().includes(q)
            );
        }

        return result;
    }, [accommodations, activeFilter, searchQuery]);

    return {
        data: data ?? null,
        accommodations,
        filteredAccommodations,
        isLoading,
        isRefreshing: isFetching, // isFetching is true when ANY request is in flight
        error: error?.message ?? null,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        availableTypes,
        onRefresh: refetch, // Direct refetch from useQuery
        refetch,
    };
};
