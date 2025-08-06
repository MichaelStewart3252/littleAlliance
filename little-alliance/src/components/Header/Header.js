import { NavLink } from "react-router-dom";
import './Header.css';

function Header({ user, onSignOut }) {
  return (
    <header className="header">
      <div className="logo">
        <span role="img" aria-label="golf">⛳️</span> DMV Alliance Club
      </div>
      <nav className="nav">
        <div className="nav-links">
          <NavLink to="/" end className="nav-link">Home</NavLink>
          <NavLink to="/about" className="nav-link">About</NavLink>
          <NavLink to="/events" className="nav-link">Events</NavLink>
          <NavLink to="/contact" className="nav-link">Contact</NavLink>
          {user && user.isAdmin && (
            <NavLink to="/admin" className="nav-link">Admin</NavLink>
          )}
        </div>
        <div className="nav-auth">
          {user ? (
            <>
              <button className="nav-link" onClick={onSignOut}>Sign Out</button>
            </>
          ) : (
            <NavLink to="/login" className="nav-link">Sign In</NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
