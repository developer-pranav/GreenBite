import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../api";

export default function AccountPage({ pts, showToast }) {
  const { user, logout } = useAuth();

  const INITIAL_PROFILE = {
    name: user?.fullName || "User",
    email: user?.email || "guest@hostel.edu",
    phone: user?.phone || "+91 9876543210",
    room: user?.room || "204",
  };

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [draft, setDraft] = useState(INITIAL_PROFILE);
  const [claimedList, setClaimedList] = useState([]);

  useEffect(() => {
    fetchClaimed();
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const res  = await fetch(`${API_URL}/users/me`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setPts(data.data?.point ?? data.point ?? 0);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchClaimed = async () => {
    try {
      const res = await fetch(`${API_URL}/reward/coupons/claimed`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setClaimedList(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const startEdit = () => {
    setDraft(profile);
    setEditMode(true);
  };

  const saveEdit = () => {
    setProfile(draft);
    setEditMode(false);
    showToast("✅ Profile updated!", "#047857");
  };

  return (
    <div>
      {/* Profile Card */}
      <div style={s.profCard}>
        <div style={s.profTop}>
          <div style={s.avatar}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={s.profName}>{profile.name}</div>
            <div style={s.profEmail}>{profile.email}</div>
            <div style={s.profMeta}>🏠 {profile.room}</div>
          </div>
        </div>
      </div>

      {/* Points summary */}
      <div style={s.statsGrid}>
        <div style={s.statBox}>
          <div style={s.statIcon}>⭐</div>
          <div style={s.statVal}>{pts}</div>
          <div style={s.statLbl}>Total Points</div>
        </div>
        <div style={s.statBox}>
          <div style={s.statIcon}>🎟️</div>
          <div style={s.statVal}>{claimedList.length}</div>
          <div style={s.statLbl}>Coupons Claimed</div>
        </div>
      </div>

      {/* Claimed Coupons */}
      <div style={s.infoCard}>
        <div style={s.infoHdr}>
          <span style={s.infoHdrIcon}>🎟️</span>
          <span style={s.infoHdrTitle}>Coupons Claimed</span>
        </div>

        {claimedList.length === 0 ? (
          <div style={s.infoRow}>
            <div>
              <div style={s.irLeft}>No coupons claimed yet</div>
              <div style={s.irSub}>Head to Redeem Points to grab your first deal</div>
            </div>
          </div>
        ) : (
          claimedList.map((c) => (
            <div key={c._id} style={s.infoRow}>
              <div>
                <div style={s.irLeft}>
                  {c.emoji || "🎟️"} {c.name || c.title}
                </div>
                <div style={s.irSub}>
                  {c.brand} · {c.validity}
                </div>
              </div>
              <div style={s.irVal}>−{c.pts || c.pointsRequired} pts</div>
            </div>
          ))
        )}
      </div>

      <button style={s.logoutBtn} onClick={logout}>🚪 Log Out</button>
    </div>
  );
}

const s = {
  profCard: { background: "#fff", borderRadius: 20, padding: 24, border: "1.5px solid #e5e7eb", marginBottom: 16 },
  profTop: { display: "flex", alignItems: "center", gap: 16, marginBottom: 20 },
  avatar: { width: 68, height: 68, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, border: "2px solid #6ee7b7" },
  profName: { fontSize: 20, fontWeight: 900, color: "#111827" },
  profEmail: { fontSize: 13, color: "#6b7280", fontWeight: 500, marginTop: 2 },
  profMeta: { fontSize: 12, color: "#9ca3af", marginTop: 3 },
  editBtn: { marginLeft: "auto", padding: "8px 16px", borderRadius: 10, border: "1.5px solid #d1fae5", background: "#f0fdf4", color: "#065f46", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito','Segoe UI',sans-serif", flexShrink: 0 },
  saveBtn: { marginLeft: "auto", padding: "8px 16px", borderRadius: 10, border: "1.5px solid #10b981", background: "#10b981", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito','Segoe UI',sans-serif", flexShrink: 0 },
  fields: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  fieldLabel: { fontSize: 12, fontWeight: 700, color: "#6b7280" },
  input: { padding: "9px 13px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, fontFamily: "'Nunito','Segoe UI',sans-serif", color: "#9ca3af", background: "#f9fafb", outline: "none" },
  inputActive: { color: "#111827", background: "#fff", borderColor: "#34d399" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 11, marginBottom: 16 },
  statBox: { background: "#fff", borderRadius: 14, padding: "14px 10px", textAlign: "center", border: "1.5px solid #e5e7eb" },
  statIcon: { fontSize: 20, marginBottom: 5 },
  statVal: { fontSize: 20, fontWeight: 900, color: "#065f46" },
  statLbl: { fontSize: 11, fontWeight: 700, color: "#6b7280", marginTop: 2 },
  infoCard: { background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", marginBottom: 14, overflow: "hidden" },
  infoHdr: { padding: "14px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 },
  infoHdrIcon: { fontSize: 16 },
  infoHdrTitle: { fontSize: 14, fontWeight: 800, color: "#111827" },
  infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 18px", borderBottom: "1px solid #f9fafb" },
  irLeft: { fontSize: 14, fontWeight: 700, color: "#111827" },
  irSub: { fontSize: 12, color: "#9ca3af", marginTop: 1 },
  irVal: { fontSize: 13, fontWeight: 700, color: "#065f46" },
  logoutBtn: { width: "100%", padding: 13, borderRadius: 13, border: "1.5px solid #fee2e2", background: "#fff5f5", color: "#dc2626", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito','Segoe UI',sans-serif", marginTop: 6 },
};
