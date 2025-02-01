import axios from "axios";

// 創建 axios 實例
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// 發送分析請求
export const analyzeData = async (userQuery) => {
    try {
        // 首先發送 POST 請求
        const postResponse = await api.post('/agent', {
            query: userQuery,
            // 確保發送所有必要的欄位
            id: undefined  // 讓後端生成 ID
        });
        
        // 確保我們有得到 ID
        if (!postResponse.data || !postResponse.data.id) {
            throw new Error('No ID received from POST request');
        }

        // 使用收到的 ID 發送 GET 請求
        const getResponse = await api.get(`/agent/${postResponse.data.id}`);
        
        // 檢查響應格式
        if (!getResponse.data || !getResponse.data.analysis || !getResponse.data.data) {
            throw new Error('Invalid response format from GET request');
        }

        return {
            analysis: getResponse.data.analysis,
            data: getResponse.data.data
        };
    } catch (error) {
        // 更詳細的錯誤處理
        if (error.response) {
            // 服務器回應了錯誤狀態碼
            console.error('Server Error:', error.response.data);
            throw new Error(error.response.data.message || '服務器錯誤');
        } else if (error.request) {
            // 請求已發送但沒有收到回應
            console.error('No Response:', error.request);
            throw new Error('無法連接到服務器');
        } else {
            // 請求設置時發生錯誤
            console.error('Request Error:', error.message);
            throw error;
        }
    }
};

// 添加請求攔截器
api.interceptors.request.use(
    config => {
        // 添加必要的headers
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 添加響應攔截器
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api;