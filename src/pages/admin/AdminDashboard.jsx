import { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import {
  Menu,
  X,
  Home,
  Users,
  UserCheck,
  UserPlus,
  Building2,
  ListChecks,
  UserCog,
  CheckCircle2,
  FileText,
} from "lucide-react";
import classNames from "classnames";

import ClassesManagement from "./ClassesManagement";
import StudentManagement from "./StudentManagement";
import TeachersManagement from "./TeachersManagement";
import PrinciplesManagement from "./PrinciplesManagement";
import StudentAssignment from "./StudentAssignment";
import TeacherAssignment from "./TeacherAssignment";
import PrincipleAssignment from "./PrincipleAssignment";
import ExcusesManagement from "./ExcusesManagement";
import Reports from "./Reports.jsx";

const API = "http://localhost:3000/api/users";

const menuItems = [
  { name: "Dashboard", icon: Home },
  { name: "إدارة الطلاب", icon: Users },
  { name: "إدارة المعلمين", icon: UserCheck },
  { name: "إدارة المرشدين", icon: UserPlus },
  { name: "إدارة الصفوف", icon: Building2 },
  { name: "تعيين طلاب", icon: ListChecks },
  { name: "تعيين معلمين", icon: UserCog },
  { name: "تعيين مرشد", icon: UserCog },
  { name: "الأعذار", icon: CheckCircle2 },
  { name: "التقارير", icon: FileText },
];

const pageComponents = {
  "إدارة الطلاب": StudentManagement,
  "إدارة المعلمين": TeachersManagement,
  "إدارة المرشدين": PrinciplesManagement,
  "إدارة الصفوف": ClassesManagement,
  "تعيين طلاب": StudentAssignment,
  "تعيين معلمين": TeacherAssignment,
  "تعيين مرشد": PrincipleAssignment,
  "الأعذار": ExcusesManagement,
  "التقارير": Reports,
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    principles: 0,
    excuses: 0,
    absences: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get(API);
        const data = response.data.data || response.data;

        setCounts({
          students: data.filter((item) => item.role === "student").length,
          teachers: data.filter((item) => item.role === "teacher").length,
          principles: data.filter((item) => item.role === "principle").length,
          excuses: data.filter((item) => item.role === "excuse").length,
          absences: 0,
        });
      } catch (error) {
        console.error("فشل تحميل البيانات", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const dashboardItems = [
    { label: "الطلاب", count: counts.students },
    { label: "المعلمين", count: counts.teachers },
    { label: "المرشدين", count: counts.principles },
    { label: "الأعذار", count: counts.excuses },
  ];

  const renderDashboard = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {dashboardItems.map(({ label, count }) => (
        <div
          key={label}
          className="bg-white p-6 rounded-xl shadow-md border-t-4 border-[#5196ac]"
        >
          <h3 className="text-xl font-semibold text-[#5196ac] mb-2">{label}</h3>
          <p className="text-3xl font-bold text-gray-700">{count}</p>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (loading) return <div className="text-center p-10 text-lg">...جاري التحميل</div>;
    if (activePage === "Dashboard") return renderDashboard();
    const PageComponent = pageComponents[activePage];
    if (PageComponent) return <PageComponent />;
    return (
      <div className="px-4 py-6 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl text-right font-bold mb-4 text-[#5196ac]">
          {activePage}
        </h2>
        <div className="p-4 rounded-xl shadow-md bg-zinc-50">
          <p className="text-gray-600 text-center">محتوى {activePage}.</p>
        </div>
      </div>
    );
  };

  return (
    <div dir="rtl" className="flex h-screen bg-gray-100">
      <div
        className={classNames(
          "bg-[#27465b] shadow-lg w-64 fixed md:static md:translate-x-0 md:right-0 right-0 z-30 transition-transform duration-200 ease-in-out h-full",
          {
            "translate-x-full": !sidebarOpen,
            "translate-x-0": sidebarOpen,
          }
        )}
      >
        <div className="flex justify-end p-2 md:hidden">
          <button onClick={() => setSidebarOpen(false)} className="text-white">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 border-b text-center text-2xl font-bold text-white ">
          لوحة التحكم
        </div>
        <ul className="p-4 space-y-2">
          {menuItems.map(({ name, icon: Icon }) => (
            <li
              key={name}
              className={classNames(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200",
                {
                  "bg-[#5196ac] text-white shadow-md": activePage === name,
                  "text-white hover:bg-[#5196AC] hover:opacity-80": activePage !== name,
                }
              )}
              onClick={() => {
                setActivePage(name);
                setSidebarOpen(false);
              }}
            >
              <Icon size={20} />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col ml-0 overflow-auto">
        <div className="flex items-center justify-between bg-white p-4 shadow-md md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-bold text-[#5196ac]">لوحة الأدمن</span>
        </div>
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;