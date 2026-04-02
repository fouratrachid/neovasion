import axios from 'axios';

const BASE_URL = 'https://dev-api.neovasion.com/api';

export const axiosClient = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosClient.interceptors.request.use(
    async (config) => {
        // Token will be added if needed by the ApiService
        // This interceptor can be extended for future middleware
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
