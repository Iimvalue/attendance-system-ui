import axios from "axios";
import { validateToken, getUserFromToken, getValidToken } from "./tokenService";

const API_URL = "https://attendance-system-api-wetn.onrender.com/api/auth";

export const signin = async (email, password) => {
  const response = await axios.post(`${API_URL}/signin`, { email, password });

  const token = response.data.data.accessToken;
  const refreshToken = response.data.data.refreshToken;
  const user = response.data.data.user;

  if (!token || !user) throw new Error("لا يوجد توكن أو معلومات مستخدم في الرد");

  if (!validateToken(token)) {
    throw new Error("التوكن المستلم غير صالح");
  }

  localStorage.setItem("token", token);
  localStorage.setItem("Token", token); 
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("role", user.role);
  localStorage.setItem("userId", user.id);
  localStorage.setItem("userEmail", user.email);

  return { 
    token, 
    refreshToken,
    role: user.role, 
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
};

export const signout = async () => {
  const token = getValidToken();
  
  if (token) {
    try {
      await axios.post(
        `${API_URL}/signout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.warn("Error during signout request:", error);
    }
  }
  
  localStorage.removeItem("token");
  localStorage.removeItem("Token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!refreshToken) {
      throw new Error("لا يوجد رمز تحديث متاح");
    }

    const response = await axios.post(`${API_URL}/refresh`, {
      refreshToken: refreshToken
    });

    const newToken = response.data.data.accessToken;
    const newRefreshToken = response.data.data.refreshToken;

    if (!validateToken(newToken)) {
      throw new Error("التوكن الجديد غير صالح");
    }

    localStorage.setItem("token", newToken);
    localStorage.setItem("Token", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return { 
      accessToken: newToken, 
      refreshToken: newRefreshToken 
    };
  } catch (error) {
    console.error("Token refresh failed:", error);
    signout();
    throw new Error("فشل في تحديث ");
  }
};

export const getCurrentUser = () => {
  const token = getValidToken();
  if (!token) return null;
  
  return getUserFromToken(token);
};

export const isAuthenticated = () => {
  return getValidToken() !== null;
};