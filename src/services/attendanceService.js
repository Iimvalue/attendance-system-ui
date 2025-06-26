import axios from "axios";

// const BASE_URL = "https://attendance-system-api-mihy.onrender.com/api/classes/attendance";
// const ENROLLMENT_URL = "https://attendance-system-api-mihy.onrender.com/api/enrollments";

// https://attendance-system-api-wetn.onrender.com


export const createAttendance = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const getAttendanceByTeacher = async (teacherId) => {
  const response = await axios.get(`${BASE_URL}?attenderId=${teacherId}`);
  return response.data;
};

export const updateAttendance = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteAttendance = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export const getStudentsInClass = async (classId) => {
  const response = await axios.get(`${ENROLLMENT_URL}/class/${classId}`);
  return response.data;
};
