import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../services/authService";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await signin(email, password);
      console.log("Role after signin:", data.role);

      Swal.fire({
        icon: "success",
        title: "تم تسجيل الدخول بنجاح",
        confirmButtonText: "حسنًا",
      });

      switch (data.role) {
        case "admin":
          navigate("/admin");
          break;
        case "student":
          navigate("/student");
          break;
        case "teacher":
          navigate("/teacher");
          break;
        case "principle":
          navigate("/principle");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "فشل تسجيل الدخول",
        text: error.response?.data?.message || "حدث خطأ ما",
        confirmButtonText: "حسنًا",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-[#27465b] mb-6">
          تسجيل الدخول
        </h2>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          className="w-full mb-6 border border-gray-300 rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-[#5196ac] hover:bg-[#407c93] text-white font-semibold py-2 rounded"
        >
          دخول
        </button>
      </div>
    </div>
  );
};

export default LoginPage;