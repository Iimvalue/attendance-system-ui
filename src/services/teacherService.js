import axios from "axios";

const BASE_URL = "https://6836b885664e72d28e41d28e.mockapi.io/api/register";


export const getAllTeachers = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.filter((item) => item.role === "teacher");
};


export const getUnassignedTeachers = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.filter(
    (item) => item.role === "teacher" && item.assigned === false
  );
};


export const addTeacher = async (teacher) => {
  const response = await axios.post(BASE_URL, {
    ...teacher,
    role: "teacher",
    assigned: false,
  });
  return response.data;
};


export const deleteTeacher = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};


export const assignTeachersToClass = async (classId, teacherIds) => {
  const requests = teacherIds.map((id) =>
    axios.put(`${BASE_URL}/${id}`, {
      classId,
      assigned: true,
    })
  );
  return Promise.all(requests);
};