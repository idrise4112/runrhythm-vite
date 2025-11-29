import { getValidToken } from "./tokenManager";

const BASE_URL = "https://api.spotify.com/v1";
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

console.log("CLIENT_ID:", CLIENT_ID);


export async function fetchPlaylists(query) {
  try {
    
    const token = await getValidToken();

    if (!token) {
      throw new Error("Missing or expired Spotify access token");
    }

    const res = await fetch(
      `${BASE_URL}/search?q=${encodeURIComponent(query)}&type=playlist&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Spotify API error: ${res.status}`);
    }

    const data = await res.json();
    return data.playlists.items;
  } catch (error) {
    console.error("Spotify API error:", error.message);
    return [];
  }
}