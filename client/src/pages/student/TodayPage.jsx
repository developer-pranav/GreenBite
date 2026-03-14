import { useEffect, useState } from "react";
import MealCard from "../../components/MealCard";
import API_URL from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function TodayPage({ showToast }) {

  const { user, setUser } = useAuth();

  const [meals, setMeals] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchMeals();
    fetchBookings();
  }, []);



  // =========================
  // GET MEALS
  // =========================

  const fetchMeals = async () => {

    try {

      const res = await fetch(
        `${API_URL}/meals`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (res.ok) {
        setMeals(data.data);
      }

    } catch (err) {
      console.log(err);
    }
  };



  // =========================
  // GET MY BOOKINGS
  // =========================

  const fetchBookings = async () => {

    try {

      const res = await fetch(
        `${API_URL}/bookings/my`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (res.ok) {
        setBookings(data.data);
      }

    } catch (err) {
      console.log(err);
    }
  };



  // =========================
  // CHOOSE MEAL
  // =========================

  const handleChoose = async (
  meal,
  choice
) => {

  try {

    const res = await fetch(
      `${API_URL}/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          mealType:
            meal.mealType,
          date: new Date()
            .toISOString()
            .split("T")[0],
          status: choice,
        }),
      }
    );

    const data =
      await res.json();

    if (!res.ok) {

      showToast(
        data.message ||
          "Error",
        "#dc2626"
      );

      return;
    }


    // ✅ NEW POINT

    const newPoint =
      data.data.point;

    const diff =
      newPoint - user.point;


    showToast(
      `+${diff} points ⭐`,
      "#16a34a"
    );


    // ✅ realtime update

    setUser({
      ...user,
      point: newPoint,
    });


    fetchBookings();

  } catch (err) {

    console.log(err);

    showToast(
      "Server error",
      "#dc2626"
    );

  }

};



  // =========================
  // UI
  // =========================

  return (

    <div>

      <div style={s.greeting}>
        Hey {user?.fullName || "Student"} 👋
      </div>


      <div style={s.sectionTitle}>
        <div style={s.dot} />
        Today's Meals
        <span style={s.note}>
          Select before deadline
        </span>
      </div>


      <div style={s.list}>

        {meals.map((meal) => {

          const booking =
            bookings.find(
              (b) =>
                b.mealType ===
                meal.mealType
            );

          return (

            <MealCard
              key={meal._id}
              meal={meal}
              initialStatus={
                booking?.status
              }
              onChoose={(choice) =>
                handleChoose(
                  meal,
                  choice
                )
              }
            />

          );

        })}

      </div>

    </div>
  );
}



const s = {

  greeting: {
    fontSize: 26,
    fontWeight: 900,
    color: "#064e3b",
    marginBottom: 5,
  },

  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    fontSize: 16,
    fontWeight: 800,
    color: "#064e3b",
    margin: "22px 0 13px",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#10b981",
  },

  note: {
    fontSize: 12,
    color: "#9ca3af",
    marginLeft: 8,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 13,
  },

};
