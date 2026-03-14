import { useState, useRef } from "react";
import StudentNav from "./components/StudentNav";
import TodayPage from "./pages/student/TodayPage";
import RedeemPage from "./pages/student/RedeemPage";
import AccountPage from "./pages/student/AccountPage";
import { useAuth } from "./context/AuthContext";

export default function StudentApp() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState("today");
  const [pts, setPts] = useState(user?.point || 0);
  const [claimedCoupons, setClaimedCoupons] = useState(new Set());
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg, bg = "#065f46") => {
    setToast({ msg, bg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const addPoints = (amount) => setPts((p) => p + amount);

  const claimCoupon = (coupon) => {
    if (claimedCoupons.has(coupon.id) || pts < coupon.pts) return;
    setClaimedCoupons((prev) => new Set([...prev, coupon.id]));
    setPts((p) => p - coupon.pts);
    showToast(`🎟️ "${coupon.name}" coupon claimed!`);
  };

  return (
    <div style={s.root}>
      {toast && <div style={{ ...s.toast, background: toast.bg }}>{toast.msg}</div>}
      <StudentNav activePage={activePage} setActivePage={setActivePage} pts={pts} />
      <main style={s.main}>
        {activePage === "today" && <TodayPage addPoints={addPoints} showToast={showToast} />}
        {activePage === "redeem" && <RedeemPage pts={pts} claimedCoupons={claimedCoupons} claimCoupon={claimCoupon} />}
        {activePage === "account" && <AccountPage pts={pts} claimedCoupons={claimedCoupons} showToast={showToast} />}
      </main>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Nunito','Segoe UI',sans-serif" },
  main: { maxWidth: 820, margin: "0 auto", padding: "26px 18px 60px" },
  toast: {
    position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
    color: "#fff", padding: "10px 22px", borderRadius: 50,
    fontWeight: 700, fontSize: 13, zIndex: 999, pointerEvents: "none",
  },
};
