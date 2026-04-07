import { NetworkingActivityResponse } from "@/components/networking/types";
import { apiService } from "./api";

const DEFAULT_COUNTRY = "TN";

class NetworkingService {
    async fetchPublicNetworking(country: string = DEFAULT_COUNTRY): Promise<NetworkingActivityResponse> {
        try {
            const response = await apiService.request<NetworkingActivityResponse>(
                "preferences/search-activity/Networking/public",
                {
                    method: "POST",
                    body: JSON.stringify({ country }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            return response;
        } catch (error) {
            console.error("Failed to fetch public networking posts:", error);
            throw error;
        }
    }

    async fetchConnectedNetworking(country: string = DEFAULT_COUNTRY): Promise<NetworkingActivityResponse> {
        try {
            const response = await apiService.request<NetworkingActivityResponse>(
                "preferences/search-activity/Networking/connected",
                {
                    method: "POST",
                    body: JSON.stringify({ country }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            return response;
        } catch (error) {
            console.error("Failed to fetch connected networking posts:", error);
            throw error;
        }
    }
}

export const networkingService = new NetworkingService();
