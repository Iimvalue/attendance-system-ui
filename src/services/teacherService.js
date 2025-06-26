// services/teacherService.js
import axiosInstance from "./axiosInstance";

const BASE_URL = "/api/users";

export const getAllTeachers = async () => {
  const res = await axiosInstance.get(`${BASE_URL}?role=teacher`);
  return res.data.data || res.data;
};

export const addTeacher = async (teacher) => {
  const res = await axiosInstance.post(BASE_URL, { ...teacher, role: "teacher" });
  return res.data.data || res.data;
};

export const updateTeacher = async (id, data) => {
  const res = await axiosInstance.put(`${BASE_URL}/update/${id}`, data);
  return res.data.data || res.data;
};

export const deleteTeacher = async (id) => {

  throw new Error("حذف المعلمين غير مدعوم حالياً في الباكند.");
};

export const assignTeachersToClass = async (classId, teacherIds) => {
  const requests = teacherIds.map((teacherId) =>
    axiosInstance.put(`/api/users/update/${teacherId}`, { classId })
  );
  return Promise.all(requests);
};

export const getUnassignedTeachers = async () => {
  const res = await axiosInstance.get(`${BASE_URL}?role=teacher`);
  return (res.data.data || res.data).filter((teacher) => !teacher.classId);
};