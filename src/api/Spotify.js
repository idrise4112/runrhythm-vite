import axios from "axios";

const BASE_URL = "https://api.spotify.com/v1";
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

console.log("CLIENT_ID:", CLIENT_ID);

function getSpotifyToken() {
  const envToken = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  const localToken = localStorage.getItem("spotifyAccessToken");
  const expiry = localStorage.getItem("spotifyTokenExpiry");

  console.log("envToken:", envToken);
  console.log("localToken:", localToken);
  console.log("expiry:", expiry);

  if (expiry && Date.now() > parseInt(expiry, 10)) {
    console.warn("Spotify token expired");
    return null;
  }

  return localToken || envToken || null;
}

export async function fetchPlaylists(query) {
  try {
    const token = getSpotifyToken();

    if (!token) {
      throw new Error("Missing or expired Spotify access token");
    }

    const response = await axios.get(`${BASE_URL}/search`, {
      headers: {
        Authorization: `Bearer BQDq0yuXdoxvGZYw394nckfmRg8OWHRyjtMw4hXntw6VkNcvXSIiD3q9TPMGu9BvFkOrfP9uDZ0AQKWCr2JxRPvto-2kzP4koXWVRLflrVhwBQUP0Lh1F1DM8h8Pcmc9-f5BSELpfrY`,
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