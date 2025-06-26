import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import AdminDashboard from "../pages/admin/AdminDashboard";
import PrincipleDashboard from "../pages/principle/PrincipleDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";
import Login from "../pages/Login";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "admin", element: <AdminDashboard /> },
      { path: "principle", element: <PrincipleDashboard /> },
      { path: "teacher", element: <TeacherDashboard /> },
      { path: "student", element: <StudentDashboard /> },
      // { path: "login", element: <LoginPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
