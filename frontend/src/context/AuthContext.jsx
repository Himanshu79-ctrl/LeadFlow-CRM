
import { createContext, useContext, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  async function login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { access, refresh, user } = response.data.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
    return user;
  }

  async function register(name, email, password, confirmPassword) {
    return api.post("/auth/register", {
      name,
      email,
      password,
      confirm_password: confirmPassword,
    });
  }

const logout = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  try {
    if (refreshToken) {
      await api.post("/auth/logout", {
        refresh: refreshToken,
      });
    }
  } catch (error) {
    console.error("Logout API failed:", error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  }
};

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
