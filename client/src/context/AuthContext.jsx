import { createContext, useContext, useState, useEffect } from "react";
import API_URL from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // ✅ NEW — refresh user from DB

  const refreshUser = async () => {

    try {

      const res = await fetch(
        `${API_URL}/users/me`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok && data.data) {
        setUser(data.data);
      }

    } catch (err) {
      console.log(err);
    }

  };


  // =========================
  // FETCH ME ON LOAD
  // =========================

  useEffect(() => {

    const fetchMe = async () => {

      await refreshUser();

      setLoading(false);

    };

    fetchMe();

  }, []);



  // =========================
  // LOGIN
  // =========================

  const login = async (credentials) => {

    try {

      const res = await fetch(
        `${API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(credentials),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return { error: data.message };
      }

      setUser(data.data.user);

      return {
        success: true,
        user: data.data.user,
      };

    } catch (err) {

      console.log(err);

      return { error: "Server error" };

    }

  };


  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {

    try {

      await fetch(
        `${API_URL}/users/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

    } catch (err) {
      console.log(err);
    }

    setUser(null);

  };


  return (

    <AuthContext.Provider
      value={{
        user,
        setUser,
        refreshUser,   // ✅ VERY IMPORTANT
        login,
        logout,
      }}
    >

      {!loading && children}

    </AuthContext.Provider>

  );

}

export const useAuth = () => useContext(AuthContext);
