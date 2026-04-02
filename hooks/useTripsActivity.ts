import { useCallback, useEffect, useMemo, useState } from "react";
import { TripsActivityResponse, Trip, TripTypeFilter } from "@/components/trips/types";
import { tripsService } from "@/services/tripsService";

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
    onRefresh: () => Promise<void>;
    refetch: () => Promise<void>;
}

export const useTripsActivity = (): UseTripsActivityReturn => {
    const [data, setData] = useState<TripsActivityResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<TripTypeFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const refetch = useCallback(async () => {
        try {
            setError(null);
            const response = await tripsService.fetchTrips();
            setData(response);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to load trips";
            setError(message);
        }
    }, []);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await refetch();
            setIsLoading(false);
        };

        void load();
    }, [refetch]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    }, [refetch]);

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
        data,
        trips,
        filteredTrips,
        isLoading,
        isRefreshing,
        error,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        onRefresh,
        refetch,
    };
};
