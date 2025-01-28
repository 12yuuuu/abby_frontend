import axios from "axios";

// 創建 axios 實例
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // 從環境變數中讀取 API 基本路徑
});

// 發送分析請求
export const analyzeData = async (userQuery) => {
    try {
        const postResponse = await api.post('/agent', { query: userQuery });
        const { id } = postResponse.data;

        const getResponse = await api.get(`/agent/${id}`);
        return getResponse.data;
    } catch (error) {
        console.error('Error analyzing data:', error);
        throw error;
    }
};

export default api;

