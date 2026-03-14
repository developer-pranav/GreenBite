import { useState, useEffect } from "react";
import StatCard from "../../components/StatCard";
import MealStatCard from "../../components/MealStatCard";
import API_URL from "../../api";

const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    wasteSaved: 0,
    pointsAwarded: 0,
    couponsClaimed: 0,
  });
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/admin/dashboard`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load dashboard");
        return;
      }

      setStats(data.stats);
      setMeals(data.meals);
    } catch (err) {
      setError("Server error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={s.title}>Dashboard</div>
      <div style={s.sub}>Today · {today}</div>

      {error && <div style={s.error}>⚠️ {error}</div>}

      {/* Stats Row */}
      <div style={s.statsRow}>
        <StatCard
          icon="👥"
          value={loading ? "—" : stats.totalStudents}
          label="Total Students"
          delta="Admins excluded"
        />
        <StatCard
          icon="🚫"
          value={loading ? "—" : stats.wasteSaved}
          label="Meals Skipped Today"
          delta="Opted out count"
        />
        <StatCard
          icon="⭐"
          value={loading ? "—" : stats.pointsAwarded}
          label="Points Awarded"
          delta="All students total"
        />
        <StatCard
          icon="🎟️"
          value={loading ? "—" : stats.couponsClaimed}
          label="Coupons Claimed"
          delta="All time"
        />
      </div>

      {/* Meal Stats */}
      <div style={s.sectionTitle}>
        <div style={s.dot} />
        Today's Meal Opt-in / Opt-out
      </div>

      {loading ? (
        <div style={s.mealsGrid}>
          {["b", "l", "d"].map((k) => (
            <div key={k} style={s.skeleton} />
          ))}
        </div>
      ) : meals.length === 0 ? (
        <div style={s.empty}>
          No meal activity recorded for today yet.
        </div>
      ) : (
        <div style={s.mealsGrid}>
          {meals.map((m) => (
            <MealStatCard key={m.key} meal={m} />
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  title: {
    fontSize: 22,
    fontWeight: 900,
    color: "#064e3b",
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 22,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0,1fr))",
    gap: 13,
    marginBottom: 28,
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    fontSize: 16,
    fontWeight: 800,
    color: "#064e3b",
    marginBottom: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#10b981",
    flexShrink: 0,
  },
  mealsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0,1fr))",
    gap: 14,
  },
  skeleton: {
    height: 200,
    borderRadius: 18,
    background: "#f0fdf4",
    border: "1.5px solid #d1fae5",
    animation: "pulse 1.4s ease-in-out infinite",
  },
  empty: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: 600,
    background: "#fff",
    borderRadius: 18,
    border: "1.5px solid #e5e7eb",
  },
  error: {
    background: "#fff5f5",
    border: "1.5px solid #fee2e2",
    borderRadius: 10,
    padding: "12px 16px",
    color: "#dc2626",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 20,
  },
};
