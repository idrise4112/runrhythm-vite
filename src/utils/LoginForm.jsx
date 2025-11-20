import { useState } from "react";
import { loginUser } from "./auth";
import { useNavigate } from "react-router-dom";

export default function LoginForm({setIsLoggedIn}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (loginUser(username, password)) {
      localStorage.setItem("loggedInUser", username);
      setIsLoggedIn(true);
      navigate("/profile");

    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Log In</button>
      {error && <p>{error}</p>}
    </form>
  );
}
