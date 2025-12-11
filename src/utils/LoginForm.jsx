import React from "react";
import { generateCodeVerifier, generateCodeChallenge } from "./PkceUtils";

export default function LoginForm({ setIsLoggedIn }) {
  async function loginWithSpotify() {
    setIsLoggedIn(true);
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const scopes = [
      "user-read-private",
      "user-read-email",
      "playlist-read-private",
      "playlist-modify-public",
      "playlist-modify-private",
      "user-read-playback-state",
        "user-modify-playback-state",


    ].join(" ");

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem("code_verifier", codeVerifier);

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("client_id", clientId);
    authUrl.searchParams.append("scope", scopes);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("code_challenge_method", "S256");
    authUrl.searchParams.append("code_challenge", codeChallenge);

    window.location.href = authUrl.toString();
  }

  return (
    <div className="login__form">
      <h2>Login to RunRhythm</h2>
      <button onClick={loginWithSpotify}>Login with Spotify</button>
    </div>
  );
}