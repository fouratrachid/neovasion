import { useQuery } from "@tanstack/react-query";
import { DetailedTrip } from "@/components/trips/types";
import { tripsService } from "@/services/tripsService";
import { queryKeys } from "@/hooks/queryKeys";

export interface UseTripDetailsReturn {
    trip: DetailedTrip | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useTripDetails = (tripId: string): UseTripDetailsReturn => {
    // TanStack Query handles loading, error, refetching automatically
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: queryKeys.trips.detail(tripId),
        queryFn: async () => {
            if (!tripId) return null;
            console.log(`✈️ useTripDetails: Fetching trip details for ${tripId}...`);
            const response = await tripsService.fetchTripDetails(tripId);
            console.log("✅ useTripDetails: Trip details fetched successfully");
            return response.data;
        },
        enabled: !!tripId, // Only run query if tripId exists
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
    });

    return {
        trip: data ?? null,
        isLoading,
        error: error?.message ?? null,
        refetch,
    };
};
