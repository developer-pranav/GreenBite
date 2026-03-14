export default function CouponCard({ coupon, pts, claimed, onClaim }) {
  const canAfford = pts >= coupon.pts;

  return (
    <div
      style={{
        ...s.card,
        ...(claimed ? s.cardClaimed : {}),
        ...(!canAfford && !claimed ? s.cardWeak : {}),
      }}
    >
      {claimed && <div style={s.stamp}>✓ Claimed</div>}

      <div style={s.top}>
        <span style={s.emoji}>{coupon.emoji}</span>
        <span style={s.ptsBadge}>{coupon.pts} pts</span>
      </div>

      <div style={s.name}>{coupon.name}</div>
      <div style={s.brand}>{coupon.brand}</div>
      <div style={s.desc}>{coupon.desc}</div>
      <div style={s.validity}>🗓 {coupon.validity}</div>

      <button
        onClick={() => onClaim(coupon)}
        disabled={claimed || !canAfford}
        style={{
          ...s.btn,
          ...(claimed ? s.btnDone : canAfford ? s.btnGo : s.btnNa),
        }}
      >
        {claimed
          ? "✅ Claimed"
          : canAfford
          ? "🎟️ Claim Coupon"
          : `Need ${coupon.pts - pts} more pts`}
      </button>
    </div>
  );
}

const s = {
  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    border: "1.5px solid #e5e7eb",
    position: "relative",
    transition: "all 0.2s",
  },
  cardClaimed: { borderColor: "#d1fae5", background: "#f0fdf4" },
  cardWeak: { opacity: 0.55 },
  stamp: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "#10b981",
    color: "#fff",
    fontSize: 10,
    fontWeight: 800,
    padding: "3px 8px",
    borderRadius: 50,
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  emoji: { fontSize: 30 },
  ptsBadge: {
    fontSize: 11,
    fontWeight: 800,
    color: "#065f46",
    background: "#d1fae5",
    padding: "3px 9px",
    borderRadius: 50,
  },
  name: { fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 3 },
  brand: { fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: 3 },
  desc: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 10,
    lineHeight: 1.45,
  },
  validity: { fontSize: 11, color: "#9ca3af", marginBottom: 12 },
  btn: {
    width: "100%",
    padding: "9px 0",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    border: "none",
    transition: "all 0.18s",
  },
  btnGo: { background: "#065f46", color: "#fff", cursor: "pointer" },
  btnDone: {
    background: "#d1fae5",
    color: "#065f46",
    cursor: "not-allowed",
    pointerEvents: "none",
  },
  btnNa: {
    background: "#f3f4f6",
    color: "#9ca3af",
    cursor: "not-allowed",
    pointerEvents: "none",
  },
};
