import { TripsActivityResponse, TripDetailsResponse } from "@/components/trips/types";
import { apiService } from "./api";

const DEFAULT_COUNTRY = "TN";

class TripsService {
    async fetchTrips(country: string = DEFAULT_COUNTRY): Promise<TripsActivityResponse> {
        try {
            console.log("✈️ TripsService: Fetching trips...");
            const response = await apiService.request<TripsActivityResponse>(
                "preferences/search-activity/Trips/",
                {
                    method: "POST",
                    body: JSON.stringify({ country }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            console.log("✅ TripsService: Trips fetched successfully");
            return response;
        } catch (error) {
            console.error("❌ TripsService: Failed to fetch trips:", error);
            throw error;
        }
    }

    async fetchTripDetails(tripId: string): Promise<TripDetailsResponse> {
        try {
            console.log(`✈️ TripsService: Fetching trip details for ${tripId}...`);
            const response = await apiService.request<TripDetailsResponse>(
                `trips/${tripId}`,
                {
                    method: "GET",
                },
            );
            console.log("✅ TripsService: Trip details fetched successfully");
            return response;
        } catch (error) {
            console.error(`❌ TripsService: Failed to fetch trip details ${tripId}:`, error);
            throw error;
        }
    }
}

export const tripsService = new TripsService();
