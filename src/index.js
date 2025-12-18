import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// 🔍 Debug log to verify .env variables
console.log("Test", import.meta.env.VITE_APP_NAME)
console.log('test')
// console.log("ENV CLIENT_ID:", process.env.REACT_APP_SPOTIFY_CLIENT_ID);
// console.log("ENV CLIENT_SECRET:", process.env.REACT_APP_SPOTIFY_CLIENT_SECRET);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
