import { useCallback, useEffect, useState } from "react";
import { DetailedTrip } from "@/components/trips/types";
import { tripsService } from "@/services/tripsService";

export interface UseTemplateDetailsReturn {
    template: DetailedTrip | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useTemplateDetails = (templateId: string): UseTemplateDetailsReturn => {
    const [template, setTemplate] = useState<DetailedTrip | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!templateId) return;
        try {
            setError(null);
            const response = await tripsService.fetchTemplateDetails(templateId);
            setTemplate(response);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load template details";
            setError(message);
        }
    }, [templateId]);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await refetch();
            setIsLoading(false);
        };
        void load();
    }, [refetch]);

    return { template, isLoading, error, refetch };
};
