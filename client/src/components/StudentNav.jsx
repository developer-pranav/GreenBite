import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function StudentNav({
  activePage,
  setActivePage,
}) {

  const { user, logout } = useAuth();

  const [hoverPts, setHoverPts] = useState(false);
  const [hoverUser, setHoverUser] = useState(false);


  const fetchPoints = async () => {
    try {
      const res  = await fetch(`${API_URL}/users/me`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setPts(data.data?.point ?? data.point ?? 0);
    } catch (err) {
      console.log(err);
    }
  };

  return (

    <nav style={s.nav}>

      <div
        style={s.logo}
        onClick={() => setActivePage("today")}
      >
        🌿 GreenBite
      </div>


      <div style={s.right}>

        {/* POINTS */}

        <div
          style={{
            ...s.ptsBadge,
            background: hoverPts
              ? "#fde68a"
              : "#fef3c7",
          }}
          onClick={() =>
            setActivePage("redeem")
          }
          onMouseEnter={() =>
            setHoverPts(true)
          }
          onMouseLeave={() =>
            setHoverPts(false)
          }
        >

          ⭐
          <span style={{ fontWeight: 800 }}>
            {user?.point || 0}
          </span>

        </div>



        {/* USER */}

        <div
          style={s.userChip}
          onClick={() =>
            setActivePage("account")
          }
        >

          👤
          <span style={s.userName}>
            {user?.fullName?.split(" ")[0]}
          </span>

        </div>



        {/* LOGOUT */}

        <button
          style={s.logoutBtn}
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </nav>

  );

}



const s = {

  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    height: 62,
    background: "#ffffff",
    borderBottom: "1px solid #d1fae5",
  },

  logo: {
    fontSize: 18,
    fontWeight: 900,
    color: "#065f46",
    cursor: "pointer",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  ptsBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 14px",
    borderRadius: 50,
    border: "1px solid #fbbf24",
    fontSize: 14,
    color: "#92400e",
    cursor: "pointer",
  },

  userChip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 10px",
    borderRadius: 9,
    cursor: "pointer",
  },

  userName: {
    fontSize: 13,
    fontWeight: 700,
    color: "#065f46",
  },

  logoutBtn: {
    padding: "6px 14px",
    borderRadius: 8,
    border: "1px solid #fecaca",
    background: "#fff5f5",
    color: "#dc2626",
    fontWeight: 700,
    cursor: "pointer",
  },

};
