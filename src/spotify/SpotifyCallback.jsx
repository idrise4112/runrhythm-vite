import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api/apiClient"; // <-- import your helper

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
        // 🔄 Use request() instead of raw fetch
        const data = await request("/auth/token", {
          method: "POST",
          body: JSON.stringify({
            code,
            code_verifier: codeVerifier,
          }),
        });

        console.log("Spotify token response →", data);

        if (!data.access_token) {
          console.error(" No access_token in response");
          return navigate("/");
        }

        localStorage.setItem("spotify_access_token", data.access_token);

        if (data.refresh_token) {
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
        }

        const expiresAt = Date.now() + (data.expires_in - 30) * 1000;
        localStorage.setItem("spotify_token_expiry", expiresAt);

        localStorage.removeItem("code_verifier");

        navigate("/");
      } catch (err) {
        console.error(" Error during Spotify auth:", err.message);
        navigate("/");
      }
    }

    handleSpotifyAuth();
  }, [navigate]);

  return <p>Connecting you to Spotify…</p>;
}