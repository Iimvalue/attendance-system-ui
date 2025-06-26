import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { getTeacherProfile } from "../../services/teacherService";
import { getTeacherClasses } from "../../services/classService";
import {
  getAttendanceByTeacher,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../../services/attendanceService";
import { getStudentsInClass } from "../../services/enrollment.service";

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
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchTeacherClasses = useCallback(async () => {
    try {
      setError(null);
      const myClasses = await getTeacherClasses(teacherId);
      setTeacherClasses(myClasses);
    } catch (error) {
      console.error("فشل في جلب الفصول:", error);
      setError("فشل في جلب الفصول");
    }
  }, [teacherId]);

  const fetchTeacherInfo = useCallback(async () => {
    try {
      const response = await getTeacherProfile(teacherId);
      setTeacherInfo(response.user || response);
    } catch (error) {
      console.error("فشل في جلب معلومات المعلم:", error);
    }
  }, [teacherId]);

  const fetchTeacherAttendance = useCallback(async () => {
    try {
      const res = await getAttendanceByTeacher(teacherId);
      setAttendanceList(res.classes || res.data || []);
    } catch (error) {
      console.error("فشل في جلب سجل الحضور:", error);
      setError("فشل في جلب سجل الحضور");
    }
  }, [teacherId]);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchTeacherClasses(),
          fetchTeacherInfo(),
          fetchTeacherAttendance()
        ]);
      } catch (error) {
        console.error("خطأ في تحميل البيانات:", error);
        setError("خطأ في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      initializeData();
    } else {
      navigate("/");
    }
  }, [teacherId, navigate, fetchTeacherClasses, fetchTeacherInfo, fetchTeacherAttendance]);

  const fetchStudents = async (classId) => {
    try {
      const res = await getStudentsInClass(classId);
      setStudents(res.enrollments || res.data || []);
    } catch (error) {
      console.error("فشل في جلب الطلاب:", error);
      setError("فشل في جلب الطلاب");
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData({ ...attendanceData, [studentId]: status });
  };

  const handleSubmitAttendance = async () => {
    try {
      setError(null);
      if (!selectedClass || students.length === 0) {
        setError("يرجى اختيار فصل وطلاب");
        return;
      }

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
      await fetchTeacherAttendance();
      alert("تم حفظ الحضور بنجاح");
    } catch (error) {
      console.error("فشل في حفظ الحضور:", error);
      setError("فشل في حفظ الحضور");
    }
  };

  const handleUpdate = async (id, currentStatus) => {
    try {
      const newStatus = prompt("تحديث الحالة:", currentStatus);
      if (newStatus && newStatus !== currentStatus) {
        await updateAttendance(id, { status: newStatus });
        await fetchTeacherAttendance();
        alert("تم تحديث الحالة بنجاح");
      }
    } catch (error) {
      console.error("فشل في التحديث:", error);
      setError("فشل في تحديث الحالة");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("هل أنت متأكد من الحذف؟")) {
        await deleteAttendance(id);
        await fetchTeacherAttendance();
        alert("تم الحذف بنجاح");
      }
    } catch (error) {
      console.error("فشل في الحذف:", error);
      setError("فشل في حذف السجل");
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
            <h1 className="text-xl font-bold text-[#27465b]">
              {teacherInfo ? `مرحباً ${teacherInfo.name}` : "Logo.."}
            </h1>
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

            {/* Error Display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5196ac]"></div>
                <p className="mt-2 text-gray-600">جاري تحميل البيانات...</p>
              </div>
            ) : (
              <>
                <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
                  <h2 className="text-lg font-semibold text-[#5196ac]">فصولك</h2>
                  {teacherClasses.length === 0 ? (
                    <p className="text-gray-500">لا توجد فصول مخصصة لك حالياً</p>
                  ) : (
                    <div className="grid gap-4">
                      {teacherClasses.map((cls) => (
                        <button
                          key={cls._id}
                          onClick={() => {
                            setSelectedClass(cls);
                            fetchStudents(cls._id);
                          }}
                          className="text-right border p-4 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          📘 {cls.name} - {cls.description}
                        </button>
                      ))}
                    </div>
                  )}
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
            </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;
