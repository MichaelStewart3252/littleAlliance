import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../api/auth";
import "./Register.css";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const data = await register({ name, email, password });
    if (data.message === "User created") {
      setSuccess("Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(data.message || "Registration failed");
    }
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label className="register-label" htmlFor="register-name">Name</label>
        <input
          id="register-name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
          type="text"
          className="register-input"
          required
        />
        <label className="register-label" htmlFor="register-email">Email</label>
        <input
          id="register-email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          type="email"
          className="register-input"
          required
        />
        <label className="register-label" htmlFor="register-password">Password</label>
        <input
          id="register-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
          type="password"
          className="register-input"
          required
        />
        <button type="submit" className="register-button">Register</button>
      </form>
      {error && <div className="register-error">{error}</div>}
      {success && <div className="register-success">{success}</div>}
      <div className="register-login-link">
        Already have an account? <Link to="/login">Sign in here</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
