import { TripsActivityResponse } from "@/components/trips/types";
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
}

export const tripsService = new TripsService();
