import axiosInstance from "./axiosInstance";

const BASE_URL = "/api/users";

export const getAllStudents = async () => {
  const res = await axiosInstance.get(`${BASE_URL}?role=student`);
  return res.data.data || res.data;
};

export const addStudent = async (student) => {
  const res = await axiosInstance.post(BASE_URL, { ...student, role: "student" });
  return res.data;
};

export const updateStudent = async (id, data) => {
  const res = await axiosInstance.put(`${BASE_URL}/update/${id}`, data);
  return res.data;
};

// export const deleteStudent = async (id) => {
//   await axiosInstance.delete(`${BASE_URL}/user/${id}`);
// };
export const deleteStudent = async (id) => {
  await axiosInstance.delete(`${BASE_URL}/user/${id}`);
};
export const assignStudentsToClass = async (classId, studentIds) => {
  const requests = studentIds.map((studentId) =>
    axiosInstance.put(`${BASE_URL}/update/${studentId}`, { classId })
  );
  return Promise.all(requests);
};

export const getUnassignedStudents = async () => {
  const res = await axiosInstance.get(`${BASE_URL}?role=student`);
  return (res.data.data || res.data).filter((student) => !student.classId);
};

export const getStudentProfile = async (studentId) => {
  const res = await axiosInstance.get(`${BASE_URL}/user/${studentId}`);
  return res.data.data || res.data;
};