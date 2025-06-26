import axios from "axios";

const API_URL = "https://attendance-system-api-wetn.onrender.com//api/classes/attendance";

export const updateExcuseStatus = async (id, status) => {
  const response = await axios.put(
    `https://6836b885664e72d28e41d28e.mockapi.io/api/register/${id}`,
    {
      status,
    }
  );
  return response.data;
};
export const getAllExcuses = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.filter((item) => item.role === "excuse");
};

export const submitExcuse = async (excuse) => {
  const response = await axios.post(BASE_URL, {
    ...excuse,
    role: "excuse",
    status: "pending",
  });
  return response.data;
};

export const acceptExcuse = async (id) => {
  const response = await axios.put(`${BASE_URL}/${id}`, {
    status: "accepted",
  });
  return response.data;
};

export const rejectExcuse = async (id) => {
  const response = await axios.put(`${BASE_URL}/${id}`, {
    status: "rejected",
  });
  return response.data;
};

export const deleteExcuse = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
export const getStudentExcuses = async (studentId) => {
  const response = await axios.get(BASE_URL);
  return response.data.filter(
    (item) => item.role === "excuse" && item.studentId === studentId
  );
};
