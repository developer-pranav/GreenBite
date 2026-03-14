import { useState } from "react";
import API_URL from "../../api.js";

export default function CreateUserPage() {

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    room: "",
    role: "student",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMsg("");

    try {

      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ IMPORTANT for JWT cookie
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Error");
        return;
      }

      setMsg("User created ✅");

      setForm({
        fullName: "",
        email: "",
        password: "",
        room: "",
        role: "student",
      });

    } catch (err) {
      console.log(err);
      setMsg("Server error");
    }
  };

  return (
    <div style={s.container}>
      <div style={s.title}>Create User</div>

      <form onSubmit={handleSubmit} style={s.form}>

        <input
          name="fullName"
          placeholder="Name"
          value={form.fullName}
          onChange={handleChange}
          style={s.input}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={s.input}
        />

        <input
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={s.input}
        />

        <input
          name="room"
          placeholder="Room"
          value={form.room}
          onChange={handleChange}
          style={s.input}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={s.input}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={s.btn}>
          Create User
        </button>

        {msg && <div>{msg}</div>}

      </form>
    </div>
  );
}

const s = {
  container: { maxWidth: 500, margin: "0 auto", padding: 20 },
  title: { fontSize: 22, fontWeight: 900, marginBottom: 20 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ccc" },
  btn: {
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "green",
    color: "white",
  },
};
