import { useCallback, useEffect, useState } from "react";
import { Trip } from "@/components/trips/types";
import { tripsService } from "@/services/tripsService";

export const useTemplates = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        try {
            setError(null);
            const response = await tripsService.fetchTemplateTrips();
            setTrips(response);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load templates";
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

    return { trips, isLoading, isRefreshing, error, onRefresh, refetch };
};
