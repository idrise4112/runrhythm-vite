import { useEffect } from "react";
import {getValidToken} from "../api/TokenManager";

export default function SpotifyPlayer() {
  useEffect(() => {
   
    if (window.spotifySDKLoaded) return;
    window.spotifySDKLoaded = true;

    
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = getValidToken()
      console.log(token);
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

   
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    
  }, []);

  return null;
}
