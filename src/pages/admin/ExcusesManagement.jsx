import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAllExcuses,
  deleteExcuse,
} from "../../services/leaveService";

export default function ExcusesManagement() {
  const [excuses, setExcuses] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchExcuses();
  }, []);

  const fetchExcuses = async () => {
    const data = await getAllExcuses();
    setExcuses(data);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة العذر بعد حذفه!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذفه",
      cancelButtonText: "إلغاء",
    });

    if (confirm.isConfirmed) {
      await deleteExcuse(id);
      Swal.fire("تم الحذف", "تم حذف العذر بنجاح", "success");
      fetchExcuses();
    }
  };

  const filteredExcuses =
    filter === "all"
      ? excuses
      : excuses.filter((e) => e.status === filter);

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold text-[#5196ac] mb-4">
        إدارة الأعذار الطلابية
      </h2>

      <div className="flex gap-4 mb-4">
        {["all", "pending", "accepted", "rejected"].map((f) => (
          <button
            key={f}
            className={`px-4 py-1 rounded ${
              filter === f ? "bg-[#5196ac] text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter(f)}
          >
            {f === "all"
              ? "الكل"
              : f === "pending"
              ? "معلق"
              : f === "accepted"
              ? "مقبول"
              : "مرفوض"}
          </button>
        ))}
      </div>

      <table className="w-full text-center">
        <thead>
          <tr className="bg-[#5196ac] text-white">
            <th className="py-2 px-4">#</th>
            <th className="py-2 px-4">رقم الطالب</th>
            <th className="py-2 px-4">التاريخ</th>
            <th className="py-2 px-4">السبب</th>
            <th className="py-2 px-4">الحالة</th>
            <th className="py-2 px-4">إجراء</th>
          </tr>
        </thead>
        <tbody>
          {filteredExcuses.map((e, idx) => (
            <tr key={e.id} className="border-t hover:bg-gray-50">
              <td className="py-2 px-4">{idx + 1}</td>
              <td className="py-2 px-4">{e.studentId || "-"}</td>
              <td className="py-2 px-4">{e.date}</td>
              <td className="py-2 px-4">{e.reason}</td>
              <td className="py-2 px-4">
                {e.status === "pending"
                  ? "معلق"
                  : e.status === "accepted"
                  ? "مقبول"
                  : "مرفوض"}
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleDelete(e.id)}
                  className="text-red-600 hover:underline"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
          {filteredExcuses.length === 0 && (
            <tr>
              <td colSpan="6" className="py-4 text-gray-500">
                لا توجد أعذار مطابقة
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}