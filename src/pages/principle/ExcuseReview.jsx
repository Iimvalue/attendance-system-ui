import { useState } from "react";
import Swal from "sweetalert2";
import { submitExcuse } from "../../services/excuseService";

export default function SubmitExcuse() {
  const [excuse, setExcuse] = useState({
    studentId: "",
    reason: "",
    date: "",
  });

  const handleChange = (e) => {
    setExcuse({ ...excuse, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!excuse.reason.trim() || !excuse.date.trim()) {
      Swal.fire("خطأ", "الرجاء تعبئة جميع الحقول", "error");
      return;
    }

    try {
      await submitExcuse(excuse);
      Swal.fire("تم الإرسال", "تم إرسال العذر بنجاح", "success");
      setExcuse({ studentId: "", reason: "", date: "" });
    } catch (error) {
      Swal.fire("خطأ", "حدث خطأ أثناء إرسال العذر", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold text-[#5196ac] mb-4">رفع عذر غياب</h2>
      <input
        type="text"
        name="reason"
        placeholder="سبب العذر"
        className="border p-2 rounded w-full"
        value={excuse.reason}
        onChange={handleChange}
      />
      <input
        type="date"
        name="date"
        className="border p-2 rounded w-full"
        value={excuse.date}
        onChange={handleChange}
      />
      <button
        className="bg-[#5196ac] text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        إرسال العذر
      </button>
    </div>
  );
}