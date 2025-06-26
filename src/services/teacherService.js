// services/teacherService.js
import axiosInstance from "./axiosInstance";

const BASE_URL = "/api/users";

export const getAllTeachers = async () => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/teacher`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const getTeacherProfile = async (teacherId) => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/user/${teacherId}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    throw error;
  }
};

export const addTeacher = async (teacher) => {
  try {
    const res = await axiosInstance.post(BASE_URL, { ...teacher, role: "teacher" });
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error adding teacher:", error);
    throw error;
  }
};

export const updateTeacher = async (id, data) => {
  try {
    const res = await axiosInstance.put(`${BASE_URL}/update/${id}`, data);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error updating teacher:", error);
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  try {
    const res = await axiosInstance.delete(`${BASE_URL}/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting teacher:", error);
    throw error;
  }
};

export const assignTeachersToClass = async (classId, teacherIds) => {
  try {
    const requests = teacherIds.map((teacherId) =>
      axiosInstance.put(`${BASE_URL}/update/${teacherId}`, { classId })
    );
    return Promise.all(requests);
  } catch (error) {
    console.error("Error assigning teachers to class:", error);
    throw error;
  }
};

export const getUnassignedTeachers = async () => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/teacher`);
    const teachers = res.data.data || res.data;
    return teachers.filter((teacher) => !teacher.classId);
  } catch (error) {
    console.error("Error fetching unassigned teachers:", error);
    throw error;
  }
};