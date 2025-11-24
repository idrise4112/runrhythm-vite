
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback({ setIsLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    const codeVerifier = localStorage.getItem("code_verifier");

    if (code && codeVerifier) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, code_verifier: codeVerifier }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            localStorage.setItem("spotifyAccessToken", data.access_token);

            if (data.refresh_token) {
              localStorage.setItem("spotifyRefreshToken", data.refresh_token);
            }

            localStorage.setItem(
              "spotifyTokenExpiry",
              Date.now() + (data.expires_in - 30) * 1000
            );

            setIsLoggedIn(true);
            navigate("/profile");
          } else {
            console.error("Token exchange failed:", data);
          }
        })
        .catch((err) => console.error("Error exchanging token:", err));
    } else {
      console.error("Missing code or code_verifier");
    }
  }, [navigate, setIsLoggedIn]);

  return <p>Logging you in with Spotify...</p>;
}