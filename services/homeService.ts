import { apiService } from './api';
import { HomeActivityResponse } from '@/components/home/types';

const DEFAULT_ZONE = {
    minLon: 7.52,
    minLat: 30.31,
    maxLon: 11.49,
    maxLat: 37.35,
};

class HomeService {
    async fetchHomeActivity(): Promise<HomeActivityResponse> {
        try {
            const zone = encodeURIComponent(JSON.stringify(DEFAULT_ZONE));
            console.log('🏠 HomeService: Fetching home activity...');
            const response = await apiService.request<HomeActivityResponse>(
                `preferences/home-activity/?zone=${zone}`,
            );
            console.log("response", response);
            console.log('✅ HomeService: Home activity fetched successfully');
            return response;
        } catch (error) {
            console.error('❌ HomeService: Failed to fetch home activity:', error);
            throw error;
        }
    }
}

export const homeService = new HomeService();
