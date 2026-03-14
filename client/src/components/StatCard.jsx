export default function StatCard({ icon, value, label, delta }) {
  return (
    <div style={s.card}>
      <div style={s.icon}>{icon}</div>
      <div style={s.value}>{value}</div>
      <div style={s.label}>{label}</div>
    </div>
  );
}

const s = {
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "18px 16px",
    border: "1.5px solid #e5e7eb",
  },
  icon: { fontSize: 22, marginBottom: 8 },
  value: { fontSize: 26, fontWeight: 900, color: "#065f46" },
  label: { fontSize: 12, fontWeight: 700, color: "#6b7280", marginTop: 3 },
  delta: { fontSize: 11, color: "#10b981", fontWeight: 600, marginTop: 2 },
};
