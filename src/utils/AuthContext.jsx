import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser, getToken } from "./auth"; // registerUser is called from SignupForm

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Safe user load from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser || savedUser === "undefined") {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (err) {
      console.warn("Invalid user JSON in localStorage, clearing it.");
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(getToken());

  // Sync user to localStorage safely
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // ✅ Signup (Option A) — already handled by SignupForm
  const signup = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  // Login
  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  // Spotify login
  const spotifyLogin = (spotifyToken, spotifyUser) => {
    localStorage.setItem("spotifyAccessToken", spotifyToken);
    setUser({ spotify: true, ...spotifyUser });
    setToken(spotifyToken);
  };

  // Logout
  const logout = () => {
    logoutUser();
    localStorage.removeItem("spotifyAccessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, signup, login, spotifyLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
