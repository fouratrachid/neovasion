import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { TripsActivityResponse, Trip, TripTypeFilter } from "@/components/trips/types";
import { tripsService } from "@/services/tripsService";
import { queryKeys } from "@/hooks/queryKeys";

export interface UseTripsActivityReturn {
    data: TripsActivityResponse | null;
    trips: Trip[];
    filteredTrips: Trip[];
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    activeFilter: TripTypeFilter;
    setActiveFilter: (filter: TripTypeFilter) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onRefresh: () => void;
    refetch: () => void;
}

export const useTripsActivity = (): UseTripsActivityReturn => {
    const [activeFilter, setActiveFilter] = useState<TripTypeFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // TanStack Query handles loading, error, refetching automatically
    const {
        data,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: queryKeys.trips.list(),
        queryFn: async () => {
            console.log("✈️ useTripsActivity: Fetching trips...");
            const response = await tripsService.fetchTrips();
            console.log("✅ useTripsActivity: Trips fetched successfully");
            return response;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 2, // Retry failed requests 2 times
        refetchOnWindowFocus: false,
    });

    const trips = useMemo(() => data?.trips ?? [], [data]);

    const filteredTrips = useMemo(() => {
        let result = trips;

        // Filter by type
        if (activeFilter !== "all") {
            result = result.filter(
                (trip) => trip.type_trip?.toLowerCase() === activeFilter,
            );
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((trip) => {
                const title = trip.title_trip?.toLowerCase() ?? "";
                const desc = trip.desc_trip?.toLowerCase() ?? "";
                const dest = trip.destination?.[0]?.location?.ville?.toLowerCase() ?? "";
                const keywords = (trip.mot_cle ?? []).join(" ").toLowerCase();
                return (
                    title.includes(q) ||
                    desc.includes(q) ||
                    dest.includes(q) ||
                    keywords.includes(q)
                );
            });
        }

        return result;
    }, [trips, activeFilter, searchQuery]);

    return {
        data: data ?? null,
        trips,
        filteredTrips,
        isLoading,
        isRefreshing: isFetching, // isFetching is true when ANY request is in flight
        error: error?.message ?? null,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        onRefresh: refetch, // Direct refetch from useQuery
        refetch,
    };
};
