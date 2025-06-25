import axiosInstance from "./axiosInstance"; 


export const getAllStudents = async () => {
  const response = await axiosInstance.get("/users");
  return response.data.filter((item) => item.role === "student");
};


export const getUnassignedStudents = async () => {
  const res = await axiosInstance.get("/users");
  return res.data.filter(
    (item) => item.role === "student" && item.assigned === false
  );
};


export const addStudent = async (student) => {
  const response = await axiosInstance.post("/users", {
    ...student,
    role: "student",
    assigned: false,
  });
  return response.data;
};


export const deleteStudent = async (id) => {
  await axiosInstance.delete(`/users/${id}`);
};


export const updateStudent = async (id, data) => {
  const response = await axiosInstance.put(`/users/update/${id}`, data);
  return response.data;
};


export const assignStudent = async (id, assigned) => {
  const response = await axiosInstance.put(`/users/update/${id}`, { assigned });
  return response.data;
};


export const assignStudentsToClass = async (classId, studentIds) => {
  const requests = studentIds.map((id) =>
    axiosInstance.put(`/users/update/${id}`, {
      classId,
      assigned: true,
    })
  );
  return Promise.all(requests);
};


export const getStudentProfile = async () => {
  const response = await axiosInstance.get("/users");
  return response.data.find((item) => item.role === "student");
};