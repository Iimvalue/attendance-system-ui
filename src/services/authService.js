import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const signin = async (email, password) => {
  const response = await axios.post(`${API_URL}/signin`, { email, password });

  const token = response.data.data.accessToken;
  const role = response.data.data.user.role;

  if (!token || !role) throw new Error("لا يوجد توكن أو دور في الرد");

  localStorage.setItem("token", token);
  localStorage.setItem("role", role);

  return { token, role };
};