import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/auth";
import "./Login.css";

function LoginPage({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const data = await login({ email, password });
    if (data.token) {
      localStorage.setItem("token", data.token);
      onSignIn({ email: data.email, name: data.name, isAdmin: data.isAdmin, token: data.token });
      navigate("/");
    } else {
      setError(data.message || "Login failed");
    }
  }

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          type="email"
          autoComplete="username"
          className="login-input"
        />
        <label className="login-label" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          className="login-input"
        />
        <button type="submit" className="login-button">Sign In</button>
      </form>
      {error && <div className="login-error">{error}</div>}
      <div className="login-register-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
}

export default LoginPage;
