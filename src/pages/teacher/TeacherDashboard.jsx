import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  getAttendanceByTeacher,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getStudentsInClass,
} from "../../services/attendanceService";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const teacherId = localStorage.getItem("userId");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [attendanceList, setAttendanceList] = useState([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchTeacherClasses();
    fetchTeacherAttendance();
  }, []);

  const fetchTeacherClasses = async () => {
    try {
      const res = await fetch("https://attendance-system-api-wetn.onrender.com/api/classes");
      const data = await res.json();
      const allClasses = data.classes || [];
      const myClasses = allClasses.filter(cls => cls.userId?._id === teacherId);
      setTeacherClasses(myClasses);
    } catch (error) {
      console.error("فشل في جلب الفصول:", error);
    }
  };

  const fetchStudents = async (classId) => {
    const res = await getStudentsInClass(classId);
    setStudents(res.enrollments || []);
  };

  const fetchTeacherAttendance = async () => {
    const res = await getAttendanceByTeacher(teacherId);
    setAttendanceList(res.classes || []);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData({ ...attendanceData, [studentId]: status });
  };

  const handleSubmitAttendance = async () => {
    const requests = students.map((enroll) => {
      const studentId = enroll.userId._id;
      return createAttendance({
        classId: selectedClass._id,
        attendeeId: studentId,
        attenderId: teacherId,
        status: attendanceData[studentId] || "present",
      });
    });
    await Promise.all(requests);
    setAttendanceData({});
    fetchTeacherAttendance();
  };

  const handleUpdate = async (id, currentStatus) => {
    const newStatus = prompt("تحديث الحالة:", currentStatus);
    if (newStatus && newStatus !== currentStatus) {
      await updateAttendance(id, { status: newStatus });
      fetchTeacherAttendance();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من الحذف؟")) {
      await deleteAttendance(id);
      fetchTeacherAttendance();
    }
  };

  return (
    <>
      {!isScrolled && (
        <nav className="fixed top-4 left-0 right-0 mx-5 md:mx-10 rounded-xl shadow-md bg-white z-50 transition-opacity duration-700">
          <div className="px-5 py-4 flex justify-between items-center">
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                className="relative group bg-red-700 text-white px-3 py-2 rounded hover:bg-red-600 w-fit"
              >
                <LogOut className="w-5 h-5" />
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  تسجيل الخروج
                </span>
              </button>
            </div>
            <h1 className="text-xl font-bold text-[#27465b]">Logo..</h1>
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                <Menu className="w-6 h-6 text-[#27465b]" />
              </button>
            </div>
          </div>
          {menuOpen && (
            <div className="md:hidden px-5 pb-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                className="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-600 w-full text-start"
              >
                تسجيل الخروج
              </button>
            </div>
          )}
        </nav>
      )}

      <div className="pt-24 pb-10 min-h-screen bg-gray-200 text-right">
        <div className="p-6 bg-white rounded-xl shadow-md overflow-hidden mx-5 md:mx-10">
          <div className="max-w-6xl mx-auto p-6 space-y-6">
            <h2 className="sm:text-2xl text-lg font-bold text-[#5196ac]">لوحة تحكم المعلم</h2>

            <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
              <h2 className="text-lg font-semibold text-[#5196ac]">فصولك</h2>
              <div className="grid gap-4">
                {teacherClasses.map((cls) => (
                  <button
                    key={cls._id}
                    onClick={() => {
                      setSelectedClass(cls);
                      fetchStudents(cls._id);
                    }}
                    className="text-right border p-4 rounded bg-gray-50 hover:bg-gray-100"
                  >
                    📘 {cls.name} - {cls.description}
                  </button>
                ))}
              </div>
            </div>

            {selectedClass && students.length > 0 && (
              <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow space-y-4">
                <h2 className="text-lg font-semibold text-[#5196ac]">تسجيل حضور - {selectedClass.name}</h2>
                <table className="w-full mt-4 border text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th>اسم الطالب</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((enroll) => (
                      <tr key={enroll._id} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-4">{enroll.userId.name}</td>
                        <td>
                          <select
                            value={attendanceData[enroll.userId._id] || "present"}
                            onChange={(e) => handleStatusChange(enroll.userId._id, e.target.value)}
                            className="border rounded p-1"
                          >
                            <option value="present">حاضر</option>
                            <option value="absent">غائب</option>
                            <option value="late">متأخر</option>
                            <option value="excused">بعذر</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={handleSubmitAttendance}
                  className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
                >
                  حفظ الحضور
                </button>
              </div>
            )}

            <div className="mt-10 bg-white p-6 rounded-xl shadow space-y-4">
              <h2 className="text-lg font-semibold text-[#5196ac]">سجلات الحضور</h2>
              {attendanceList.length === 0 ? (
                <p className="text-gray-500">لا توجد سجلات حالياً</p>
              ) : (
                <table className="w-full text-center border">
                  <thead>
                    <tr className="bg-[#5196ac] text-white">
                      <th className="py-2 px-4">الطالب</th>
                      <th className="py-2 px-4">الفصل</th>
                      <th className="py-2 px-4">الحالة</th>
                      <th className="py-2 px-4">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.map((att) => (
                      <tr key={att._id} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-4">{att.attendeeId?.name}</td>
                        <td className="py-2 px-4">{att.classId?.name}</td>
                        <td className="py-2 px-4">{att.status}</td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handleUpdate(att._id, att.status)}
                            className="text-blue-600 hover:underline"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDelete(att._id)}
                            className="text-red-600 hover:underline ml-2"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;
