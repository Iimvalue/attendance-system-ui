// <<<<<<< HEAD
// import { Menu } from "lucide-react";
// import { LogOut } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// const StudentDashboard = () => {
//   const token = localStorage.getItem("Token");
//   const role = localStorage.getItem("role");
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

//   // useEffect(() => {
//   //   if (!token || role !== "student") {
//   //     navigate("/");
//   //   }
//   // }, []);

//   return (
//      <>
//       {/* nav ... */}
//       <nav className="shadow-md mx-5 md:mx-10 mt-4 rounded-xl fixed w-[calc(100%-2.5rem)] md:w-[calc(100%-5rem)] bg-white z-50">
//         <div className="px-5 py-4 flex justify-between items-center">
//           <div className="hidden md:flex items-center gap-4">
//             <button
//               onClick={() => {
//                 localStorage.clear();
//                 navigate("/");
//               }}
//               className="relative group bg-red-700 text-white px-3 py-2 rounded hover:bg-red-600 w-fit"
//             >
//               <LogOut className="w-5 h-5" />

//               {/* hover */}
//               <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
//                 تسجيل الخروج
//               </span>
//             </button>
//           </div>
//           <h1 className="text-xl font-bold text-[#27465b]">Logo..</h1>

//           <div className="md:hidden">
//             <button onClick={() => setMenuOpen(!menuOpen)}>
//               <Menu className="w-6 h-6 text-[#27465b]" />
//             </button>
//           </div>
//         </div>
//         {menuOpen && (
//           <div className="md:hidden px-5 pb-4 flex flex-col gap-3">
//             <button
//               // swl ..
//               onClick={() => {
//                 localStorage.clear();
//                 navigate("/");
//               }}
//               className="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-600 w-full text-start"
//             >
//               تسجيل الخروج
//             </button>
//           </div>
//         )}
//       </nav>
//       {/*  */}

//       <div className="pt-25 pb-10 min-h-screen bg-gray-200 text-right">
//         <div className="p-8 bg-white rounded-xl shadow-md overflow-hidden flex flex-col mx-5 md:mx-10">
//           <h1 className="text-2xl font-bold text-[#27465b] mb-4">...</h1>
//         </div>
//       </div>
//     </>
//   );
// };
// =======
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getStudentProfile } from "../../services/studentService";
import { getStudentExcuses, submitExcuse } from "../../services/excuseService";
import LoadingSpinner from "../component/LoadingSpinner";
// >>>>>>> origin/talal-branch

export default function StudentDashboard() {
  const [student, setStudent] = useState("");
  const [excuses, setExcuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const studentData = await getStudentProfile();
        const excusesData = await getStudentExcuses(studentData.id);
        setStudent(studentData);
        setExcuses(excusesData);
      } catch (error) {
        Swal.fire("خطأ", "فشل تحميل البيانات", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmitExcuse = async () => {
    const { value: formValues } = await Swal.fire({
      title: "رفع عذر جديد",
      html: `
        <input id="swal-date" type="date" class="swal2-input" placeholder="التاريخ">
        <textarea id="swal-reason" class="swal2-textarea" placeholder="سبب العذر"></textarea>
      `,
      focusConfirm: false,
      confirmButtonText: "إرسال",
      cancelButtonText: "إلغاء",
      showCancelButton: true,
      preConfirm: () => {
        const date = document.getElementById("swal-date").value;
        const reason = document.getElementById("swal-reason").value;
        if (!date || !reason) {
          Swal.showValidationMessage("يرجى إدخال التاريخ والسبب");
          return;
        }
        return { date, reason };
      },
    });

    if (formValues) {
      try {
        await submitExcuse({
          studentId: student.id,
          date: formValues.date,
          reason: formValues.reason,
        });

        Swal.fire("تم الإرسال", "تم رفع العذر بنجاح", "success");
        const updated = await getStudentExcuses(student.id);
        setExcuses(updated);
      } catch (err) {
        Swal.fire("خطأ", "فشل رفع العذر", "error");
      }
    }
  };

  const counts = {
    total: excuses.length,
    accepted: excuses.filter((e) => e.status === "accepted").length,
    rejected: excuses.filter((e) => e.status === "rejected").length,
    pending: excuses.filter((e) => e.status === "pending").length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#5196ac]">لوحة تحكم الطالب</h2>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="text-xl font-semibold">معلومات الطالب</h3>
        <p>
          <strong>الاسم:</strong> {student.name}
        </p>
        <p>
          <strong>الصف:</strong> {student.className || "-"}
        </p>
        <p>
          <strong>الحالة:</strong> {student.assigned ? "يُدرس" : "غير معين"}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 text-center">
        <div className="bg-blue-50 p-4 rounded shadow-sm">
          <p className="text-lg font-semibold text-blue-600">إجمالي الأعذار</p>
          <p className="text-3xl font-bold text-blue-700">{counts.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded shadow-sm">
          <p className="text-lg font-semibold text-green-600">مقبولة</p>
          <p className="text-3xl font-bold text-green-700">{counts.accepted}</p>
        </div>
        <div className="bg-red-50 p-4 rounded shadow-sm">
          <p className="text-lg font-semibold text-red-600">مرفوضة</p>
          <p className="text-3xl font-bold text-red-700">{counts.rejected}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded shadow-sm">
          <p className="text-lg font-semibold text-yellow-600">معلقة</p>
          <p className="text-3xl font-bold text-yellow-700">{counts.pending}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">الأعذار المقدمة</h3>
        <button
          className="bg-[#5196ac] text-white px-4 py-2 rounded hover:bg-[#41738b]"
          onClick={handleSubmitExcuse}
        >
          رفع عذر جديد
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 py-2 px-4">رقم العذر</th>
              <th className="border border-gray-300 py-2 px-4">التاريخ</th>
              <th className="border border-gray-300 py-2 px-4">سبب العذر</th>
              <th className="border border-gray-300 py-2 px-4">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {excuses.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  لا توجد أعذار حالياً
                </td>
              </tr>
            ) : (
              excuses.map((excuse, index) => (
                <tr
                  key={excuse.id}
                  className={`border border-gray-300 ${
                    index % 2 === 0 ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="border border-gray-300 py-2 px-4 text-center">
                    {excuse.id}
                  </td>
                  <td className="border border-gray-300 py-2 px-4 text-center">
                    {excuse.date}
                  </td>
                  <td className="border border-gray-300 py-2 px-4 text-center">
                    {excuse.reason}
                  </td>
                  <td
                    className={`border border-gray-300 py-2 px-4 text-center font-semibold ${
                      excuse.status === "accepted"
                        ? "text-green-700 bg-green-100 rounded"
                        : excuse.status === "rejected"
                        ? "text-red-700 bg-red-100 rounded"
                        : "text-yellow-700 bg-yellow-100 rounded"
                    }`}
                  >
                    {excuse.status === "accepted"
                      ? "مقبول"
                      : excuse.status === "rejected"
                      ? "مرفوض"
                      : "معلق"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
