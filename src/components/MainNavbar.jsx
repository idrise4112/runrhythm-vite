import { Link, useNavigate } from "react-router-dom";
import "./MainNavbar.css"
import logo from "../../public/logo192.png"

export default function MainNavbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="RunRhythm Logo" className="logo-img" />
        <span className="logo-text">RunRhythm</span>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>

        {isLoggedIn ? (
          <>
            <li><Link to="/playlists">Playlists</Link></li>
            <li><Link to="/tracker">Tracker</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={handleLogout} className="spotify-btn">Log Out</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Log In</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><button className="spotify-btn">Connect with Spotify</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}