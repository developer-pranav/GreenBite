export default function MealStatCard({ meal }) {
  const total = meal.opted + meal.skipped + meal.pending;
  const optPct = total > 0 ? Math.round((meal.opted / total) * 100) : 0;
  const skipPct = total > 0 ? Math.round((meal.skipped / total) * 100) : 0;

  return (
    <div style={s.card}>
      <div style={s.header}>
        <span style={s.emoji}>{meal.icon}</span>
        <div>
          <div style={s.name}>{meal.name}</div>
          <div style={s.time}>{meal.time}</div>
        </div>
      </div>

      <div style={s.barWrap}>
        <div style={s.barLabel}>
          <span style={{ color: "#065f46" }}>Opted In</span>
          <span>{meal.opted} ({optPct}%)</span>
        </div>
        <div style={s.barTrack}>
          <div style={{ ...s.barFill, width: `${optPct}%`, background: "#10b981" }} />
        </div>
      </div>

      <div style={s.barWrap}>
        <div style={s.barLabel}>
          <span style={{ color: "#9a3412" }}>Skipped</span>
          <span>{meal.skipped} ({skipPct}%)</span>
        </div>
        <div style={s.barTrack}>
          <div style={{ ...s.barFill, width: `${skipPct}%`, background: "#fb923c" }} />
        </div>
      </div>

      <div style={s.tags}>
        <span style={{ ...s.tag, background: "#d1fae5", color: "#065f46" }}>✅ {meal.opted} opted</span>
        <span style={{ ...s.tag, background: "#ffedd5", color: "#9a3412" }}>🚫 {meal.skipped} skipped</span>
        <span style={{ ...s.tag, background: "#f3f4f6", color: "#6b7280" }}>⏳ {meal.pending} pending</span>
      </div>
    </div>
  );
}

const s = {
  card: { background: "#fff", borderRadius: 18, padding: 20, border: "1.5px solid #e5e7eb" },
  header: { display: "flex", alignItems: "center", gap: 9, marginBottom: 14 },
  emoji: { fontSize: 22 },
  name: { fontSize: 15, fontWeight: 800, color: "#111827" },
  time: { fontSize: 11, color: "#9ca3af" },
  barWrap: { marginBottom: 10 },
  barLabel: { display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 5 },
  barTrack: { height: 9, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 99, transition: "width 0.6s ease" },
  tags: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" },
  tag: { fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 50 },
};



