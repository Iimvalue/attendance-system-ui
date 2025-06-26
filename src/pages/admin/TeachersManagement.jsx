import { useEffect, useState } from "react";
import {
  getAllTeachers,
  addTeacher,
  deleteTeacher,
  updateTeacher,
} from "../../services/teacherService";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";

const TeachersManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({ email: "", password: "" });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const data = await getAllTeachers();
      setTeachers(data);
    } catch {
      Swal.fire("خطأ", "فشل تحميل بيانات المعلمين", "error");
    }
  };

  const handleAddTeacher = async () => {
    try {
      if (!newTeacher.email || !newTeacher.password) {
        Swal.fire(
          "تنبيه",
          "يرجى تعبئة البريد الإلكتروني وكلمة المرور",
          "warning"
        );
        return;
      }

      const added = await addTeacher({
        email: newTeacher.email,
        password: newTeacher.password,
        role: "teacher",
      });

      setTeachers((prev) => [...prev, added]);
      setNewTeacher({ email: "", password: "" });

      Swal.fire("تم", "تمت إضافة المعلم بنجاح", "success");
    } catch (error) {
      console.error(
        "📛 خطأ أثناء الإضافة:",
        error.response?.data || error.message
      );
      Swal.fire("خطأ", "حدث خطأ أثناء الإضافة", "error");
    }
  };

  const handleDeleteTeacher = async (id) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      try {
        await deleteTeacher(id);
        setTeachers((prev) => prev.filter((t) => t.id !== id));
        Swal.fire("تم الحذف", "تم حذف المعلم", "success");
      } catch {
        Swal.fire("خطأ", "حدث خطأ أثناء الحذف", "error");
      }
    }
  };

  const handleEditTeacher = async (teacher) => {
    const { value: formValues } = await Swal.fire({
      title: "تعديل المعلم",
      html: `
        <input id="swal-email" class="swal2-input" placeholder="البريد الإلكتروني" value="${teacher.email}" />
        <select id="swal-status" class="swal2-select">
          <option value="true" ${teacher.assigned ? "selected" : ""}>يعمل</option>
          <option value="false" ${!teacher.assigned ? "selected" : ""}>لا يعمل</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          email: document.getElementById("swal-email").value,
          assigned: document.getElementById("swal-status").value === "true",
        };
      },
    });

    if (formValues) {
      try {
        const updated = await updateTeacher(teacher.id, formValues);
        setTeachers((prev) =>
          prev.map((t) => (t.id === teacher.id ? updated : t))
        );
        Swal.fire("تم التحديث", "تم تحديث بيانات المعلم", "success");
      } catch {
        Swal.fire("خطأ", "حدث خطأ أثناء التحديث", "error");
      }
    }
  };

  return (
    <div dir="rtl" className="max-w-6xl mx-auto space-y-6 px-4 py-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-xl font-bold text-[#5196ac] mb-4">إضافة معلم</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="border p-2 rounded w-full sm:w-auto flex-1"
            value={newTeacher.email}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            className="border p-2 rounded w-full sm:w-auto flex-1"
            value={newTeacher.password || ""}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, password: e.target.value })
            }
          />
          <button
            className="bg-[#5196ac] text-white px-4 py-2 rounded w-full sm:w-auto"
            onClick={handleAddTeacher}
          >
            إضافة
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <h3 className="text-xl font-bold text-[#5196ac] mb-4">قائمة المعلمين</h3>
        <table className="min-w-[600px] w-full text-center text-sm">
          <thead>
            <tr className="bg-[#5196ac] text-white">
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">البريد الإلكتروني</th>
              <th className="py-2 px-3">الحالة</th>
              <th className="py-2 px-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-gray-500">
                  لا يوجد معلمين حالياً
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-3">{teacher.id}</td>
                  <td className="py-2 px-3">{teacher.email}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs ${
                        teacher.assigned ? "bg-green-600" : "bg-red-500"
                      }`}
                    >
                      {teacher.assigned ? "يعمل" : "لا يعمل"}
                    </span>
                  </td>
                  <td className="py-2 px-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleEditTeacher(teacher)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(teacher.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeachersManagement;