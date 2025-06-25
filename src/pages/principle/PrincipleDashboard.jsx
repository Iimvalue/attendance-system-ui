import { Menu } from "lucide-react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PrincipleDashboard = () => {
  const token = localStorage.getItem("Token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // useEffect(() => {
  //   if (!token || role !== "principle") {
  //     navigate("/");
  //   }
  // }, []);


  return (
  <>
      {/* nav ... */}
      <nav className="shadow-md mx-5 md:mx-10 mt-4 rounded-xl fixed w-[calc(100%-2.5rem)] md:w-[calc(100%-5rem)] bg-white z-50">
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
      {/*  */}

      <div className="pt-25 pb-10 min-h-screen bg-gray-200 text-right">
        <div className="p-8 bg-white rounded-xl shadow-md overflow-hidden flex flex-col mx-5 md:mx-10">
          <h1 className="text-2xl font-bold text-[#27465b] mb-4">...</h1>
        
        </div>
      </div>
    </>
  );
};

export default PrincipleDashboard;
