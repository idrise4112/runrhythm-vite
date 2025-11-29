import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleSpotifyAuth() {
      const code = new URLSearchParams(window.location.search).get("code");
      const codeVerifier = localStorage.getItem("code_verifier");

      if (!code) {
        console.error("❌ No 'code' found in redirect URL");
        navigate("/");
        return;
      }

      if (!codeVerifier) {
        console.error("❌ No code_verifier found in localStorage");
        navigate("/");
        return;
      }

      try {
        // ⭐ Exchange code → tokens
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code,
              code_verifier: codeVerifier,
            }),
          }
        );

        if (!response.ok) {
          console.error("❌ Token exchange failed:", response.status);
          return navigate("/");
        }

        const data = await response.json();
        console.log("Spotify token response →", data);

        if (!data.access_token) {
          console.error("❌ No access_token in response");
          return navigate("/");
        }

        // ⭐ Save tokens
        localStorage.setItem("spotify_access_token", data.access_token);

        if (data.refresh_token) {
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
        }

        // ⭐ Save expiry (with 30s buffer)
        const expiresAt = Date.now() + (data.expires_in - 30) * 1000;
        localStorage.setItem("spotify_token_expiry", expiresAt);

        // Cleanup
        localStorage.removeItem("code_verifier");

        // ⭐ Redirect back home to load playlists
        navigate("/");
      } catch (err) {
        console.error("❌ Error during Spotify auth:", err);
        navigate("/");
      }
    }

    handleSpotifyAuth();
  }, [navigate]);

  return <p>Connecting you to Spotify…</p>;
}
