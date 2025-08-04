import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Events from "./pages/Event/Event";
import Sidebar from "./components/Sidebar/Sidebar"; // <-- New!

function App() {
  return (
    <div className="app-root">
      <Router>
        <Header />
        <div className="layout">
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Sidebar />
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
