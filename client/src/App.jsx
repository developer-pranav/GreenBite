import { useRef, useState } from "react";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import StudentApp from "./StudentApp";
import AdminApp from "./AdminApp";

export default function App() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;
  if (user.role === "admin") return <AdminApp />;
  return <StudentApp />;
}
