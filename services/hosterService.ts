import { apiService } from './api';

export interface SocialEntry {
  social: string; // Allow custom platform names
  sociallink: string;
  followers: number;
}

export interface HosterRequestPayload {
  phone: string;
  role: string;
  socials: SocialEntry[];
}

export interface HosterRequestResponse {
  id?: string;
  _id?: string;
  user: string | {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  phone: string;
  role: string;
  socials: Array<SocialEntry & { _id: string }>;
  status: 'Pending' | 'Approved' | 'Rejected';
  motifRefus: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

class HosterService {
  async submitHosterRequest(payload: HosterRequestPayload): Promise<HosterRequestResponse> {
    try {
      console.log('🎯 HosterService: Submitting hoster request...');
      const response = await apiService.request<HosterRequestResponse>(
        'demande-hosters/',
        {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('✅ HosterService: Hoster request submitted successfully');
      return response;
    } catch (error) {
      console.error('❌ HosterService: Failed to submit hoster request:', error);
      throw error;
    }
  }

  async fetchHosterRequestStatus(): Promise<HosterRequestResponse> {
    try {
      console.log('🎯 HosterService: Fetching hoster request status...');
      const response = await apiService.request<HosterRequestResponse>(
        'demande-hosters/me',
        {
          method: 'GET',
        },
      );
      console.log('✅ HosterService: Hoster request status fetched successfully');
      return response;
    } catch (error) {
      console.error('❌ HosterService: Failed to fetch hoster request status:', error);
      throw error;
    }
  }

  async deleteHosterRequest(): Promise<{ message: string }> {
    try {
      console.log('🎯 HosterService: Deleting existing hoster request...');
      const response = await apiService.request<{ message: string }>(
        'demande-hosters/',
        {
          method: 'DELETE',
        },
      );
      console.log('✅ HosterService: Hoster request deleted successfully');
      return response;
    } catch (error) {
      console.error('❌ HosterService: Failed to delete hoster request:', error);
      throw error;
    }
  }
}

export const hosterService = new HosterService();
