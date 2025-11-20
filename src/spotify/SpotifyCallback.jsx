import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (window.__spotifyCallbackHandled) return;
    window.__spotifyCallbackHandled = true;

    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const token = params.get("access_token");
    const expiresIn = params.get("expires_in");

    if (token) {
      localStorage.setItem("spotifyAccessToken", token);

      if (expiresIn) {
        const expiryTime = Date.now() + parseInt(expiresIn, 10) * 1000;
        localStorage.setItem("spotifyTokenExpiry", expiryTime.toString());
      }

      navigate("/");
    } else {
      console.error("Spotify token not found in callback URL.");
    }
  }, [navigate]);

  return <p>Logging in with Spotify...</p>;
}
