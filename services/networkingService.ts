import { NetworkingActivityResponse, NetworkingComment, ProfilesActivityResponse } from "@/components/networking/types";
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

    async getProfileDetails(uniqueName: string): Promise<any> {
        const response = await apiService.request<any>(`hosters/Public/${uniqueName}`, { method: "GET" });
        return response;
    }

    async getProfilePosts(uniqueName: string): Promise<any> {
        const response = await apiService.request<any>(`posts/Public/hoster/${uniqueName}`, { method: "GET" });
        return response;
    }

    async getProfileFollows(uniqueName: string): Promise<any> {
        const response = await apiService.request<any>(`folows/Public/followings/${uniqueName}`, { method: "GET" });
        return response;
    }

    async getProfileFiles(uniqueName: string): Promise<any> {
        const response = await apiService.request<any>(`hosters/files/public/hoster/${uniqueName}`, { method: "GET" });
        return response;
    }

    async getProfileTrips(uniqueName: string): Promise<any> {
        const response = await apiService.request<any>(`trips/hoster/unique-name/${uniqueName}`, { method: "GET" });
        return response;
    }

    async addComment(postId: string, message: string, replyTo?: string | null): Promise<NetworkingComment> {
        try {
            const body: any = { PostId: postId, message };
            if (replyTo) body.replyTo = replyTo;

            const response = await apiService.request<NetworkingComment>(
                "posts/addComment",
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            return response;
        } catch (error) {
            console.error("Failed to add comment:", error);
            throw error;
        }
    }

    async addLike(postId: string): Promise<void> {
        try {
            await apiService.request<void>(
                `posts/${postId}/like`,
                {
                    method: "POST",
                },
            );
        } catch (error) {
            console.error(`Failed to add like to post ${postId}:`, error);
            throw error;
        }
    }

    async removeLike(postId: string): Promise<void> {
        try {
            await apiService.request<void>(
                `posts/${postId}/like`,
                {
                    method: "DELETE",
                },
            );
        } catch (error) {
            console.error(`Failed to remove like from post ${postId}:`, error);
            throw error;
        }
    }

    async reverseGeocodeCoordinates(lat: number, lon: number): Promise<string> {
        try {
            console.log(`Reverse geocoding coordinates: ${lat}, ${lon}`);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
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
