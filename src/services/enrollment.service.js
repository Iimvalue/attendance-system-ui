import axiosInstance from "./axiosInstance";

export const getStudentsInClass = async (classId) => {
  try {
    const res = await axiosInstance.get(`/api/enrollments/class/${classId}`);
    return res;
  } catch (error) {
    console.error("فشل في جلب الطلاب للفصل:", error);
    return { data: { enrollments: [] } };
  }
};

export const getStudentsByTeacher = async (teacherId) => {
  try {
    const res = await axiosInstance.get(`/api/enrollments/teacher/${teacherId}/students`);
    return res;
  } catch (error) {
    console.error("فشل في جلب طلاب المعلم:", error);
    return { data: { enrollments: [] } };
  }
};

// دالة تجلب جميع التسجيلات
export const getAllEnrollments = async () => {
  try {
    const res = await axiosInstance.get('/api/enrollments');
    return res;
  } catch (error) {
    console.error("فشل في جلب التسجيلات:", error);
    return { data: [] };
  }
};

export const getEnrollmentsByUser = async (userId) => {
  try {
    const res = await axiosInstance.get(`/api/enrollments/user/${userId}`);
    return res;
  } catch (error) {
    console.error("فشل في جلب تسجيلات المستخدم:", error);
    return { data: [] };
  }
};

export const getEnrollmentById = async (id) => {
  try {
    const res = await axiosInstance.get(`/api/enrollments/${id}`);
    return res;
  } catch (error) {
    console.error("فشل في جلب التسجيل:", error);
    return { data: null };
  }
};

export const createEnrollment = async (data) => {
  try {
    const res = await axiosInstance.post('/api/enrollments', data);
    return res;
  } catch (error) {
    console.error("فشل في إنشاء التسجيل:", error);
    throw error;
  }
};

export const updateEnrollment = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/api/enrollments/${id}`, data);
    return res;
  } catch (error) {
    console.error("فشل في تحديث التسجيل:", error);
    throw error;
  }
};

// دالة حذف تسجيل
export const deleteEnrollment = async (id) => {
  try {
    const res = await axiosInstance.delete(`/api/enrollments/${id}`);
    return res;
  } catch (error) {
    console.error("فشل في حذف التسجيل:", error);
    throw error;
  }
};
