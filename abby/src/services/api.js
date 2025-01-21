import axios from "axios";

// 創建 axios 實例
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});
  

// 獲取用戶列表
export const getUsers = async (params) => {
  const response = await api.get("", { params });
  return response.data;
};

// 新增用戶
export const addUser = async (userData) => {
  const response = await api.post("", userData);
  return response.data;
};

// 更新用戶
export const updateUser = async (id, userData) => {
  const response = await api.put(`/${id}`, userData);
  return response.data;
};

// 刪除用戶
export const deleteUser = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export default api;

