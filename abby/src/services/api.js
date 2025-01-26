import axios from "axios";

// 創建 axios 實例
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // 從環境變數中讀取 API 基本路徑
});

// 發送分析請求
export const analyzeData = async (userQuery) => {
    try {
        const response = await api.post('/analyze', { user_query: userQuery });
        return response.data;
    } catch (error) {
        console.error('Error analyzing data:', error);
        throw error;
    }
};

export default api;

