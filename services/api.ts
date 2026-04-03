
import { axiosClient } from '@/api/axiosClient';
import * as SecureStore from 'expo-secure-store';
import { AxiosRequestConfig } from 'axios';

export const API_BASE_URL = axiosClient.defaults.baseURL;
const TOKEN_KEY = 'auth_token';

class ApiService {

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.log('⚠️ Failed to get token from secure store:', error);
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      console.log('✅ Token stored successfully');
    } catch (error) {
      console.log('⚠️ Failed to set token in secure store:', error);
    }
  }

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      console.log('🗑️ Token removed successfully');
    } catch (error) {
      console.log('⚠️ Failed to remove token from secure store:', error);
    }
  }

  public async requestWithFormData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Axios handles FormData automatically if passed as data
    return this.request<T>(endpoint, options);
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Interceptor now handles token natively 
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config: AxiosRequestConfig = {
      url: endpoint,
      method: options.method || 'GET',
      headers,
    };

    // Handle FormData
    if (options.body instanceof FormData) {
      config.data = options.body;
      config.headers = { ...config.headers, 'Content-Type': 'multipart/form-data' };
    } else if (options.body) {
      // Handle regular JSON body
      console.log('🔍 API Service - Raw body string BEFORE parse:', options.body);
      config.data = JSON.parse(options.body as string);
      console.log('🔍 API Service - Parsed data:', JSON.stringify(config.data));
    }

    try {
      console.log(`🔗 Making API request to ${endpoint} with config:`, config);
      const response = await axiosClient.request<T>(config);
      console.log(`✅ API request successful for ${endpoint}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data?.error || `HTTP error! status: ${error.response.status}`;
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  async updateToken(newToken: string): Promise<void> {
    console.log('🔄 Manually updating stored token');
    await this.setToken(newToken);
  }

  async clearToken(): Promise<void> {
    console.log('🗑️ Manually clearing stored token');
    await this.removeToken();
  }

  async getCurrentToken(): Promise<string | null> {
    return this.getToken();
  }


}

export const apiService = new ApiService();
