import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

export const getUser = async () => {
    const response = await apiClient.get('/user'); // 假設後端提供 `/user` 路由
    return response.data;
};
