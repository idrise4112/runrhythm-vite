// src/utils/spotifyAuth.jsx
import React, { useEffect } from "react";
import { exchangeCodeForToken, refreshSpotifyToken } from "../api/api";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

/* -----------------------------------------------------------
   PKCE UTILITIES
----------------------------------------------------------- */
function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sha256(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
}

export function generateCodeVerifier() {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

export async function generateCodeChallenge(verifier) {
  return sha256(verifier);
}

/* -----------------------------------------------------------
   REDIRECT TO SPOTIFY LOGIN (correct PKCE)
----------------------------------------------------------- */
export async function redirectToSpotifyLogin() {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "streaming",
    "user-read-playback-state",
    "user-modify-playback-state",
  ].join(" ");

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem("code_verifier", codeVerifier);

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("scope", scopes);
  authUrl.searchParams.append("code_challenge_method", "S256");
  authUrl.searchParams.append("code_challenge", codeChallenge);

  window.location.href = authUrl.toString();
}


/* -----------------------------------------------------------
   GET TOKEN (with automatic refresh)
----------------------------------------------------------- */
export async function getSpotifyToken() {
  const accessToken = localStorage.getItem("spotify_access_token");
  const expiry = parseInt(localStorage.getItem("spotify_token_expiry"), 10);
  const storedRefreshToken = localStorage.getItem("spotify_refresh_token");

  if (accessToken && expiry && Date.now() < expiry) {
    return accessToken;
  }

  if (!storedRefreshToken) return null;

  try {
    const refreshData = await refreshSpotifyToken(storedRefreshToken);
    if (!refreshData.access_token) return null;

    const newExpiry = Date.now() + (refreshData.expires_in - 30) * 1000;

    localStorage.setItem("spotify_access_token", refreshData.access_token);
    localStorage.setItem("spotify_token_expiry", newExpiry);

    if (refreshData.refresh_token) {
      localStorage.setItem("spotify_refresh_token", refreshData.refresh_token);
    }

    return refreshData.access_token;
  } catch (err) {
    console.error("Token refresh failed:", err);
    return null;
  }
}

/* -----------------------------------------------------------
   CALLBACK COMPONENT
----------------------------------------------------------- */
export function SpotifyCallback() {
  useEffect(() => {
    async function processCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const verifier = localStorage.getItem("code_verifier");

      if (!code || !verifier) {
        console.error("Missing code or verifier");
        window.location.href = "/";
        return;
      }

      try {
        const data = await exchangeCodeForToken(code, verifier);

        if (!data.access_token) {
          console.error("Token exchange failed");
          window.location.href = "/";
          return;
        }

        localStorage.setItem("spotify_access_token", data.access_token);

        if (data.refresh_token) {
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
        }

        const expiresAt =
          Date.now() + data.expires_in * 1000 - 30000;

        localStorage.setItem("spotify_token_expiry", expiresAt);
        localStorage.removeItem("code_verifier");

        window.location.href = "/profile";
      } catch (err) {
        console.error("Callback error:", err);
        window.location.href = "/";
      }
    }

    processCallback();
  }, []);

  return <p>Connecting to Spotify…</p>;
}
