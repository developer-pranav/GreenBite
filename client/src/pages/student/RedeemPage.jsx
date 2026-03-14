import { useState, useEffect } from "react";
import API_URL from "../../api";

const FILTERS = [
  { id: "all",      label: "All"         },
  { id: "food",     label: "Food & Cafe" },
  { id: "shopping", label: "Shopping"    },
  { id: "wellness", label: "Wellness"    },
];

export default function RedeemPage({ showToast }) {
  const [coupons, setCoupons]     = useState([]);
  const [claimedIds, setClaimedIds] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading]     = useState(true);
  const [pts, setPts]             = useState(0);  // fetch fresh from DB

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchPoints(), fetchCoupons(), fetchClaimed()]);
  };

  // fetch latest points directly from /auth/me so no stale data
  const fetchPoints = async () => {
    try {
      const res  = await fetch(`${API_URL}/users/me`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setPts(data.data?.point ?? data.point ?? 0);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res  = await fetch(`${API_URL}/reward/coupons`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setCoupons(data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimed = async () => {
    try {
      const res  = await fetch(`${API_URL}/reward/coupons/claimed`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        const ids = new Set((data.data || []).map((c) => c._id));
        setClaimedIds(ids);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const claimCoupon = async (coupon) => {
    try {
      const res  = await fetch(`${API_URL}/reward/coupons/${coupon._id}/claim`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setClaimedIds((prev) => new Set([...prev, coupon._id]));
        setPts(data.remainingPoints);  // update points instantly after claim
        showToast(`🎟️ "${coupon.name || coupon.title}" claimed!`);
      } else {
        showToast(`❌ ${data.message}`, "#dc2626");
      }
    } catch (err) {
      showToast("❌ Error claiming coupon", "#dc2626");
    }
  };

  const filtered =
    activeFilter === "all"
      ? coupons
      : coupons.filter((c) => c.cat === activeFilter);

  return (
    <div>
      {/* Points Hero */}
      <div style={s.hero}>
        <div>
          <div style={s.heroLabel}>Your Green Points</div>
          <div style={s.heroVal}>{pts}</div>
          <div style={s.heroSub}>🌱 Skip meals to earn more points</div>
        </div>
        <div style={s.heroIcon}>🏆</div>
      </div>

      {/* Filters */}
      <div style={s.filterRow}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{ ...s.fpill, ...(activeFilter === f.id ? s.fpillActive : {}) }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <div style={s.grid}>
          {[1, 2, 3, 4].map((k) => (
            <div key={k} style={s.skeleton} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>No coupons available in this category.</div>
      ) : (
        <div style={s.grid}>
          {filtered.map((c) => {
            const cid       = c._id;
            const cPts      = c.pts || c.pointsRequired;
            const cName     = c.name || c.title;
            const claimed   = claimedIds.has(cid);
            const canAfford = pts >= cPts;

            return (
              <div
                key={cid}
                style={{
                  ...s.card,
                  ...(claimed ? s.cardClaimed : {}),
                  ...(!canAfford && !claimed ? { opacity: 0.55 } : {}),
                }}
              >
                {claimed && <div style={s.stamp}>✓ Claimed</div>}

                <div style={s.ctop}>
                  <span style={{ fontSize: 30 }}>{c.emoji || "🎟️"}</span>
                  <span style={s.ptsBadge}>{cPts} pts</span>
                </div>

                <div style={s.cname}>{cName}</div>
                <div style={s.cbrand}>{c.brand}</div>
                <div style={s.cdesc}>{c.description}</div>
                <div style={s.cvalidity}>🗓 {c.validity}</div>

                <button
                  disabled={claimed || !canAfford}
                  onClick={() => claimCoupon(c)}
                  style={{
                    ...s.cbtn,
                    ...(claimed ? s.cbtnDone : canAfford ? s.cbtnGo : s.cbtnNa),
                  }}
                >
                  {claimed
                    ? "✅ Claimed"
                    : canAfford
                    ? "🎟️ Claim Coupon"
                    : `Need ${cPts - pts} more pts`}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  hero: {
    background: "#065f46", borderRadius: 20, padding: "26px 22px",
    marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  heroLabel: { fontSize: 12, color: "#6ee7b7", fontWeight: 600, marginBottom: 3 },
  heroVal:   { fontSize: 40, fontWeight: 900, color: "#fff", lineHeight: 1 },
  heroSub:   { fontSize: 12, color: "#a7f3d0", marginTop: 5 },
  heroIcon:  { fontSize: 48, opacity: 0.85 },
  filterRow: { display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap" },
  fpill: {
    padding: "7px 16px", borderRadius: 50, border: "1.5px solid #d1fae5",
    background: "#fff", fontSize: 12, fontWeight: 700, color: "#6b7280",
    cursor: "pointer", fontFamily: "'Nunito','Segoe UI',sans-serif", transition: "all 0.18s",
  },
  fpillActive: { background: "#065f46", borderColor: "#065f46", color: "#fff" },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 13 },
  skeleton: { height: 200, borderRadius: 18, background: "#f0fdf4", border: "1.5px solid #d1fae5" },
  empty: {
    textAlign: "center", padding: "40px 20px", color: "#9ca3af",
    fontSize: 14, fontWeight: 600, background: "#fff",
    borderRadius: 18, border: "1.5px solid #e5e7eb",
  },
  card: {
    background: "#fff", borderRadius: 18, padding: 18,
    border: "1.5px solid #e5e7eb", position: "relative", transition: "all 0.2s",
  },
  cardClaimed: { borderColor: "#d1fae5", background: "#f0fdf4" },
  stamp: {
    position: "absolute", top: 10, right: 10, background: "#10b981",
    color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 50,
  },
  ctop:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  ptsBadge:  { fontSize: 11, fontWeight: 800, color: "#065f46", background: "#d1fae5", padding: "3px 9px", borderRadius: 50 },
  cname:     { fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 3 },
  cbrand:    { fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: 3 },
  cdesc:     { fontSize: 12, color: "#9ca3af", marginBottom: 10, lineHeight: 1.45 },
  cvalidity: { fontSize: 11, color: "#9ca3af", marginBottom: 12 },
  cbtn: {
    width: "100%", padding: "9px 0", borderRadius: 10, fontSize: 13,
    fontWeight: 700, fontFamily: "'Nunito','Segoe UI',sans-serif", border: "none", transition: "all 0.18s",
  },
  cbtnGo:   { background: "#065f46", color: "#fff", cursor: "pointer" },
  cbtnDone: { background: "#d1fae5", color: "#065f46", cursor: "not-allowed", pointerEvents: "none" },
  cbtnNa:   { background: "#f3f4f6", color: "#9ca3af", cursor: "not-allowed", pointerEvents: "none" },
};
