import { useCallback, useEffect, useMemo, useState } from "react";
import { NetworkingActivityResponse } from "@/components/networking/types";
import { networkingService } from "@/services/networkingService";

export interface UseNetworkingActivityReturn {
    data: NetworkingActivityResponse | null;
    posts: NetworkingActivityResponse["posts"];
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    onRefresh: () => Promise<void>;
    refetch: () => Promise<void>;
}

export const useNetworkingActivity = (): UseNetworkingActivityReturn => {
    const [data, setData] = useState<NetworkingActivityResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        try {
            setError(null);
            const response = await networkingService.fetchPublicNetworking();
            setData(response);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to load networking activity";
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

    const posts = useMemo(() => data?.posts ?? [], [data]);

    return {
        data,
        posts,
        isLoading,
        isRefreshing,
        error,
        onRefresh,
        refetch,
    };
};
