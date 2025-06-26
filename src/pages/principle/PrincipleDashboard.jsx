import { Menu } from "lucide-react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAllExcuses,
  deleteExcuse,
} from "../../services/excuseService";

const PrincipleDashboard = () => {
  const token = localStorage.getItem("Token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [excuses, setExcuses] = useState([]);
  const [filter, setFilter] = useState("all");

      useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  // useEffect(() => {
  //   if (!token || role !== "principle") {
  //     navigate("/");
  //   }
  // }, []);


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
    <>
      {/* nav ... */}
       {!isScrolled && (
     <nav
  className={`fixed top-4 left-0 right-0 mx-5 md:mx-10 rounded-xl shadow-md bg-white z-50 transition-opacity duration-700 ${
    isScrolled ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
  }`}
>
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

              {/* hover */}
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
              // swl ..
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
      {/*  */}

<div className="pt-25 pb-10 min-h-screen bg-gray-200 text-right">
  <div className="p-6 bg-white rounded-xl shadow-md overflow-hidden mx-5 md:mx-10">
 <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="sm:text-2xl text-lg font-bold text-[#5196ac]">لوحة تحكم المشرف</h2>

      {/* <div className="bg-gray-50 p-6 rounded-xl shadow space-y-4">
        <h3 className="sm:text-xl font-semibold">معلومات المعلم</h3>
        <p>
          <strong>الاسم:</strong> {}
        </p>
      </div> */}

 


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
            <th className="py-2 px-4">رقم الطالب</th>
            <th className="py-2 px-4">التاريخ</th>
            <th className="py-2 px-4">السبب</th>
            <th className="py-2 px-4">الحالة</th>
            <th className="py-2 px-4">الإجراء</th>
          </tr>
        </thead>
        <tbody >
          {filteredExcuses.map((e, idx) => (
            <tr key={e.id} className="border-t hover:bg-gray-50">
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




    </div>
  </div>
</div>

    </>
  );
};

export default PrincipleDashboard;
