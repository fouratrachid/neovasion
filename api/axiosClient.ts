import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://dev-api.neovasion.com/api';

export const axiosClient = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    // Required to send HTTP-Only cookies on some endpoints for refresh
    withCredentials: true 
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (val: string) => void, reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Auto-Inject Auth Header
axiosClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('auth_token');
            if (token && config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (e) {
            console.warn("Failed retrieving standard token");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Manage Token Expirations (401)
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const requestUrl = originalRequest?.url || 'unknown';

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If it's already refreshing, queue the request until the new token arrives
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return axiosClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Manually trigger refresh using a raw axios instance to prevent loop interceptors
                const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                });
                
                // Parse the payload based on exact potential API standards
                const newAccessToken = response.data?.accessToken || response.data?.data?.accessToken || response.data?.data?.token;

                if (newAccessToken) {
                    // Update Secure DB
                    await SecureStore.setItemAsync('auth_token', newAccessToken);

                    // Re-route Failed Queries
                    processQueue(null, newAccessToken);
                    
                    // Re-run Original Blocked Action
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosClient(originalRequest);
                } else {
                    throw new Error("No payload found on refresh token");
                }
            } catch (err) {
                // Irrecoverable auth state
                processQueue(err, null);
                await SecureStore.deleteItemAsync('auth_token').catch(() => {});
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        // Basic Network Logging Handler
        if (error.code === 'ECONNABORTED') {
            console.error(`⏱️ REQUEST TIMEOUT - ${requestUrl} took too long`);
        } else if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
            console.error(`🌐 NETWORK ERROR - Check internet connection`);
        }

        return Promise.reject(error);
    }
);
