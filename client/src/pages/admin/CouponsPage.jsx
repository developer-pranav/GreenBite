import { useState, useEffect } from "react";
import CouponModal from "../../components/CouponModal";
import API_URL from "../../api";

export default function CouponsPage({ showToast }) {
  const [coupons, setCoupons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_URL}/reward/coupons`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setCoupons(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const openAdd  = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (c) => { setEditTarget(c);    setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleSave = async (formData) => {
    try {
      if (editTarget) {
        const res = await fetch(`${API_URL}/reward/coupons/${editTarget._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
        const resData = await res.json();
        if (res.ok) {
          setCoupons((prev) =>
            prev.map((c) => (c._id === editTarget._id ? resData.data : c))
          );
          showToast("✅ Coupon updated!");
        }
      } else {
        const res = await fetch(`${API_URL}/reward/coupons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
        const resData = await res.json();
        if (res.ok) {
          setCoupons((prev) => [...prev, resData.data]);
          showToast("✅ Coupon added!");
        }
      }
      closeModal();
    } catch (err) {
      showToast("❌ Error saving coupon", "#dc2626");
    }
  };

  const toggleActive = async (c) => {
    try {
      const res = await fetch(`${API_URL}/reward/coupons/${c._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ active: !c.active }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((item) =>
            item._id === c._id ? { ...item, active: !item.active } : item
          )
        );
        showToast(!c.active ? "✅ Coupon enabled!" : "🔒 Coupon disabled!");
      }
    } catch (err) {
      showToast("❌ Error updating status", "#dc2626");
    }
  };

  const deleteCoupon = async (id) => {
    try {
      const res = await fetch(`${API_URL}/reward/coupons/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
        showToast("🗑️ Coupon deleted!", "#9a3412");
      }
    } catch (err) {
      showToast("❌ Error deleting", "#dc2626");
    }
  };

  return (
    <div>
      <div style={s.titleRow}>
        <div>
          <div style={s.title}>Coupons</div>
          <div style={s.sub}>{coupons.length} coupons total</div>
        </div>
        <button style={s.addBtn} onClick={openAdd}>＋ Add Coupon</button>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              {["Coupon", "Brand", "Category", "Points", "Validity", "Status", "Actions"].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => {
              const cid = c._id || c.id;
              return (
                <tr key={cid} style={s.tr}>
                  <td style={s.td}>
                    <span style={s.couponEmoji}>{c.emoji}</span>
                    <strong style={{ color: "#111827" }}>{c.name || c.title}</strong>
                  </td>
                  <td style={{ ...s.td, color: "#6b7280" }}>{c.brand}</td>
                  <td style={s.td}>
                    <span style={s.catBadge}>{c.cat}</span>
                  </td>
                  <td style={s.td}>
                    <span style={s.ptsBadge}>⭐ {c.pts || c.pointsRequired}</span>
                  </td>
                  <td style={{ ...s.td, color: "#9ca3af", fontSize: 12 }}>{c.validity}</td>
                  <td style={s.td}>
                    <span style={c.active ? s.badgeActive : s.badgeInactive}>
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button style={s.actionBtn} onClick={() => openEdit(c)}>✏️ Edit</button>
                    <button style={s.actionBtn} onClick={() => toggleActive(c)}>
                      {c.active ? "🔒 Disable" : "✅ Enable"}
                    </button>
                    <button
                      style={{ ...s.actionBtn, ...s.actionBtnDel }}
                      onClick={() => deleteCoupon(cid)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <CouponModal coupon={editTarget} onSave={handleSave} onClose={closeModal} />
      )}
    </div>
  );
}

const s = {
  titleRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  title: { fontSize: 22, fontWeight: 900, color: "#064e3b", marginBottom: 4 },
  sub: { fontSize: 13, color: "#9ca3af" },
  addBtn: {
    padding: "9px 18px", borderRadius: 10, border: "none",
    background: "#065f46", color: "#fff", fontSize: 13,
    fontWeight: 700, cursor: "pointer",
    fontFamily: "'Nunito','Segoe UI',sans-serif",
  },
  tableWrap: { background: "#fff", borderRadius: 18, border: "1.5px solid #e5e7eb", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  thead: { background: "#f8fafb" },
  th: {
    padding: "12px 16px", textAlign: "left",
    fontSize: 11, fontWeight: 800, color: "#9ca3af",
    textTransform: "uppercase", letterSpacing: "0.5px",
  },
  tr: { borderTop: "1px solid #f3f4f6" },
  td: { padding: "12px 16px", fontWeight: 600, color: "#374151", verticalAlign: "middle" },
  couponEmoji: { fontSize: 16, marginRight: 6 },
  catBadge: { background: "#f3f4f6", color: "#6b7280", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 50 },
  ptsBadge: { background: "#fef3c7", color: "#92400e", fontSize: 12, fontWeight: 800, padding: "3px 9px", borderRadius: 50, border: "1px solid #fbbf24" },
  badgeActive: { background: "#d1fae5", color: "#065f46", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 50 },
  badgeInactive: { background: "#fee2e2", color: "#dc2626", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 50 },
  actionBtn: {
    padding: "5px 11px", borderRadius: 7,
    border: "1.5px solid #e5e7eb", background: "#fff",
    fontSize: 12, fontWeight: 700, cursor: "pointer",
    fontFamily: "'Nunito','Segoe UI',sans-serif",
    color: "#374151", marginRight: 4,
  },
  actionBtnDel: { borderColor: "#fee2e2", color: "#dc2626" },
};
