import { useState, useEffect } from "react";
import API_URL from "../../api";

function MealCard({ meal, onSave, onDelete }) {
  const [localItems, setLocalItems] = useState(meal.items || []);
  const [newEmoji, setNewEmoji] = useState("");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    setLocalItems(meal.items || []);
  }, [meal.items]);

  const addItem = () => {
    if (!newName.trim()) return;
    setLocalItems((prev) => [...prev, { i: newEmoji.trim() || "🍽️", n: newName.trim() }]);
    setNewEmoji("");
    setNewName("");
  };

  const removeItem = (idx) => setLocalItems((prev) => prev.filter((_, i) => i !== idx));

  const updateName = (idx, val) =>
    setLocalItems((prev) => prev.map((item, i) => (i === idx ? { ...item, n: val } : item)));

  return (
    <div style={s.card}>
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={s.emoji}>{meal.icon || "🌅"}</span>
          <div>
            <div style={s.mealName}>{meal.name || meal.mealType}</div>
            <div style={s.mealTime}>{meal.time || "-"}</div>
          </div>
        </div>
        <button style={s.delMealBtn} onClick={() => onDelete(meal._id)}>🗑 Delete</button>
      </div>

      <div style={s.itemsList}>
        {localItems.map((item, i) => (
          <div key={i} style={s.itemRow}>
            <span style={s.itemEmoji}>{item.i}</span>
            <input
              style={s.itemInput}
              value={item.n}
              onChange={(e) => updateName(i, e.target.value)}
            />
            <button style={s.delBtn} onClick={() => removeItem(i)}>✕</button>
          </div>
        ))}
      </div>

      <div style={s.addRow}>
        <input
          style={{ ...s.addInput, width: 72, flexShrink: 0 }}
          placeholder="Emoji"
          value={newEmoji}
          onChange={(e) => setNewEmoji(e.target.value)}
        />
        <input
          style={{ ...s.addInput, flex: 1 }}
          placeholder="Item name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <button style={s.addBtn} onClick={addItem}>+ Add</button>
      </div>

      <button style={s.saveBtn} onClick={() => onSave(meal._id, localItems)}>
        💾 Save {meal.name}
      </button>
    </div>
  );
}

