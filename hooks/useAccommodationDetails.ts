import { useQuery } from "@tanstack/react-query";
import { Accommodation } from "@/components/accommodations/types";
import { accommodationsService } from "@/services/accommodationsService";
import { queryKeys } from "@/hooks/queryKeys";

export interface UseAccommodationDetailsReturn {
    accommodation: Accommodation | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useAccommodationDetails = (id: string): UseAccommodationDetailsReturn => {
    // TanStack Query handles loading, error, refetching automatically
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: queryKeys.accommodations.detail(id),
        queryFn: async () => {
            if (!id) return null;
            console.log(`🏨 useAccommodationDetails: Fetching accommodation details for ${id}...`);
            const response = await accommodationsService.fetchAccommodationDetails(id);
            console.log("✅ useAccommodationDetails: Accommodation details fetched successfully");

            // Handling wrapped vs loose response for safety
            if (response._id) {
                return response as Accommodation;
            } else if (response.data?._id) {
                return response.data as Accommodation;
            } else {
                return response as any as Accommodation;
            }
        },
        enabled: !!id, // Only run query if id exists
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
    });

    return {
        accommodation: data ?? null,
        isLoading,
        error: error?.message ?? null,
        refetch,
    };
};
