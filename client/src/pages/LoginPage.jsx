import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
  setError("");

  if (!email.trim() || !password.trim()) {
    setError("Please enter email and password.");
    return;
  }

  setLoading(true);

  const result = await login({
    email: email.trim(),
    password,
  });

  if (result?.error) {
    setError(result.error);
  }

  setLoading(false);
};

  const fillDemo = (role) => {
    if (role === "student") { setEmail("developer.pranav3306@gmail.com"); setPassword("12345678"); }
    else { setEmail("admin.greenbite@gmail.com"); setPassword("admin1234"); }
    setError("");
  };

  return (
    <div style={s.root}>
      <div style={s.card}>
        <div style={s.logo}>🌿</div>
        <div style={s.appName}>GreenBite</div>
        <div style={s.tagline}>Hostel Meal Management System</div>

        <div style={s.field}>
          <label style={s.label}>Email Address</label>
          <input
            style={s.input}
            type="email"
            placeholder="you@hostel.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Password</label>
          <div style={s.passWrap}>
            <input
              style={{ ...s.input, paddingRight: 44 }}
              type={showPass ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button style={s.eyeBtn} onClick={() => setShowPass((v) => !v)}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {error && <div style={s.error}>⚠️ {error}</div>}

        <button
          style={{ ...s.loginBtn, ...(loading ? s.loginBtnLoading : {}) }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>

      </div>
    </div>
  );
}

const s = {
  root: {
    minHeight: "100vh",
    background: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Nunito','Segoe UI',sans-serif",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: 24,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 400,
    border: "1.5px solid #d1fae5",
    boxShadow: "0 8px 40px rgba(16,185,129,0.08)",
    textAlign: "center",
  },
  logo: { fontSize: 44, marginBottom: 8 },
  appName: { fontSize: 26, fontWeight: 900, color: "#065f46", marginBottom: 4 },
  tagline: { fontSize: 13, color: "#9ca3af", fontWeight: 500, marginBottom: 28 },
  demoRow: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 8, marginBottom: 24,
  },
  demoLabel: { fontSize: 12, color: "#9ca3af", fontWeight: 600 },
  demoBtn: {
    padding: "5px 14px", borderRadius: 50, border: "1.5px solid #d1fae5",
    background: "#f0fdf4", color: "#065f46", fontSize: 12, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit",
  },
  field: { marginBottom: 16, textAlign: "left" },
  label: { display: "block", fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6 },
  input: {
    width: "100%", padding: "11px 14px", borderRadius: 12,
    border: "1.5px solid #e5e7eb", fontSize: 14,
    fontFamily: "inherit", color: "#111827", outline: "none",
    transition: "border 0.18s", background: "#fff",
  },
  passWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%",
    transform: "translateY(-50%)", border: "none",
    background: "transparent", cursor: "pointer", fontSize: 16,
  },
  error: {
    background: "#fff5f5", border: "1.5px solid #fee2e2",
    borderRadius: 10, padding: "10px 14px",
    fontSize: 13, color: "#dc2626", fontWeight: 600,
    marginBottom: 16, textAlign: "left",
  },
  loginBtn: {
    width: "100%", padding: "13px 0", borderRadius: 13,
    border: "none", background: "#065f46", color: "#fff",
    fontSize: 15, fontWeight: 800, cursor: "pointer",
    fontFamily: "inherit", marginBottom: 24, transition: "all 0.18s",
  },
  loginBtnLoading: { background: "#6b7280", cursor: "not-allowed" },
  hint: {
    background: "#f8fafb", borderRadius: 10, padding: "12px 14px",
    textAlign: "left",
  },
  hintRow: { fontSize: 12, color: "#9ca3af", marginBottom: 4 },
  hintRole: { fontWeight: 800, color: "#6b7280" },
};
