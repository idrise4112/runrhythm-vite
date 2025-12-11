import { Link, useNavigate } from "react-router-dom";
import "./MainNavbar.css";
import { useAuth } from "../utils/AuthContext";


import logo from "/logo192.png"

export default function MainNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSpotifyLogin = async () => {
    const generateRandomString = (length) => {
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const values = crypto.getRandomValues(new Uint8Array(length));
      return values.reduce(
        (acc, x) => acc + possible[x % possible.length],
        ""
      );
    };

    const sha256 = async (plain) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      return window.crypto.subtle.digest("SHA-256", data);
    };

    const base64encode = (input) => {
      return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    };

    const codeVerifier = generateRandomString(64);
    localStorage.setItem("code_verifier", codeVerifier);

    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.PROD
  ? "https://runrhythm.mooo.com/callback"
  // : "http://localhost:5173/callback"; 
  :"http://127.0.0.1:3000/callback";

    const scope =
      "user-read-private user-read-email streaming user-modify-playback-state user-read-playback-state playlist-read-private playlist-read-collaborative";

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    const params = {
      response_type: "code",
      client_id: clientId,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="navbar__logo">
        <img src={logo} alt="RunRhythm Logo" className="navbar__logo-img" />
        <span className="navbar__logo-text">RunRhythm</span>
      </div>

      {/* LINKS */}
      <ul className="navbar__links">
        <li>
          <Link className="navbar__link" to="/">
            Home
          </Link>
        </li>

        {user ? (
          <>
            <li>
              <Link className="navbar__link" to="/playlists">
                Playlists
              </Link>
            </li>
            <li>
              <Link className="navbar__link" to="/tracker">
                Tracker
              </Link>
            </li>
            <li>
              <Link className="navbar__link" to="/profile">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="navbar__logout-btn"
              >
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link className="navbar__link" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="navbar__link" to="/register">
                Sign Up
              </Link>
            </li>
            <li>
              <button
                onClick={handleSpotifyLogin}
                className="navbar__spotify-btn"
              >
                Connect to Spotify
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
