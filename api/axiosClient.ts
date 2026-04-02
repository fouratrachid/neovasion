import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@/stores/authStore';

const BASE_URL = 'https://dev-api.neovasion.com/api';

export const axiosClient = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    // React Native specific configs
    httpAgent: undefined,
    httpsAgent: undefined,
    validateStatus: (status) => status < 500, // Don't reject on 4xx
});

// Request Interceptor
axiosClient.interceptors.request.use(
    async (config) => {
        const requestId = Math.random().toString(36).substring(7);
        console.time(`Request-${requestId}`);
        console.log(`📤 [${requestId}] Starting request to ${config.url}`);

        try {
            const { isAuthenticated } = useAuthStore.getState();

            if (isAuthenticated) {
                console.log(`🔐 [${requestId}] Retrieving token from SecureStore...`);
                try {
                    const token = await Promise.race([
                        SecureStore.getItemAsync('auth_token'),
                        new Promise<null>((_, reject) =>
                            setTimeout(() => reject(new Error('SecureStore timeout')), 3000)
                        )
                    ]);
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                        console.log(`✅ [${requestId}] Token attached`);
                    }
                } catch (tokenError) {
                    console.warn(`⚠️ [${requestId}] Token retrieval failed:`, tokenError);
                }
            } else {
                console.log(`👤 [${requestId}] Unauthenticated - no token`);
            }
        } catch (error) {
            console.warn(`⚠️ [${requestId}] Interceptor error:`, error);
        }

        console.log(`✅ [${requestId}] Config finalized, sending request`);
        console.timeEnd(`Request-${requestId}`);
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosClient.interceptors.response.use(
    (response) => {
        console.log(`✅ Response received: ${response.status} from ${response.config.url}`);
        return response;
    },
    (error) => {
        const requestUrl = error.config?.url || 'unknown';
        console.log(`⏱️ Response interceptor error for ${requestUrl}:`, {
            code: error.code,
            message: error.message,
            timeout: error.timeout,
            hasResponse: !!error.response,
            status: error.response?.status,
        });

        if (error.code === 'ECONNABORTED') {
            console.error(`⏱️ REQUEST TIMEOUT - ${requestUrl} took too long (15s exceeded)`);
        } else if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
            console.error(`🌐 NETWORK ERROR - Check internet connection for ${requestUrl}`);
        } else if (error.response?.status === 401) {
            console.warn(`🔐 UNAUTHORIZED - Token expired for ${requestUrl}`);
        } else if (!error.response && error.message) {
            console.error(`❌ REQUEST FAILED - ${requestUrl}: ${error.message}`);
        } else if (error.response) {
            console.error(`❌ API ERROR ${error.response.status} - ${requestUrl}:`, error.response.data);
        }

        return Promise.reject(error);
    }
);
