import { NavLink } from "react-router-dom";
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <span role="img" aria-label="golf">⛳️</span> Little Alliance Golf Club
      </div>
      <nav className="nav">
        <NavLink to="/" end className="nav-link">Home</NavLink>
        <NavLink to="/about" className="nav-link">About</NavLink>
        <NavLink to="/events" className="nav-link">Events</NavLink>
        <NavLink to="/contact" className="nav-link">Contact</NavLink>
      </nav>
    </header>
  );
}

export default Header;
