import { useCallback, useEffect, useMemo, useState } from "react";
import { AccommodationsResponse, Accommodation, AccommodationFilterType } from "@/components/accommodations/types";
import { accommodationsService } from "@/services/accommodationsService";

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
    onRefresh: () => Promise<void>;
    refetch: () => Promise<void>;
}

export const useAccommodations = (): UseAccommodationsReturn => {
    const [data, setData] = useState<AccommodationsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    const refetch = useCallback(async () => {
        try {
            setError(null);
            const response = await accommodationsService.fetchAccommodations();
            setData(response);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load accommodations";
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
        data,
        accommodations,
        filteredAccommodations,
        isLoading,
        isRefreshing,
        error,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        availableTypes,
        onRefresh,
        refetch,
    };
};
