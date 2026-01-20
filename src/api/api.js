const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

import { checkResponse } from "./apiClient"; 

export function loginUser(credentials) {
  return fetch(`${BACKEND}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify(credentials),
  })
    .then(checkResponse)
    .catch(err => {
      console.error("loginUser error", err);
      throw err;
    });
}

export function registerUser(payload) {
  return fetch(`${BACKEND}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(checkResponse)
    .catch(err => {
      console.error("registerUser error", err);
      throw err;
    });
}

export function fetchSpotifyPlaylists(accessToken, mood, pace) {
  return fetch(
    `${SPOTIFY_API_BASE}/users/31fzmb2ywdcajbwwfxxfsv77qij4/playlists`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
    .then(checkResponse)
    .then(json => {
      console.log("Spotify /me/playlists raw JSON:", json);
      return json.items || [];
    })
    .catch(err => {
      console.error("fetchSpotifyPlaylists error", err);
      throw err;
    });
}

export function exchangeCodeForToken(code, code_verifier) {
  console.log(code);
  return fetch(`${BACKEND}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, code_verifier }),
  })
    .then(checkResponse)
    .catch(err => {
      console.error("exchangeCodeForToken error", err);
      throw err;
    });
}

export function refreshSpotifyToken(refresh_token) {
  return fetch(`${BACKEND}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  })
    .then(checkResponse)
    .catch(err => {
      console.error("refreshSpotifyToken error", err);
      throw err;
    });
}