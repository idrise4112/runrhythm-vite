const SERVER = import.meta.env.VITE_BACKEND_URL;

export function getStoredToken() {
  const token = localStorage.getItem("spotify_access_token");
  const expiry = parseInt(localStorage.getItem("spotify_token_expiry"), 10);

  if (!token || !expiry) return null;
  if (Date.now() >= expiry) return null; 

  return token;
}

export function hasValidToken() {
  return !!getStoredToken();
}

export async function getValidToken() {
  const token = getStoredToken();
  if (token) return token;

  const refreshToken = localStorage.getItem("spotify_refresh_token");
  if (!refreshToken) {
    console.error("No refresh token available");
    return null;
  }

  try {
    const res = await fetch(`${SERVER}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Refresh failed:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    if (!data.access_token || !data.expires_in) {
      console.error("Invalid refresh response:", data);
      return null;
    }

    const newToken = data.access_token;
    const expiryTime = Date.now() + (Number(data.expires_in) - 30) * 1000;

 
    localStorage.setItem("spotify_access_token", newToken);
    localStorage.setItem("spotify_token_expiry", expiryTime.toString());

    return newToken;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
}
