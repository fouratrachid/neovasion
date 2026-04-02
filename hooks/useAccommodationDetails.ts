import { useCallback, useEffect, useState } from "react";
import { Accommodation } from "@/components/accommodations/types";
import { accommodationsService } from "@/services/accommodationsService";

export interface UseAccommodationDetailsReturn {
    accommodation: Accommodation | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useAccommodationDetails = (id: string): UseAccommodationDetailsReturn => {
    const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!id) return;
        try {
            setError(null);
            const response = await accommodationsService.fetchAccommodationDetails(id);
            // Handling wrapped vs loose response for safety
             if (response._id) {
               setAccommodation(response as Accommodation);
            } else if (response.data?._id) {
               setAccommodation(response.data as Accommodation);
            } else {
               setAccommodation(response as any as Accommodation);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load accommodation details";
            setError(message);
        }
    }, [id]);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await refetch();
            setIsLoading(false);
        };
        void load();
    }, [refetch]);

    return {
        accommodation,
        isLoading,
        error,
        refetch,
    };
};
