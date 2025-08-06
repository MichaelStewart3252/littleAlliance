// src/Footer.js
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} DMV Alliance Club. All rights reserved.</p>
      <p>
        <span role="img" aria-label="golf">⛳️</span> Tee up your next adventure!
      </p>
    </footer>
  );
}

export default Footer;
