import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllClasses } from "../../services/classService";
import {
  getUnassignedTeachers,
  assignTeachersToClass,
} from "../../services/teacherService";

export default function TeacherAssignment() {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teacherData, classData] = await Promise.all([
        getUnassignedTeachers(),
        getAllClasses(),
      ]);
      setTeachers(teacherData);
      setClasses(classData);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTeacherSelection = (id) => {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (!selectedClassId) {
      Swal.fire("خطأ", "يرجى اختيار الصف أولاً", "error");
      return;
    }

    if (selectedTeachers.length === 0) {
      Swal.fire("خطأ", "يرجى اختيار معلم واحد على الأقل", "error");
      return;
    }

    try {
      await assignTeachersToClass(selectedClassId, selectedTeachers);
      Swal.fire("تم", "تم تعيين المعلمين بنجاح", "success");
      setSelectedClassId("");
      setSelectedTeachers([]);
      const updated = await getUnassignedTeachers();
      setTeachers(updated);
    } catch (error) {
      Swal.fire("خطأ", "حدث خطأ أثناء التعيين", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h3 className="text-xl font-bold text-[#5196ac] mb-4">
        تعيين معلمين للصفوف
      </h3>

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
          <label className="block mb-2 font-semibold">اختر المعلمين</label>
          <div className="max-h-64 overflow-auto border rounded p-2 space-y-1">
            {teachers.length === 0 && <p>لا يوجد معلمون غير معينين.</p>}
            {teachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`teacher-${teacher.id}`}
                  checked={selectedTeachers.includes(teacher.id)}
                  onChange={() => toggleTeacherSelection(teacher.id)}
                />
                <label htmlFor={`teacher-${teacher.id}`}>{teacher.name}</label>
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
