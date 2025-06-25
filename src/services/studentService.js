import axios from "axios";

const BASE_URL = "https://6836b885664e72d28e41d28e.mockapi.io/api/register";

export const getUnassignedStudents = async () => {
  const res = await axios.get(BASE_URL);

  return res.data.filter(
    (item) => item.role === "student" && item.assigned === false
  );
};
export const assignStudentsToClass = async (classId, studentIds) => {
    const requests = studentIds.map((id) =>
      axios.put(`${BASE_URL}/${id}`, {
        classId,
        assigned: true,
      })
    );
    return Promise.all(requests);
  };
export const getAllStudents = async () => {
  const response = await axios.get(BASE_URL);

  return response.data.filter((item) => item.role === "student");
};

export const addStudent = async (student) => {
  const response = await axios.post(BASE_URL, {
    ...student,
    role: "student",
    assigned: false,
  });
  return response.data;
};

export const deleteStudent = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const assignStudent = async (id, assigned) => {
  const response = await axios.put(`${BASE_URL}/${id}`, { assigned });
  return response.data;
};

export const updateStudent = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};
// export const getStudentProfile = async (studentId) => {
//     const response = await axios.get(`${BASE_URL}/${studentId}`);
//     return response.data;
//   };

export const getStudentProfile = async () => {
    const response = await axios.get(BASE_URL);
    return response.data.find((item) => item.role === "student");
  };