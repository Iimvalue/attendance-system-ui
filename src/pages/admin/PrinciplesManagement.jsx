import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAllPrinciples,
  addPrinciple,
  deletePrinciple,
} from "../../services/principleService";

export default function PrinciplesManagement() {
  const [principles, setPrinciples] = useState([]);
  const [newPrinciple, setNewPrinciple] = useState({ name: "", email: "" });

  useEffect(() => {
    getAllPrinciples().then(setPrinciples);
  }, []);

  const handleAdd = async () => {
    if (!newPrinciple.name || !newPrinciple.email) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "جميع الحقول مطلوبة",
      });
      return;
    }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(newPrinciple.email)) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "بريد غير صالح",
    //     text: "يرجى إدخال بريد إلكتروني صحيح",
    //   });
    //   return;
    // }

    try {
      const added = await addPrinciple(newPrinciple);
      setPrinciples((prev) => [...prev, added]);
      setNewPrinciple({ name: "", email: "" });

      Swal.fire({
        icon: "success",
        title: "تمت الإضافة",
        text: "تم إضافة المرشد بنجاح",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء الإضافة",
      });
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
        await deletePrinciple(id);
        setPrinciples((prev) => prev.filter((p) => p.id !== id));
        Swal.fire("تم الحذف!", "تم حذف المرشد", "success");
      } catch {
        Swal.fire("خطأ", "فشل الحذف", "error");
      }
    }
  };

  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-xl font-bold text-[#5196ac] mb-4">إضافة مرشد</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="اسم المرشد"
            className="border p-2 rounded w-full"
            value={newPrinciple.name}
            onChange={(e) =>
              setNewPrinciple({ ...newPrinciple, name: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="border p-2 rounded w-full"
            value={newPrinciple.email}
            onChange={(e) =>
              setNewPrinciple({ ...newPrinciple, email: e.target.value })
            }
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
        <h3 className="text-xl font-bold text-[#5196ac] mb-4">قائمة المرشدين</h3>
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
            {principles.map((p, index) => (
              <tr
                key={p.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{p.name}</td>
                <td className="py-2 px-4">{p.email}</td>
                <td className="py-2 px-4">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(p.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {principles.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-gray-500">
                  لا يوجد مرشدين حالياً
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}