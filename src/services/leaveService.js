import axiosInstance from "./axiosInstance";

const API_URL = "/api/leaves";

export const getAllLeaves = async () => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

export const createLeave = async (leave) => {
  const response = await axiosInstance.post(API_URL, leave);
  return response.data;
};

export const getLeavesByStudentId = async (studentId) => {
  const response = await axiosInstance.get(`${API_URL}/student/${studentId}`);
  return response.data;
};

export const getLeavesByClassId = async (classId) => {
  const response = await axiosInstance.get(`${API_URL}/class/${classId}`);
  return response.data;
};

export const deleteLeave = async (leaveId) => {
  await axiosInstance.delete(`${API_URL}/${leaveId}`);
};

export const acceptLeave = async (leaveId) => {
  const response = await axiosInstance.post(`${API_URL}/${leaveId}/accept`);
  return response.data;
};

export const rejectLeave = async (leaveId) => {
  const response = await axiosInstance.post(`${API_URL}/${leaveId}/reject`);
  return response.data;
};

// Aliases for backward compatibility with existing components
export const getStudentExcuses = getLeavesByStudentId;
export const submitExcuse = createLeave;
export const getAllExcuses = getAllLeaves;
export const updateExcuseStatus = async (id, status) => {
  if (status === 'accepted') {
    return await acceptLeave(id);
  } else if (status === 'rejected') {
    return await rejectLeave(id);
  }
  throw new Error('Invalid status. Use "accepted" or "rejected"');
};
export const deleteExcuse = deleteLeave;
export const acceptExcuse = acceptLeave;
export const rejectExcuse = rejectLeave;
