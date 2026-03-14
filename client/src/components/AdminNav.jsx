import { useAuth } from "../context/AuthContext";

export default function AdminNav({ activePage, setActivePage }) {
  const { user, logout } = useAuth();
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "meals",     label: "Meal Items" },
    { id: "coupons",   label: "Coupons" },
    { id: "createUser", label: "Create User" },
    { id: "ngo", label: "Donate to NGO" }
  ];

  return (
    <nav style={s.nav}>
      <div style={{ ...s.logoWrap, cursor: "pointer" }} onClick={() => setActivePage("dashboard")}>
        <div style={s.logoText}>🌿 GreenBite</div>
        <div style={s.adminBadge}>Admin</div>
      </div>
      <div style={s.tabsWrap}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActivePage(t.id)}
            style={{ ...s.tab, ...(activePage === t.id ? s.tabActive : {}) }}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={s.right}>
        <div style={s.userChip}>
          <span style={s.avatar}>👨‍💼</span>
          <span style={s.adminName}>{user?.fullName || "Admin"}</span>
        </div>
        <button style={s.logoutBtn} onClick={logout}>↩ Logout</button>
      </div>
    </nav>
  );
}

const s = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 28px", height: 62,
    background: "rgba(255,255,255,0.96)", borderBottom: "1.5px solid #d1fae5",
    position: "sticky", top: 0, zIndex: 100,
  },
  logoWrap: { display: "flex", alignItems: "center", gap: 8 },
  logoText: { fontSize: 19, fontWeight: 900, color: "#065f46", fontFamily: "'Nunito','Segoe UI',sans-serif" },
  adminBadge: { background: "#064e3b", color: "#6ee7b7", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 50 },
  tabsWrap: { display: "flex", gap: 3, background: "#f0fdf4", padding: 4, borderRadius: 10 },
  tab: {
    padding: "7px 15px", border: "none", background: "transparent", borderRadius: 8,
    cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#6b7280",
    fontFamily: "'Nunito','Segoe UI',sans-serif", transition: "all 0.18s",
  },
  tabActive: { background: "#fff", color: "#065f46", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  right: { display: "flex", alignItems: "center", gap: 10 },
  userChip: { display: "flex", alignItems: "center", gap: 7 },
  avatar: { fontSize: 18 },
  adminName: { fontSize: 13, fontWeight: 700, color: "#065f46" },
  logoutBtn: {
    padding: "6px 14px", borderRadius: 9, border: "1.5px solid #fee2e2",
    background: "#fff5f5", color: "#dc2626", fontSize: 12, fontWeight: 700,
    cursor: "pointer", fontFamily: "'Nunito','Segoe UI',sans-serif",
  },
};
