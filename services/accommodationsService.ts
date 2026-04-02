import { AccommodationsResponse } from "@/components/accommodations/types";
import { apiService } from "./api";

const DEFAULT_COUNTRY = "TN";

class AccommodationsService {
    async fetchAccommodations(country: string = DEFAULT_COUNTRY): Promise<AccommodationsResponse> {
        try {
            console.log("🏨 AccommodationsService: Fetching accommodations...");
            const response = await apiService.request<AccommodationsResponse>(
                "preferences/search-activity/Accomodations/",
                {
                    method: "POST",
                    body: JSON.stringify({ country }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            console.log("✅ AccommodationsService: Accommodations fetched successfully");
            return response;
        } catch (error) {
            console.error("❌ AccommodationsService: Failed to fetch accommodations:", error);
            throw error;
        }
    }
}

export const accommodationsService = new AccommodationsService();
