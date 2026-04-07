import { useQuery } from "@tanstack/react-query";
import { DetailedTrip } from "@/components/trips/types";
import { tripsService } from "@/services/tripsService";
import { queryKeys } from "@/hooks/queryKeys";

export interface UseTemplateDetailsReturn {
    template: DetailedTrip | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useTemplateDetails = (templateId: string): UseTemplateDetailsReturn => {
    // TanStack Query handles loading, error, refetching automatically
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: queryKeys.trips.templateDetail(templateId),
        queryFn: async () => {
            if (!templateId) return null;
            console.log(`📋 useTemplateDetails: Fetching template details for ${templateId}...`);
            const response = await tripsService.fetchTemplateDetails(templateId);
            console.log("✅ useTemplateDetails: Template details fetched successfully");
            return response;
        },
        enabled: !!templateId, // Only run query if templateId exists
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
    });

    return {
        template: data ?? null,
        isLoading,
        error: error?.message ?? null,
        refetch,
    };
};
