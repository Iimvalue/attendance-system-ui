import axiosInstance from "./axiosInstance";

const BASE_URL = "https://attendance-system-api-wetn.onrender.com/api/users";

export const getAllStudents = async () => {
  const res = await axiosInstance.get(`${BASE_URL}`);
  console.log(axiosInstance);

  return res.data.data || res.data;
};

export const addStudent = async (studentData) => {
  try {
    const response = await axiosInstance.post("/api/users", {
      email: studentData.email,
      password: studentData.password,
      role: "student",
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ خطأ أثناء إضافة الطالب:",
      error.response?.data || error.message
    );
    throw error;
  }
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
