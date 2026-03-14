export default function NGOPage() {
  return (
    <div style={s.wrap}>
      <div style={s.icon}>🌍</div>
      <div style={s.title}>NGO Donations</div>
      <div style={s.badge}>Coming Soon</div>
      <div style={s.sub}>
        We're working on connecting GreenBite with NGO partners.<br />
        Surplus food donation feature will be live soon!
      </div>
    </div>
  );
}

const s = {
  wrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", minHeight: "60vh", textAlign: "center",
  },
  icon:  { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: 900, color: "#064e3b", marginBottom: 12 },
  badge: {
    background: "#fef3c7", color: "#92400e", fontSize: 13,
    fontWeight: 800, padding: "6px 18px", borderRadius: 50,
    border: "1.5px solid #fbbf24", marginBottom: 16,
  },
  sub: {
    fontSize: 14, color: "#9ca3af", fontWeight: 500,
    lineHeight: 1.7, maxWidth: 360,
  },
};
