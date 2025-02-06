import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export const analyzeData = async (userQuery) => {
    try {
        const response = await api.post('/agent', {
            query: userQuery  // 修正：直接傳送 query 參數
        });
        
        if (!response.data) {
            throw new Error('No response data received');
        }

        return {
            analysis: response.data.analysis,
            data: response.data.data
        };
    } catch (error) {
        let errorMessage = '發生未知錯誤';
        let errorDetails = '';

        if (error.response) {
            // 服務器回應的錯誤
            errorMessage = error.response.data.message || '服務器錯誤';
            errorDetails = `狀態碼: ${error.response.status}\n` +
                         `錯誤詳情: ${JSON.stringify(error.response.data)}\n` +
                         `請求 URL: ${error.config.url}\n` +
                         `請求數據: ${JSON.stringify(error.config.data)}`;
        } else if (error.request) {
            // 請求發送但沒有收到回應
            errorMessage = '無法連接到服務器';
            errorDetails = `請求詳情: ${JSON.stringify(error.request)}`;
        } else {
            // 請求設置時發生錯誤
            errorMessage = error.message;
            errorDetails = error.stack;
        }

        console.error('API Error:', {
            message: errorMessage,
            details: errorDetails,
            error: error
        });

        throw {
            message: errorMessage,
            details: errorDetails,
            originalError: error
        };
    }
};

// 更新請求攔截器以包含錯誤追蹤
api.interceptors.request.use(
    config => {
        console.log('Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data
        });
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        console.error('Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);

// 更新響應攔截器以包含詳細日誌
api.interceptors.response.use(
    response => {
        console.log('Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    error => {
        console.error('Response Interceptor Error:', {
            config: error.config,
            response: error.response,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export default api;