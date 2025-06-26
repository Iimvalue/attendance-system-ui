import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import AdminDashboard from "../pages/admin/AdminDashboard";
import PrincipleDashboard from "../pages/principle/PrincipleDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../pages/component/ProtectedRoute";

function Layout() {
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [

      { path: "/", element: <LoginPage /> },
      { path: "login", element: <LoginPage /> },

      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "principle",
        element: (
          <ProtectedRoute>
            <PrincipleDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "teacher",
        element: (
          <ProtectedRoute>
            <TeacherDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "student",
        element: (
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}