import { NetworkingActivityResponse, ProfilesActivityResponse } from "@/components/networking/types";
import { apiService } from "./api";

const DEFAULT_COUNTRY = "TN";

interface ReverseGeocodeResult {
    address?: {
        city?: string;
        town?: string;
        village?: string;
        county?: string;
        state?: string;
        country?: string;
    };
}

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

    async fetchProfiles(country: string = DEFAULT_COUNTRY): Promise<ProfilesActivityResponse> {
        try {
            const response = await apiService.request<ProfilesActivityResponse>(
                "preferences/search-activity/Profiles/",
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
            console.error("Failed to fetch networking profiles:", error);
            throw error;
        }
    }

    async reverseGeocodeCoordinates(lat: number, lon: number): Promise<string> {
        try {
            console.log(`Reverse geocoding coordinates: ${lat}, ${lon}`);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lon}&lon=${lat}&zoom=10&addressdetails=1`,
                {
                    headers: {
                        "User-Agent": "TravelApp/1.0 (reverse geocoding)",
                        "Accept": "application/json",
                    },
                }
            );

            if (!response.ok) {
                console.warn(`Nominatim error: ${response.status}`);
                return "";
            }
            const data: ReverseGeocodeResult = await response.json();
            console.log("Nominatim response received", data);

            const address = data.address;

            if (!address) return "";

            // Priority: city > town > village > county
            const placeName = address.city || address.town || address.village || address.county;
            const country = address.country;

            return placeName && country
                ? `${placeName}, ${country}`
                : placeName || country || "";
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
            return "";
        }
    }
}


export const networkingService = new NetworkingService();
