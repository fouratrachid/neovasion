import { apiService } from './api';

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface UserProfileResponse {
  success: boolean;
  data: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    imageLink: string | null;
  };
}

export interface SignUpStep1Response {
  success: boolean;
  message: string;
  data: {
    email: string;
  };
}

class AuthService {
  async signUpStep1(email: string, firstName: string, lastName: string): Promise<SignUpStep1Response> {
    const response = await apiService.request<SignUpStep1Response>('auth/signup1', {
      method: 'POST',
      body: JSON.stringify({ email, firstName, lastName }),
    });
    return response;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiService.request<LoginResponse>('auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    console.log('🔍 Login response:', response);

    if (response.accessToken) {
      await apiService.setToken(response.accessToken);
    }

    return response;
  }

  async getMe(): Promise<UserProfileResponse> {
    return apiService.request<UserProfileResponse>('users/me', {
      method: 'GET'
    });
  }

  async logout(): Promise<void> {
    await apiService.removeToken();
  }
}

export const authService = new AuthService();
