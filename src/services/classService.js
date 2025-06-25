import axios from "axios";

const API = "https://6836b885664e72d28e41d28e.mockapi.io/api/register";


export const getAllClasses = async () => {
  const res = await axios.get(API);
  return res.data.filter((item) => item.role === "class");
};


export const addClass = async (data) => {
  const res = await axios.post(API, { ...data, role: "class" });
  return res.data;
};


export const deleteClass = async (id) => {
  await axios.delete(`${API}/${id}`);
};

