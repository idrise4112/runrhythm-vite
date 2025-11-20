import { useEffect } from "react";

export default function SpotifyPlayer() {
  useEffect(() => {
    // Prevent multiple loads (StrictMode)
    if (window.spotifySDKLoaded) return;
    window.spotifySDKLoaded = true;

    // Define callback BEFORE loading script
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = localStorage.getItem("spotifyAccessToken");
      if (!token || !window.Spotify) {
        console.error("Spotify SDK not ready or token missing");
        return;
      }

      const player = new window.Spotify.Player({
        name: "RunRhythm Player",
        getOAuthToken: cb => cb(token),
        volume: 0.8,
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Player ready, device ID:", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.warn("Player offline:", device_id);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error("Auth error:", message);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error("Initialization error:", message);
      });

      player.addListener("account_error", ({ message }) => {
        console.error("Account error:", message);
      });

      player.addListener("playback_error", ({ message }) => {
        console.error("Playback error:", message);
      });

      player.connect();
    };

    // Load the script AFTER callback is defined
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    // ❗ Do NOT delete the callback here (breaks SDK)
  }, []);

  return null;
}
