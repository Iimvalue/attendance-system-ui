import axios from "axios";

const API_BASE_URL = "https://attendance-system-api-wetn.onrender.com/api/classes";

export const getAllClasses = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found, user might not be logged in.");

    const response = await axios.get(API_BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Classes API response:", response.data);

    // إذا البيانات مضمنة في خاصية أخرى مثل response.data.classes
    // عدل السطر التالي بحسب شكل الرد
    return Array.isArray(response.data) ? response.data : response.data.classes || [];

  } catch (error) {
    console.error("Failed to fetch classes:", error);
    throw error;
  }
};

export const addClass = async (newClass) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found, user might not be logged in.");

    const response = await axios.post(API_BASE_URL, newClass, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add class:", error);
    throw error;
  }
};

export const deleteClass = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found, user might not be logged in.");

    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete class:", error);
    throw error;
  }
};

export const unassignUserFromClass = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found, user might not be logged in.");

    const response = await axios.put(
      `${API_BASE_URL}/unassign`,
      { userId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to unassign user:", error);
    throw error;
  }
};