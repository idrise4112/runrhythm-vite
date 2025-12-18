import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser, getToken } from "./auth"; 

const AuthContext = createContext();

export function AuthProvider({ children }) {
 
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

  
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  
  const signup = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  
  const login = async (email, password) => {
    console.log("hello")
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

  
  const spotifyLogin = (spotifyToken, spotifyUser) => {
    localStorage.setItem("spotify_access_token", spotifyToken);
    setUser({ spotify: true, ...spotifyUser });
    setToken(spotifyToken);
  };

  
  const logout = () => {
    logoutUser();
    localStorage.removeItem("spotify_access_token");
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
