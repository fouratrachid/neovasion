import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ProfilesActivityResponse, Profile } from "@/components/networking/types";
import { networkingService } from "@/services/networkingService";
import { queryKeys } from "@/hooks/queryKeys";

export interface UseNetworkingProfilesReturn {
    data: ProfilesActivityResponse | null;
    profiles: Profile[];
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    onRefresh: () => void;
    refetch: () => void;
}

export const useNetworkingProfiles = (): UseNetworkingProfilesReturn => {
    const {
        data,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: queryKeys.networking.profiles(),
        queryFn: async () => {
            console.log("🌐 useNetworkingProfiles: Fetching profiles...");
            const response = await networkingService.fetchProfiles();
            console.log("✅ useNetworkingProfiles: Profiles fetched successfully");
            return response;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 2, // Retry failed requests 2 times
        refetchOnWindowFocus: false,
    });

    const profiles = useMemo(() => data?.profiles ?? [], [data]);

    return {
        data: data ?? null,
        profiles,
        isLoading,
        isRefreshing: isFetching,
        error: error?.message ?? null,
        onRefresh: refetch,
        refetch,
    };
};
