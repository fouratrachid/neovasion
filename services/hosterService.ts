import { apiService } from './api';

export interface SocialEntry {
  social: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter' | 'linkedin';
  sociallink: string;
  followers: number;
}

export interface HosterRequestPayload {
  phone: string;
  role: string;
  socials: SocialEntry[];
}

export interface HosterRequestResponse {
  user: string;
  phone: string;
  role: string;
  socials: Array<SocialEntry & { _id: string }>;
  status: 'Pending' | 'Approved' | 'Rejected';
  motifRefus: string | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
}

export const hosterService = new HosterService();
