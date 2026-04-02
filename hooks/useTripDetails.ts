import { useCallback, useEffect, useState } from "react";
import { DetailedTrip } from "@/components/trips/types";
import { tripsService } from "@/services/tripsService";

export interface UseTripDetailsReturn {
    trip: DetailedTrip | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useTripDetails = (tripId: string): UseTripDetailsReturn => {
    const [trip, setTrip] = useState<DetailedTrip | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!tripId) return;
        try {
            setError(null);
            const response = await tripsService.fetchTripDetails(tripId);
            setTrip(response.data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load trip details";
            setError(message);
        }
    }, [tripId]);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await refetch();
            setIsLoading(false);
        };

        void load();
    }, [refetch]);

    return {
        trip,
        isLoading,
        error,
        refetch,
    };
};
