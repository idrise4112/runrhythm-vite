import React from "react";
import "../footer/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__text">
        © {new Date().getFullYear()} RunRhythm. Built for runners & music lovers.
      </p>
      <a
        className="footer__link"
        href="https://github.com/idrise4112/runrhythm-vite"
        target="_blank"
        rel="noreferrer"
      >
        View source on GitHub
      </a>
    </footer>
  );
}
