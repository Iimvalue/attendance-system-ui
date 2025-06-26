import axios from "axios";

// دالة تجلب الطلاب المسجلين في فصل معين
export const getStudentsInClass = async (classId) => {
  try {
    const res = await axios.get(
      `https://attendance-system-api-wetn.onrender.com/api/classes/${classId}/students`
    );
    return res;
  } catch (error) {
    console.error("فشل في جلب الطلاب للفصل:", error);
    return { data: { enrollments: [] } };
  }
};
