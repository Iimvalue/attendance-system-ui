// pages/admin/PrincipleAssignment.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllClasses } from "../../services/classService";
import {
  getUnassignedPrinciples,
  assignPrinciplesToClass,
} from "../../services/principleService";

export default function PrincipleAssignment() {
  const [principles, setPrinciples] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedPrinciples, setSelectedPrinciples] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [principleData, classData] = await Promise.all([
        getUnassignedPrinciples(),
        getAllClasses(),
      ]);
      setPrinciples(principleData);
      setClasses(classData);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePrincipleSelection = (id) => {
    setSelectedPrinciples((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (!selectedClassId) {
      Swal.fire("خطأ", "يرجى اختيار الصف أولاً", "error");
      return;
    }

    if (selectedPrinciples.length === 0) {
      Swal.fire("خطأ", "يرجى اختيار مرشد واحد على الأقل", "error");
      return;
    }

    try {
      await assignPrinciplesToClass(selectedClassId, selectedPrinciples);
      Swal.fire("تم", "تم تعيين المرشدين بنجاح", "success");
      setSelectedClassId("");
      setSelectedPrinciples([]);
      const updated = await getUnassignedPrinciples();
      setPrinciples(updated);
    } catch (error) {
      Swal.fire("خطأ", "حدث خطأ أثناء التعيين", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h3 className="text-xl font-bold text-[#5196ac] mb-4">تعيين مرشدين للصفوف</h3>

      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <div>
          <label className="block mb-2 font-semibold">اختر الصف</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="">-- اختر صف --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">اختر المرشدين</label>
          <div className="max-h-64 overflow-auto border rounded p-2 space-y-1">
            {principles.length === 0 && <p>لا يوجد مرشدون غير معينين.</p>}
            {principles.map((principle) => (
              <div key={principle.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`principle-${principle.id}`}
                  checked={selectedPrinciples.includes(principle.id)}
                  onChange={() => togglePrincipleSelection(principle.id)}
                />
                <label htmlFor={`principle-${principle.id}`}>
                  {principle.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          className="bg-[#5196ac] text-white px-6 py-2 rounded"
          onClick={handleAssign}
        >
          تعيين
        </button>
      </div>
    </div>
  );
}