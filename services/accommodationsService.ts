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

    async fetchAccommodationDetails(id: string) {
        try {
            console.log(`🏨 AccommodationsService: Fetching accommodation details for ${id}...`);
            const response = await apiService.request<{ success?: boolean; data?: any; _id?: string }>(
                `hebergement-trips/${id}`,
                {
                    method: "GET",
                },
            );
            console.log("✅ AccommodationsService: Accommodation details fetched successfully");
            
            // Allow dynamic wrapper unpacking
            if (response.data) {
                 return { success: true, data: response.data };
            }
            return { success: true, data: response }; // If no root wrapper
        } catch (error) {
             console.error(`❌ AccommodationsService: Failed to fetch accommodation details for ${id}:`, error);
             throw error;
        }
    }
}

export const accommodationsService = new AccommodationsService();
