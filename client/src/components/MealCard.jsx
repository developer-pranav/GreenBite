import { useState, useEffect } from "react";

export default function MealCard({ meal, onChoose, initialStatus }) {
  const [status, setStatus] = useState(initialStatus || null);

  useEffect(() => {
    if (initialStatus) setStatus(initialStatus);
  }, [initialStatus]);

  const choose = (choice) => {
    if (status) return;
    setStatus(choice);
    onChoose(choice);
  };

  const locked = !!status;

  return (
    <div
      style={{
        ...s.card,
        ...(status === "opt" ? s.cardOpt : {}),
        ...(status === "skip" ? s.cardSkip : {}),
      }}
    >
      <div style={s.header}>
        <div style={s.titleRow}>
          <span style={s.emoji}>{meal.icon}</span>
          <div>
            <div style={s.name}>{meal.name}</div>
            <div style={s.time}>{meal.time}</div>
          </div>
        </div>
        <div style={s.deadline}>⏰ {meal.deadline}</div>
      </div>

      <div style={s.chips}>
        {meal.items.map((item, i) => (
          <div key={i} style={s.chip}>
            <span style={s.chipEmoji}>{item.i}</span>
            <span style={s.chipName}>{item.n}</span>
          </div>
        ))}
      </div>

      <div style={s.actions}>
        <button
          onClick={() => choose("opt")}
          style={{
            ...s.btnOpt,
            ...(status === "opt" ? s.btnOptActive : {}),
            ...(locked ? s.btnLocked : {}),
          }}
        >
          {status === "opt" ? "✅ Opted In" : "🍽️ I'll Eat"}
        </button>
        <button
          onClick={() => choose("skip")}
          style={{
            ...s.btnSkip,
            ...(status === "skip" ? s.btnSkipActive : {}),
            ...(locked ? s.btnLocked : {}),
          }}
        >
          {status === "skip" ? "🚫 Opted Out" : "⛔ Skip Meal"}
        </button>
      </div>

      {status === "skip" && (
        <div style={s.savedNote}>
          🌍 Your share will be donated to NGO
        </div>
      )}
    </div>
  );
}

const s = {
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: 20,
    border: "2px solid #e5e7eb",
    transition: "border 0.2s, background 0.2s",
  },
  cardOpt: { borderColor: "#34d399" },
  cardSkip: { borderColor: "#fb923c", background: "#fff7ed" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },
  titleRow: { display: "flex", alignItems: "center", gap: 10 },
  emoji: { fontSize: 26, lineHeight: 1 },
  name: { fontSize: 17, fontWeight: 800, color: "#111827" },
  time: { fontSize: 12, color: "#6b7280", fontWeight: 500 },
  deadline: {
    fontSize: 11,
    fontWeight: 700,
    color: "#92400e",
    background: "#fef3c7",
    padding: "4px 10px",
    borderRadius: 50,
    border: "1px solid #fde68a",
  },
  chips: { display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 16 },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: "#f0fdf4",
    padding: "6px 12px",
    borderRadius: 50,
    border: "1px solid #d1fae5",
    fontSize: 13,
    fontWeight: 700,
    color: "#374151",
  },
  chipEmoji: { fontSize: 15 },
  chipName: {},
  actions: { display: "flex", gap: 9 },
  btnOpt: {
    flex: 1,
    padding: "11px 0",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    border: "2px solid #d1fae5",
    background: "#f0fdf4",
    color: "#065f46",
    cursor: "pointer",
    transition: "all 0.18s",
  },
  btnOptActive: {
    background: "linear-gradient(135deg,#34d399,#10b981)",
    borderColor: "#10b981",
    color: "#fff",
  },
  btnSkip: {
    flex: 1,
    padding: "11px 0",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    border: "2px solid #fee2e2",
    background: "#fff5f5",
    color: "#991b1b",
    cursor: "pointer",
    transition: "all 0.18s",
  },
  btnSkipActive: {
    background: "linear-gradient(135deg,#fb923c,#f97316)",
    borderColor: "#f97316",
    color: "#fff",
  },
  btnLocked: {
    cursor: "not-allowed",
    pointerEvents: "none",
    opacity: 0.38,
    filter: "grayscale(0.5)",
  },
  savedNote: {
    marginTop: 11,
    padding: "9px 13px",
    background: "#fff7ed",
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
    color: "#92400e",
    border: "1px solid #fed7aa",
  },
};
