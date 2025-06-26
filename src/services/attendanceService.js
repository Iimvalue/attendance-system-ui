import axiosInstance from "./axiosInstance";

export const createAttendance = async (data) => {
  const response = await axiosInstance.post("/api/attendance", data);
  return response.data;
};

export const getAttendanceByTeacher = async (teacherId) => {
  const response = await axiosInstance.get(`/api/attendance/teacher/${teacherId}`);
  return response.data;
};

export const updateAttendance = async (id, data) => {
  const response = await axiosInstance.put(`/api/attendance/${id}`, data);
  return response.data;
};

export const deleteAttendance = async (id) => {
  const response = await axiosInstance.delete(`/api/attendance/${id}`);
  return response.data;
};
