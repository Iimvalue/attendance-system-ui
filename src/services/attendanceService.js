import axiosInstance from "./axiosInstance";

export const createAttendance = async (data) => {
  const response = await axiosInstance.post("/api/classes/attendance", data);
  return response.data;
};

export const getAttendanceByTeacher = async (teacherId) => {
  const response = await axiosInstance.get(`/api/classes/attendance?attenderId=${teacherId}`);
  return response.data;
};

export const updateAttendance = async (id, data) => {
  const response = await axiosInstance.put(`/api/classes/attendance/${id}`, data);
  return response.data;
};

export const deleteAttendance = async (id) => {
  const response = await axiosInstance.delete(`/api/classes/attendance/${id}`);
  return response.data;
};

export const getStudentsInClass = async (classId) => {
  const response = await axiosInstance.get(`/api/enrollments/class/${classId}`);
  return response.data;
};
