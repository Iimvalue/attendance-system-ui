import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllClasses } from "../../services/classService";
import { getUnassignedStudents, assignStudentsToClass, getUnassignedStudents as fetchUnassignedStudents } from "../../services/studentService";

const StudentAssignment = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    async function loadData() {
      const classesData = await getAllClasses();
      const studentsData = await fetchUnassignedStudents();
      setClasses(classesData);
      setStudents(studentsData);
    }
    loadData();
  }, []);

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssign = async () => {
    if (!selectedClassId) {
      Swal.fire("خطأ", "يرجى اختيار الصف أولاً", "error");
      return;
    }
    if (selectedStudents.length === 0) {
      Swal.fire("خطأ", "يرجى اختيار طالب واحد على الأقل", "error");
      return;
    }

    try {
      await assignStudentsToClass(selectedClassId, selectedStudents);
      Swal.fire({
        icon: "success",
        title: "تم التعيين",
        text: `تم تعيين ${selectedStudents.length} طالب(طالب) للصف المحدد`,
      });
      const updatedStudents = await fetchUnassignedStudents();
      setStudents(updatedStudents);
      setSelectedClassId("");
      setSelectedStudents([]);
    } catch (error) {
      Swal.fire("خطأ", "حدث خطأ أثناء التعيين", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h3 className="text-xl font-bold text-[#5196ac] mb-4">تعيين طلاب للصفوف</h3>

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
          <label className="block mb-2 font-semibold">اختر الطلاب</label>
          <div className="max-h-64 overflow-auto border rounded p-2 space-y-1">
            {students.length === 0 && <p>لا يوجد طلاب غير معينين.</p>}
            {students.map((student) => (
              <div key={student.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`student-${student.id}`}
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => toggleStudentSelection(student.id)}
                />
                <label htmlFor={`student-${student.id}`}>{student.name}</label>
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
};

export default StudentAssignment;