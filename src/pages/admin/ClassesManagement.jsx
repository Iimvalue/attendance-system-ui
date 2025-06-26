import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAllClasses,
  addClass,
  deleteClass,
  unassignUserFromClass,
} from "../../services/classService";
import { getAllStudents } from "../../services/studentService";
import { getAllTeachers } from "../../services/teacherService";
import { getAllPrinciples } from "../../services/principleService";

export default function ClassesManagement() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [principles, setPrinciples] = useState([]);
  const [newClass, setNewClass] = useState({ name: "" });

  useEffect(() => {
    async function fetchData() {
      try {
        const [classesData, studentsData, teachersData, principlesData] =
          await Promise.all([
            getAllClasses(),
            getAllStudents(),
            getAllTeachers(),
            getAllPrinciples(),
          ]);

        setClasses(Array.isArray(classesData) ? classesData : []); // ✅ تأكد أن النتيجة مصفوفة
        setStudents(studentsData);
        setTeachers(teachersData);
        setPrinciples(principlesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("خطأ", "فشل في تحميل البيانات", "error");
      }
    }
    fetchData();
  }, []);

  const handleUnassignUser = async (userId, role) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: `سيتم إزالة المستخدم (${role}) من الصف.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، إزالة",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      try {
        await unassignUserFromClass(userId);
        Swal.fire("تم", "تمت الإزالة بنجاح", "success");

        const [studentsData, teachersData, principlesData] = await Promise.all([
          getAllStudents(),
          getAllTeachers(),
          getAllPrinciples(),
        ]);
        setStudents(studentsData);
        setTeachers(teachersData);
        setPrinciples(principlesData);
      } catch {
        Swal.fire("خطأ", "حدث خطأ أثناء الإزالة", "error");
      }
    }
  };

  const renderAssignedEmails = (classId, list, role) => {
    const assigned = list.filter((item) => item.classId === classId);
    if (assigned.length === 0) return <span>-</span>;

    return (
      <div className="flex flex-col gap-1 items-start">
        {assigned.map((item) => (
          <div
            key={item.id || item._id}
            className="bg-gray-100 border rounded px-2 py-1 text-sm w-full flex justify-between items-center"
          >
            <span>{item.email}</span>
            <button
              onClick={() => handleUnassignUser(item.id || item._id, role)}
              className="text-red-500 hover:text-red-700 text-xs"
              title="إزالة من الصف"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    );
  };

  const handleAdd = async () => {
    if (!newClass.name.trim()) {
      Swal.fire({ icon: "error", title: "خطأ", text: "اسم الصف مطلوب" });
      return;
    }

    try {
      const added = await addClass(newClass);
      setClasses((prev) => [...prev, added]);
      setNewClass({ name: "" });
      Swal.fire({ icon: "success", title: "تمت الإضافة", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "فشل", text: "حدث خطأ أثناء الإضافة" });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      try {
        await deleteClass(id);
        setClasses((prev) => prev.filter((c) => (c.id || c._id) !== id));
        Swal.fire("تم", "تم حذف الصف", "success");
      } catch {
        Swal.fire("خطأ", "فشل الحذف", "error");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6" dir="rtl">
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-xl font-bold text-[#5196ac] mb-4">إضافة صف جديد</h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="اسم الصف"
            className="border p-2 rounded w-full"
            value={newClass.name}
            onChange={(e) => setNewClass({ name: e.target.value })}
          />
          <button
            className="bg-[#5196ac] text-white px-4 py-2 rounded"
            onClick={handleAdd}
          >
            إضافة
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-xl font-bold text-[#5196ac] mb-4">قائمة الصفوف</h3>
        <table className="w-full text-center table-auto">
          <thead>
            <tr className="bg-[#5196ac] text-white">
              <th className="py-2 px-4">الرقم</th>
              <th className="py-2 px-4">اسم الصف</th>
              <th className="py-2 px-4">الطلاب</th>
              <th className="py-2 px-4">المعلمين</th>
              <th className="py-2 px-4">المرشدين</th>
              <th className="py-2 px-4">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 text-gray-500">
                  لا توجد صفوف حالياً
                </td>
              </tr>
            )}
            {Array.isArray(classes) &&
              classes.map((c, index) => (
                <tr key={c.id || c._id} className="border-t hover:bg-gray-50 transition align-top">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{c.name}</td>
                  <td className="py-2 px-4">{renderAssignedEmails(c.id || c._id, students, "طالب")}</td>
                  <td className="py-2 px-4">{renderAssignedEmails(c.id || c._id, teachers, "معلم")}</td>
                  <td className="py-2 px-4">{renderAssignedEmails(c.id || c._id, principles, "مرشد")}</td>
                  <td className="py-2 px-4">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(c.id || c._id)}
                    >
                      حذف الصف
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}