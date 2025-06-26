import axiosInstance from "./axiosInstance";

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/api/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/users");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/users/user/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`/api/users/update/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getTeachersAndStudents = async () => {
  try {
    const response = await axiosInstance.get("/api/users/principle");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching teachers and students:", error);
    throw error;
  }
};

// Get teachers only
export const getTeachers = async () => {
  try {
    const response = await axiosInstance.get("/api/users/teacher");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const getTeacherProfile = async (teacherId) => {
  try {
    const response = await axiosInstance.get(`/api/users/user/${teacherId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/users/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
