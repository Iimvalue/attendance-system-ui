import axiosInstance from "./axiosInstance";

const API_URL = "/api/classes/attendance";

export const updateExcuseStatus = async (id, status) => {
  const response = await axiosInstance.put(`/api/register/${id}`, {
    status,
  });
  return response.data;
};

export const getAllExcuses = async () => {
  const response = await axiosInstance.get(API_URL);
  return response.data.filter((item) => item.role === "excuse");
};

export const submitExcuse = async (excuse) => {
  const response = await axiosInstance.post(API_URL, {
    ...excuse,
    role: "excuse",
    status: "pending",
  });
  return response.data;
};

export const acceptExcuse = async (id) => {
  const response = await axiosInstance.put(`${API_URL}/${id}`, {
    status: "accepted",
  });
  return response.data;
};

export const rejectExcuse = async (id) => {
  const response = await axiosInstance.put(`${API_URL}/${id}`, {
    status: "rejected",
  });
  return response.data;
};

export const deleteExcuse = async (id) => {
  await axiosInstance.delete(`${API_URL}/${id}`);
};

export const getStudentExcuses = async (studentId) => {
  const response = await axiosInstance.get(API_URL);
  return response.data.filter(
    (item) => item.role === "excuse" && item.studentId === studentId
  );
};
