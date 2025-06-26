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
  try {
    const res = await axiosInstance.post(API, data);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error adding class:", error);
    throw error;
  }
};

export const getTeacherClasses = async (teacherId) => {
  try {
    const res = await axiosInstance.get(API);
    console.log("رد السيرفر للصفوف:", res.data);
    
    const classes = res.data.data?.classes || res.data.classes || [];
    
    if (!Array.isArray(classes)) {
      throw new Error("البيانات المستلمة من السيرفر ليست مصفوفة");
    }
    
    // Filter classes assigned to this teacher
    return classes.filter(cls => cls.userId?._id === teacherId);
  } catch (error) {
    console.error("Error fetching teacher classes:", error);
    throw error;
  }
};

export const deleteClass = async (id) => {
  try {
    await axiosInstance.delete(`${API}/${id}`);
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};