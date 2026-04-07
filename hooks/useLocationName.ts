import { useState, useEffect } from "react";
import { networkingService } from "@/services/networkingService";

export const useLocationName = (position?: string) => {
    const [locationName, setLocationName] = useState<string>(position || "");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!position) {
            setLocationName("");
            return;
        }

        // Check if position is coordinates (format: "lat,lon")
        const isCoordinates = /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(position.trim());

        if (!isCoordinates) {
            // Already a location name
            setLocationName(position);
            return;
        }

        // Convert coordinates to location name
        const fetchLocationName = async () => {
            setIsLoading(true);
            try {
                const [lat, lon] = position.split(",").map(Number);
                const name = await networkingService.reverseGeocodeCoordinates(lat, lon);
                setLocationName(name || position); // Fallback to coordinates if geocoding fails
            } catch (error) {
                console.error("Error fetching location name:", error);
                setLocationName(position); // Fallback to original coordinates
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocationName();
    }, [position]);

    return { locationName, isLoading };
};
