import axiosInstance from "./axiosInstance";

// دالة تجلب الطلاب المسجلين في فصل معين
export const getStudentsInClass = async (classId) => {
  try {
    const res = await axiosInstance.get(`/api/classes/${classId}/students`);
    return res;
  } catch (error) {
    console.error("فشل في جلب الطلاب للفصل:", error);
    return { data: { enrollments: [] } };
  }
};
