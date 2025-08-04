import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Announcements</h3>
      <ul>
        <li>⛳️ Club Championship: June 15th!</li>
        <li>🏌️‍♂️ Junior Golf Camp registration open</li>
        <li>🌦️ Weather update: Course open, carts restricted</li>
      </ul>
      <h3>Quick Links</h3>
      <ul>
        <li><a href="/courses">Course Info</a></li>
        <li><a href="/events">Events</a></li>
        <li><a href="/contact">Contact Us</a></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
