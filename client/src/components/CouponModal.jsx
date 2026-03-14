import { useState, useEffect } from "react";

const EMPTY = { name: "", brand: "", desc: "", pts: "", cat: "food", validity: "", emoji: "" };

export default function CouponModal({ coupon, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(coupon ? { ...coupon, pts: String(coupon.pts) } : EMPTY);
  }, [coupon]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({ ...form, pts: parseInt(form.pts) || 100, emoji: form.emoji || "🎟️" });
  };

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.title}>{coupon ? "Edit Coupon" : "Add New Coupon"}</div>

        {[
          { key: "name", label: "Coupon Name", placeholder: "e.g. Free Coffee" },
          { key: "brand", label: "Brand", placeholder: "e.g. Café Coffee Day" },
          { key: "desc", label: "Description", placeholder: "Short description..." },
          { key: "validity", label: "Validity", placeholder: "e.g. Valid till Apr 30" },
          { key: "emoji", label: "Emoji Icon", placeholder: "☕" },
        ].map((f) => (
          <div key={f.key} style={s.field}>
            <label style={s.label}>{f.label}</label>
            <input
              style={s.input}
              value={form[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => set(f.key, e.target.value)}
            />
          </div>
        ))}

        <div style={s.row}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Points Required</label>
            <input
              style={s.input}
              type="number"
              value={form.pts}
              placeholder="100"
              onChange={(e) => set("pts", e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Category</label>
            <select style={s.input} value={form.cat} onChange={(e) => set("cat", e.target.value)}>
              <option value="food">Food & Cafe</option>
              <option value="shopping">Shopping</option>
              <option value="wellness">Wellness</option>
            </select>
          </div>
        </div>

        <div style={s.actions}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={s.saveBtn} onClick={handleSave}>Save Coupon</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.4)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 500,
  },
  modal: {
    background: "#fff", borderRadius: 20, padding: 28,
    width: 420, maxWidth: "94vw",
  },
  title: { fontSize: 17, fontWeight: 900, color: "#111827", marginBottom: 18 },
  field: { marginBottom: 13 },
  label: { fontSize: 12, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5 },
  input: {
    width: "100%", padding: "9px 13px", borderRadius: 10,
    border: "1.5px solid #e5e7eb", fontSize: 14,
    fontFamily: "'Nunito','Segoe UI',sans-serif",
    color: "#111827", outline: "none", background: "#fff",
  },
  row: { display: "flex", gap: 10, marginBottom: 6 },
  actions: { display: "flex", gap: 10, marginTop: 20 },
  cancelBtn: {
    flex: 1, padding: 11, borderRadius: 10, border: "1.5px solid #e5e7eb",
    background: "#fff", color: "#6b7280", fontSize: 14, fontWeight: 700,
    cursor: "pointer", fontFamily: "'Nunito','Segoe UI',sans-serif",
  },
  saveBtn: {
    flex: 1, padding: 11, borderRadius: 10, border: "none",
    background: "#065f46", color: "#fff", fontSize: 14, fontWeight: 700,
    cursor: "pointer", fontFamily: "'Nunito','Segoe UI',sans-serif",
  },
};
