import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Events from "./pages/Event/Event";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./pages/Login/Login";
import Admin from "./pages/Admin/Admin";
import Register from "./pages/Register/Register";
import AdminRoute from "./components/AdminRoute";

function App() {
  const [user, setUser] = useState(null);

  // Restore user from localStorage on first load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function handleSignIn(user) {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token);
  }

  function handleSignOut() {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return (
    <div className="app-root">
      <Router>
        <Header user={user} onSignOut={handleSignOut} />
        <div className="layout">
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events user={user} />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login onSignIn={handleSignIn} />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute user={user}>
                    <Admin user={user} />
                  </AdminRoute>
                }
              />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Sidebar user={user} />
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
