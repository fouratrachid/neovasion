import { SendOtpRequest, VerifyOtpRequest, AuthResponse, User, LoginRequest } from "@/types/api";
import { apiService } from "./api";

class AuthService {

    async sendOtp(data: SendOtpRequest): Promise<AuthResponse> {
        console.log('📨 Sending OTP for:', data.email);
        const response = await apiService.request<AuthResponse>('auth/send-otp', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response;
    }

    async clearToken(): Promise<void> {
        console.log('🗑️ Clearing token from API client');
        await apiService.removeToken();
    }

    async login(data: LoginRequest): Promise<AuthResponse> {
        console.log('🔑 Logging in user:', data.email);
        const response = await apiService.request<AuthResponse>('auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response.data?.token) {
            await apiService.setToken(response.data.token);
        }

        return response;
    }

    async verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
        console.log('🔐 Verifying OTP for:', data.email);
        const response = await apiService.request<AuthResponse>('auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify(data),
        });



        if (response.data?.token) {
            await apiService.setToken(response.data.token);
        }

        return response;
    }

    async getCurrentUser(): Promise<User> {
        console.log('👤 Fetching current user');
        const response = await apiService.request<any>('auth/me', {
            method: 'GET'
        });

        return response.data.user;
    }

    async logout(): Promise<void> {
        console.log('🗑️ Clearing stored token');
        await apiService.removeToken();
    }

}

export const authService = new AuthService();
