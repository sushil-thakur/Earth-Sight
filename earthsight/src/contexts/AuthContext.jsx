import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ensure axios base points to backend
axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if session is expired (5 minutes)
  const isSessionExpired = () => {
    const loginTime = localStorage.getItem("loginTime");
    if (!loginTime) return true;

    const now = new Date().getTime();
    const elapsed = now - parseInt(loginTime);
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    return elapsed > fiveMinutes;
  };

  // Auto logout when session expires
  useEffect(() => {
    const checkSession = () => {
      if (user && isSessionExpired()) {
        console.log("Session expired - logging out");
        logout();
        alert("Your session has expired. Please login again.");
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Check if session expired
      if (isSessionExpired()) {
        console.log("Session expired on load");
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
        localStorage.removeItem("loginTime");
        setUser(null);
        setLoading(false);
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("/api/auth/profile")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          delete axios.defaults.headers.common["Authorization"];
          localStorage.removeItem("token");
          localStorage.removeItem("loginTime");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      if (res.data?.token) {
        const token = res.data.token;
        const loginTime = new Date().getTime().toString();

        // Use localStorage for persistence across navigation
        localStorage.setItem("token", token);
        localStorage.setItem("loginTime", loginTime);

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(res.data.user);

        console.log("Login successful - session will expire in 5 minutes");
      }
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Login error", err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || err.message,
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post("/api/auth/register", userData);
      if (res.data?.token) {
        const token = res.data.token;
        const loginTime = new Date().getTime().toString();

        // Use localStorage for persistence across navigation
        localStorage.setItem("token", token);
        localStorage.setItem("loginTime", loginTime);

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(res.data.user);

        console.log(
          "Registration successful - session will expire in 5 minutes"
        );
      }
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Register error", err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || err.message,
      };
    }
  };

  const logout = () => {
    console.log("Logging out user...");
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    setUser(null);

    // Redirect to home page
    window.location.href = "/";
  };

  const updateProfile = async (updates) => {
    const res = await axios.put("/api/auth/profile", updates);
    if (res.data?.user) setUser(res.data.user);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
