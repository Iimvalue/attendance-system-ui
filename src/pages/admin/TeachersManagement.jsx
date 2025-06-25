import { useEffect, useState } from "react";
import {
  getAllTeachers,
  addTeacher,
  deleteTeacher,
} from "../../services/teacherService";
import Swal from "sweetalert2";

export default function TeachersManagement() {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "" });

  useEffect(() => {
    getAllTeachers().then(setTeachers);
  }, []);

  const handleAddTeacher = async () => {
    if (!newTeacher.name || !newTeacher.email) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "جميع الحقول مطلوبة.",
      });
      return;
    }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(newTeacher.email)) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "بريد غير صالح",
    //     text: "يرجى إدخال بريد إلكتروني صحيح.",
    //   });
    //   return;
    // }

    try {
      const added = await addTeacher(newTeacher);
      setTeachers((prev) => [...prev, added]);
      setNewTeacher({ name: "", email: "" });

      Swal.fire({
        icon: "success",
        title: "تمت الإضافة",
        text: "تم إضافة المعلم بنجاح.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "خطأ في الإضافة",
        text: "حدث خطأ أثناء محاولة الإضافة.",
      });
    }
  };

  const handleDeleteTeacher = async (id) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      try {
        await deleteTeacher(id);
        setTeachers((prev) => prev.filter((t) => t.id !== id));

        Swal.fire({
          icon: "success",
          title: "تم الحذف",
          text: "تم حذف المعلم.",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء الحذف.",
        });
      }
    }
  };

  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-xl font-bold text-[#5196ac] mb-4">إضافة معلم</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="اسم المعلم"
            className="border p-2 rounded w-full"
            value={newTeacher.name}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, name: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="border p-2 rounded w-full"
            value={newTeacher.email}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, email: e.target.value })
            }
          />
          <button
            className="bg-[#5196ac] text-white px-4 py-2 rounded"
            onClick={handleAddTeacher}
          >
            إضافة
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-xl font-bold text-[#5196ac] mb-4">
          قائمة المعلمين
        </h3>
        <table className="w-full text-center">
          <thead>
            <tr className="bg-[#5196ac] text-white">
              <th className="py-2 px-4">الرقم</th>
              <th className="py-2 px-4">الاسم</th>
              <th className="py-2 px-4">البريد الإلكتروني</th>
              <th className="py-2 px-4">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr
                key={teacher.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{teacher.name}</td>
                <td className="py-2 px-4">{teacher.email}</td>
                <td className="py-2 px-4">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteTeacher(teacher.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-gray-500">
                  لا يوجد معلمين حالياً
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
