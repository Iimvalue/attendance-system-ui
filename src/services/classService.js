import axiosInstance from "./axiosInstance";

const API = "/api/classes";

export const getAllClasses = async () => {
  const res = await axiosInstance.get(API);

  console.log("رد السيرفر للصفوف:", res.data);

  const classes = res.data.data?.classes;

  if (!Array.isArray(classes)) {
    throw new Error("البيانات المستلمة من السيرفر ليست مصفوفة");
  }

  return classes;
};

export const addClass = async (data) => {
  const res = await axiosInstance.post(API, data);
  return res.data.data || res.data;
};

export const deleteClass = async (id) => {
  await axiosInstance.delete(`${API}/${id}`);
};