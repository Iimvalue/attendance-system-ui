// services/axiosInstance.js
import axios from "axios";
import { getValidToken, isTokenExpired } from "./tokenService";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
  baseURL: "https://attendance-system-api-wetn.onrender.com",
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = getValidToken();
    
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("Token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        
        return Promise.reject(new Error('Token expired'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (refreshToken) {
          const refreshResponse = await axios.post(
            `${axiosInstance.defaults.baseURL}/api/auth/refresh`,
            { refreshToken }
          );
          
          const newToken = refreshResponse.data.data.accessToken;
          const newRefreshToken = refreshResponse.data.data.refreshToken;
          
          localStorage.setItem("token", newToken);
          localStorage.setItem("Token", newToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        localStorage.clear();
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;