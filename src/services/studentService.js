import axiosInstance from "./axiosInstance";

export const getAllStudents = async () => {
  const res = await axiosInstance.get("/api/users");
  
  return res.data.data || res.data;
};



export const addStudent = async (student) => {
  const res = await axiosInstance.post("/api/users", { ...student, role: "student" });
  return res.data;
};

export const updateStudent = async (id, data) => {
  const res = await axiosInstance.put(`/api/users/update/${id}`, data);
  return res.data;
};

export const deleteStudent = async (id) => {
  await axiosInstance.delete(`/api/users/user/${id}`);
 };
export const assignStudentsToClass = async (classId, studentIds) => {
  const requests = studentIds.map((studentId) =>
    axiosInstance.put(`/api/users/update/${studentId}`, { classId })
  );
  return Promise.all(requests);
};

export const getUnassignedStudents = async () => {
  const res = await axiosInstance.get(`/api/users?role=student`);
  return (res.data.data || res.data).filter((student) => !student.classId);
};

export const getStudentProfile = async (studentId) => {
  const res = await axiosInstance.get(`/api/users/user/${studentId}`);
  return res.data.data || res.data;
};
