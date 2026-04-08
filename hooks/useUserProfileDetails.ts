import { useQuery } from "@tanstack/react-query";
import { networkingService } from "@/services/networkingService";
import { queryKeys } from "@/hooks/queryKeys";

export const useNetworkingProfileParams = (uniqueName: string) => {
    const profileQuery = useQuery({
        queryKey: [...queryKeys.networking.profiles(), 'detail', uniqueName],
        queryFn: () => networkingService.getProfileDetails(uniqueName),
        enabled: !!uniqueName,
    });

    const postsQuery = useQuery({
        queryKey: [...queryKeys.networking.activity(), 'profilePosts', uniqueName],
        queryFn: () => networkingService.getProfilePosts(uniqueName),
        enabled: !!uniqueName,
    });

    const tripsQuery = useQuery({
        queryKey: [...queryKeys.trips.list(), 'profileTrips', uniqueName],
        queryFn: () => networkingService.getProfileTrips(uniqueName),
        enabled: !!uniqueName,
    });

    const filesQuery = useQuery({
        queryKey: [...queryKeys.networking.activity(), 'profileFiles', uniqueName],
        queryFn: () => networkingService.getProfileFiles(uniqueName),
        enabled: !!uniqueName,
    });

    return {
        profileData: profileQuery.data,
        postsData: postsQuery.data?.posts || [],
        headerData: postsQuery.data,
        tripsData: tripsQuery.data?.data || [],
        filesData: filesQuery.data?.files || [],
        isLoading: profileQuery.isLoading || postsQuery.isLoading || tripsQuery.isLoading || filesQuery.isLoading,
        error: profileQuery.error || postsQuery.error || tripsQuery.error || filesQuery.error,
        refetch: () => {
            profileQuery.refetch();
            postsQuery.refetch();
            tripsQuery.refetch();
            filesQuery.refetch();
        }
    };
};