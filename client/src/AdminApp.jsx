import { useState, useRef } from "react";
import AdminNav from "./components/AdminNav";
import DashboardPage from "./pages/admin/DashboardPage";
import MealItemsPage from "./pages/admin/MealItemsPage";
import CouponsPage from "./pages/admin/CouponsPage";
import CreateUserPage from "./pages/admin/CreateUser";
import NGOPage from "./pages/admin/NgoPage";


export default function AdminApp() {
  const [activePage, setActivePage] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg, bg = "#065f46") => {
    setToast({ msg, bg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  return (
    <div style={s.root}>
      {toast && <div style={{ ...s.toast, background: toast.bg }}>{toast.msg}</div>}
      <AdminNav activePage={activePage} setActivePage={setActivePage} />
      <main style={s.main}>
        {activePage === "dashboard" && <DashboardPage />}
        {activePage === "meals"     && <MealItemsPage showToast={showToast} />}
        {activePage === "coupons"   && <CouponsPage showToast={showToast} />}
        {activePage === "createUser"     && <CreateUserPage showToast={showToast} />}
        {activePage === "ngo"     && <NGOPage showToast={showToast} />}
      </main>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Nunito','Segoe UI',sans-serif" },
  main: { maxWidth: 980, margin: "0 auto", padding: "26px 18px 60px" },
  toast: {
    position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
    color: "#fff", padding: "10px 22px", borderRadius: 50,
    fontWeight: 700, fontSize: 13, zIndex: 999, pointerEvents: "none",
  },
};
