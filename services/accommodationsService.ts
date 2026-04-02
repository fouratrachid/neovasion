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
            console.log(`🏨 AccommodationsService: Looking up accommodation details for ${id}...`);
            
            // The single GET endpoints return 404, so we pull the main list and find the item
            const allItemsResponse = await this.fetchAccommodations();
            
            const accommodation = allItemsResponse.accomodations?.find(item => item._id === id);

            if (!accommodation) {
                throw new Error("Accommodation out of bounds or not found");
            }
            
            console.log("✅ AccommodationsService: Accommodation details resolved successfully");
            return { success: true, data: accommodation };
        } catch (error) {
            console.error(`❌ AccommodationsService: Failed to resolve accommodation details for ${id}:`, error);
            throw error;
        }
    }
}

export const accommodationsService = new AccommodationsService();
