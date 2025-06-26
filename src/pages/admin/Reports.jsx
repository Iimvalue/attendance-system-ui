import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllExcuses, updateExcuseStatus } from "../../services/leaveService";
import { getAllStudents } from "../../services/studentService";
import LoadingSpinner from "../component/LoadingSpinner";

export default function Reports() {
  const [excuses, setExcuses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [excusesData, studentsData] = await Promise.all([
          getAllExcuses(),
          getAllStudents(),
        ]);
        setExcuses(excusesData);
        setStudents(studentsData);
      } catch (error) {
        Swal.fire("خطأ", "فشل تحميل البيانات", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleUpdateStatus = async (excuseId, status) => {
    const confirm = await Swal.fire({
      title: `هل أنت متأكد من ${status === "accepted" ? "قبول" : "رفض"} هذا العذر؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم",
      cancelButtonText: "إلغاء",
    });

    if (confirm.isConfirmed) {
      try {
        await updateExcuseStatus(excuseId, status);
        const updated = await getAllExcuses();
        setExcuses(updated);
        Swal.fire("تم", "تم تحديث حالة العذر", "success");
      } catch (error) {
        Swal.fire("خطأ", "فشل تحديث الحالة", error);
      }
    }
  };

  const counts = {
    total: excuses.length,
    accepted: excuses.filter((e) => e.status === "accepted").length,
    rejected: excuses.filter((e) => e.status === "rejected").length,
    pending: excuses.filter((e) => e.status === "pending").length,
  };

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.name : "غير معروف";
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#5196ac]">تقرير الأعذار - الأدمن</h2>

      <div className="grid grid-cols-4 gap-6 text-center">
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-lg font-semibold text-blue-800">إجمالي الأعذار</p>
          <p className="text-3xl">{counts.total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <p className="text-lg font-semibold text-green-800">مقبولة</p>
          <p className="text-3xl">{counts.accepted}</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-lg font-semibold text-red-800">مرفوضة</p>
          <p className="text-3xl">{counts.rejected}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-lg font-semibold text-yellow-800">معلقة</p>
          <p className="text-3xl">{counts.pending}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#5196ac] text-white">
              <th className="border border-gray-300 py-2 px-4">رقم العذر</th>
              <th className="border border-gray-300 py-2 px-4">اسم الطالب</th>
              <th className="border border-gray-300 py-2 px-4">التاريخ</th>
              <th className="border border-gray-300 py-2 px-4">سبب العذر</th>
              <th className="border border-gray-300 py-2 px-4">الحالة</th>
              <th className="border border-gray-300 py-2 px-4">الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {excuses.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  لا توجد أعذار حالياً
                </td>
              </tr>
            ) : (
              excuses.map((excuse, index) => (
                <tr
                  key={excuse.id}
                  className={`border border-gray-300 ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                >
                  <td className="border border-gray-300 py-2 px-4 text-center">{excuse.id}</td>
                  <td className="border border-gray-300 py-2 px-4 text-center">
                    {getStudentName(excuse.studentId)}
                  </td>
                  <td className="border border-gray-300 py-2 px-4 text-center">{excuse.date}</td>
                  <td className="border border-gray-300 py-2 px-4 text-center">{excuse.reason}</td>
                  <td
                    className={`border border-gray-300 py-2 px-4 text-center font-semibold ${
                      excuse.status === "accepted"
                        ? "text-green-600"
                        : excuse.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {excuse.status === "accepted"
                      ? "مقبول"
                      : excuse.status === "rejected"
                      ? "مرفوض"
                      : "معلق"}
                  </td>
                  <td className="border border-gray-300 py-2 px-4 text-center space-x-2">
                    {excuse.status === "pending" ? (
                      <>
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          onClick={() => handleUpdateStatus(excuse.id, "accepted")}
                        >
                          قبول
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => handleUpdateStatus(excuse.id, "rejected")}
                        >
                          رفض
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
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