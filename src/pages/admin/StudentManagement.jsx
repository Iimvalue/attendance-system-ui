import { useEffect, useState } from "react";
import {
  getAllStudents,
  addStudent,
  deleteStudent,
  updateStudent,
} from "../../services/studentService";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: "", email: "" });

  useEffect(() => {
    loadStudents();
  }, [students]);

  const loadStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch {
      Swal.fire("خطأ", "فشل تحميل بيانات الطلاب", "error");
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email) {
      return Swal.fire("خطأ", "يجب تعبئة جميع الحقول", "error");
    }

    try {
      const added = await addStudent(newStudent);
      setStudents((prev) => [...prev, added]);
      setNewStudent({ name: "", email: "" });
      Swal.fire("تمت الإضافة", "تم إضافة الطالب بنجاح", "success");
    } catch {
      Swal.fire("خطأ", "حدث خطأ أثناء الإضافة", "error");
    }
  };

  const handleDeleteStudent = async (id) => {
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
        await deleteStudent(id);
        setStudents((prev) => prev.filter((s) => s.id !== id));
        Swal.fire("تم الحذف", "تم حذف الطالب", "success");
      } catch {
        Swal.fire("خطأ", "حدث خطأ أثناء الحذف", "error");
      }
    }
  };

  const handleEditStudent = async (student) => {
    console.log(student);
    
    const { value: formValues } = await Swal.fire({
      title: "تعديل المستخدم",
      html: `
        <input id="swal-email" class="swal2-input" type="email" placeholder="البريد الإلكتروني" value="${student.email}" />
        <select id="swal-role" class="swal2-select">
          <option value="">اختر الدور</option>
          <option value="admin" ${student.role === 'admin' ? "selected" : ""}>مدير النظام</option>
          <option value="principle" ${student.role === 'principel' ? "selected" : ""}>مدير المدرسة</option>
          <option value="teacher" ${student.role === 'teacher' ? "selected" : ""}>معلم</option>
          <option value="student" ${student.role === 'student' ? "selected" : ""}>طالب</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const email = document.getElementById("swal-email").value;
        const role = document.getElementById("swal-role").value;
        
        // Basic validation
        if (!email) {
          Swal.showValidationMessage('يرجى إدخال البريد الإلكتروني');
          return false;
        }
        if (!role) {
          Swal.showValidationMessage('يرجى اختيار الدور');
          return false;
        }
        
        return {
          email: email,
          role: role
        };
      },
    });

    if (formValues) {
      try {
        const updated = await updateStudent(student.id, formValues);
        setStudents((prev) =>
          prev.map((s) => (s.id === student.id ? updated : s))
        );
        Swal.fire("تم التحديث", "تم تحديث بيانات الطالب", "success");
      } catch {
        Swal.fire("خطأ", "حدث خطأ أثناء التحديث", "error");
      }
    }
  };

  return (
    <div dir="rtl" className="max-w-6xl mx-auto space-y-6 px-4 py-6">

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-xl font-bold text-[#5196ac] mb-4">إضافة طالب</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
          <input
            type="text"
            placeholder="اسم الطالب"
            className="border p-2 rounded w-full sm:w-auto flex-1"
            value={newStudent.name}
            onChange={(e) =>
              setNewStudent({ ...newStudent, name: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="border p-2 rounded w-full sm:w-auto flex-1"
            value={newStudent.email}
            onChange={(e) =>
              setNewStudent({ ...newStudent, email: e.target.value })
            }
          />
          <button
            className="bg-[#5196ac] text-white px-4 py-2 rounded w-full sm:w-auto"
            onClick={handleAddStudent}
          >
            إضافة
          </button>
        </div>
      </div>


      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <h3 className="text-xl font-bold text-[#5196ac] mb-4">قائمة الطلاب</h3>
        <table className="min-w-[600px] w-full text-center text-sm">
          <thead>
            <tr className="bg-[#5196ac] text-white">
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">الاسم</th>
              <th className="py-2 px-3">البريد الإلكتروني</th>
              <th className="py-2 px-3">الحالة</th>
              <th className="py-2 px-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-gray-500">
                  لا يوجد طلاب حالياً
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-3">{student.id}</td>
                  <td className="py-2 px-3">{student.name}</td>
                  <td className="py-2 px-3">{student.email}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs ${
                        student.assigned ? "bg-green-600" : "bg-red-500"
                      }`}
                    >
                      {student.assigned ? "يدرس" : "لا يدرس"}
                    </span>
                  </td>
                  <td className="py-2 px-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
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

export default StudentManagement;
