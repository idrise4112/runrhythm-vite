import { Link, useNavigate } from "react-router-dom";
import "./MainNavbar.css";
import logo from "../assets/logo192.png";

export default function MainNavbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("spotifyAccessToken");
    localStorage.removeItem("spotifyRefreshToken");
    localStorage.removeItem("spotifyTokenExpiry");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleSpotifyLogin = async () => {
    // Generate PKCE code verifier & challenge
    const generateRandomString = (length) => {
      const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const values = crypto.getRandomValues(new Uint8Array(length));
      return values.reduce((acc, x) => acc + possible[x % possible.length], "");
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
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const scope = "user-read-private user-read-email streaming";

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
      <div className="logo">
        <img src={logo} alt="RunRhythm Logo" className="logo-img" />
        <span className="logo-text">RunRhythm</span>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>

        {isLoggedIn ? (
          <>
            <li><Link to="/playlists">Playlists</Link></li>
            <li><Link to="/tracker">Tracker</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={handleLogout} className="spotify-btn">Log Out</button></li>
          </>
        ) : (
          <>
            <li>
              <button onClick={handleSpotifyLogin} className="spotify-btn">
                Login with Spotify
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}