export default function MealItemsPage({ showToast }) {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await fetch(`${API_URL}/meals`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setMeals(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async (id, items) => {
    try {
      const res = await fetch(`${API_URL}/meals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items }),
      });
      if (res.ok) {
        setMeals((prev) => prev.map((m) => (m._id === id ? { ...m, items } : m)));
        showToast(`✅ Meal updated!`);
      } else {
        showToast("❌ Error updating meal", "#dc2626");
      }
    } catch (err) {
      console.log(err);
      showToast("❌ Server error", "#dc2626");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;
    try {
      const res = await fetch(`${API_URL}/meals/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMeals((prev) => prev.filter((m) => m._id !== id));
        showToast("🗑️ Meal deleted!", "#9a3412");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createMeal = async (type) => {
    const meta = {
      breakfast: { name: "Breakfast", icon: "🌅", time: "7:00 – 9:00 AM", deadline: "10:00 PM prev day" },
      lunch: { name: "Lunch", icon: "☀️", time: "12:30 – 2:30 PM", deadline: "10:00 AM today" },
      dinner: { name: "Dinner", icon: "🌙", time: "7:30 – 9:30 PM", deadline: "5:00 PM today" },
    };

    try {
      const res = await fetch(`${API_URL}/meals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          mealType: type,
          date: new Date().toISOString().split('T')[0],
          name: meta[type].name,
          icon: meta[type].icon,
          time: meta[type].time,
          deadline: meta[type].deadline,
          items: []
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMeals((prev) => [...prev, data.data || data]);
        showToast(`✅ ${meta[type].name} added!`);
      } else {
        showToast(data.message || "❌ Error adding meal", "#dc2626");
      }
    } catch (err) {
      console.log(err);
      showToast("❌ Server error", "#dc2626");
    }
  };

  return (
    <div>
      <div style={s.title}>Meal Items</div>
      <div style={s.sub}>Add or remove items from each meal</div>

      <div style={s.addMealRow}>
        <button style={s.addMealBtn} onClick={() => createMeal("breakfast")}>+ Add Breakfast</button>
        <button style={s.addMealBtn} onClick={() => createMeal("lunch")}>+ Add Lunch</button>
        <button style={s.addMealBtn} onClick={() => createMeal("dinner")}>+ Add Dinner</button>
      </div>

      {meals.length === 0 ? (
        <div style={s.emptyState}>No meals added yet. Please add a meal above.</div>
      ) : (
        <div style={s.grid}>
          {meals.map((meal) => (
            <MealCard
              key={meal._id}
              meal={meal}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  title: { fontSize: 22, fontWeight: 900, color: "#064e3b", marginBottom: 4 },
  sub: { fontSize: 13, color: "#9ca3af", marginBottom: 16 },
  addMealRow: { display: "flex", gap: 10, marginBottom: 20 },
  addMealBtn: {
    padding: "8px 16px", borderRadius: 10, border: "1.5px solid #d1fae5",
    background: "#f0fdf4", color: "#065f46", fontSize: 13, fontWeight: 700,
    cursor: "pointer", fontFamily: "'Nunito','Segoe UI',sans-serif",
  },
  emptyState: {
    textAlign: "center", padding: "40px 20px", background: "#fff",
    borderRadius: 18, border: "1.5px dashed #e5e7eb", color: "#9ca3af",
    fontWeight: 600, fontSize: 14,
  },
  grid: { display: "flex", flexDirection: "column", gap: 16 },
  card: { background: "#fff", borderRadius: 18, padding: 20, border: "1.5px solid #e5e7eb" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 },
  emoji: { fontSize: 22 },
  mealName: { fontSize: 16, fontWeight: 800, color: "#111827", textTransform: "capitalize" },
  mealTime: { fontSize: 12, color: "#9ca3af" },
  itemsList: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 },
  itemRow: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", background: "#f8fafb",
    borderRadius: 10, border: "1px solid #f3f4f6",
  },
  itemEmoji: { fontSize: 18 },
  itemInput: {
    flex: 1, border: "none", background: "transparent",
    fontSize: 14, fontWeight: 700,
    fontFamily: "'Nunito','Segoe UI',sans-serif",
    color: "#111827", outline: "none",
  },
  delBtn: {
    width: 28, height: 28, borderRadius: 8,
    border: "1.5px solid #fee2e2", background: "#fff5f5",
    color: "#dc2626", fontSize: 13, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, flexShrink: 0,
  },
  addRow: { display: "flex", gap: 8, marginBottom: 12 },
  addInput: {
    padding: "9px 13px", borderRadius: 10,
    border: "1.5px solid #e5e7eb", fontSize: 13,
    fontFamily: "'Nunito','Segoe UI',sans-serif",
    color: "#111827", outline: "none",
  },
  addBtn: {
    padding: "9px 16px", borderRadius: 10, border: "none",
    background: "#065f46", color: "#fff", fontSize: 13,
    fontWeight: 700, cursor: "pointer",
    fontFamily: "'Nunito','Segoe UI',sans-serif",
    whiteSpace: "nowrap",
  },
  saveBtn: {
    width: "100%", padding: 10, borderRadius: 10,
    border: "1.5px solid #d1fae5", background: "#f0fdf4",
    color: "#065f46", fontSize: 13, fontWeight: 700,
    cursor: "pointer", fontFamily: "'Nunito','Segoe UI',sans-serif",
  },
  delMealBtn: {
    padding: "6px 12px", borderRadius: 8, border: "1.5px solid #fee2e2",
    background: "#fff5f5", color: "#dc2626", fontSize: 12, fontWeight: 700,
    cursor: "pointer", fontFamily: "'Nunito','Segoe UI',sans-serif",
  },
};
