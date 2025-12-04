🏃🎧 RunRhythm

RunRhythm is a React-based running & music discovery app that helps users track runs, record mood, and find Spotify playlists matched to their pace and emotion.
It integrates a custom Node/Express backend, user authentication, run tracking, and Spotify PKCE OAuth to power in-browser music playback.

🚀 Features
👤 User Accounts

Register and log in with local authentication

Secure password hashing & token storage

Personalized dashboard

🏃 Run Tracking

Log time, distance,  and mood

Automatic pace calculation

Run history saved to profile

Track your mood patterns over time

🎵 Spotify Integration

Secure PKCE OAuth (no client secret on frontend)

Connect Spotify account to enable:

Playlist filtering by mood and pace

Playlist previews

Saved "favorite" playlists

Web Playback SDK for real audio playback inside the browser

📊 Dashboard

Displays last run, mood, and recommended playlists

Personalized playlist suggestions

Trainer/mentor view (optional)

🖥️ Local Development Setup
1. Clone the repositories
git clone https://github.com/idrise4112/runrhythm-vite
git clone https://github.com/idrise4112/runrhythm-backend

📦 Frontend Setup (Vite + React)
Install dependencies:
cd runrhythm-vite
npm install

Important: You must run Vite with host enabled:
npm run dev -- --host


This exposes the dev server to Spotify OAuth redirects (Spotify refuses localhost IPs without host mode).

🛠️ Backend Setup (Node + Express)
cd runrhythm-backend
npm install
npm run dev

🔐 Spotify Developer Access Required

Because RunRhythm uses Spotify’s Web Playback SDK and private API scopes, your Spotify account must be added to the app's developer access list.

Currently, the dashboard includes:

Devin Jagurnauth (Tutor)

If you would like access:

➡️ You can provide your email.

Without being added, Spotify will return:

INVALID_CLIENT: you are not authorized to use this app

🌱 Environment Variables
Frontend (.env)
VITE_BACKEND_URL=http://localhost:5001
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/spotify/callback

Backend (.env)
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/spotify/callback
JWT_SECRET=your_secret

🔗 Project Links
Frontend Pull Request

🔗 https://github.com/idrise4112/runrhythm-vite/pull/1

Backend Repository

🔗 https://github.com/idrise4112/runrhythm-backend

🤝 Contributing

