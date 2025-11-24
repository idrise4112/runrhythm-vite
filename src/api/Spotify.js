import axios from "axios";
import { getValidToken } from "./tokenManager"; // ✅ use the helper we built

const BASE_URL = "https://api.spotify.com/v1";
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

console.log("CLIENT_ID:", CLIENT_ID);

// Fetch playlists by search query
export async function fetchPlaylists(query) {
  try {
    // Get a valid token (either from localStorage or refreshed via backend)
    const token = await getValidToken();

    if (!token) {
      throw new Error("Missing or expired Spotify access token");
    }

    const response = await axios.get(`${BASE_URL}/search`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ dynamic token
      },
      params: {
        q: query,
        type: "playlist",
        limit: 10,
      },
    });

    return response.data.playlists.items;
  } catch (error) {
    console.error("Spotify API error:", error.response?.data || error.message);
    return [];
  }
}