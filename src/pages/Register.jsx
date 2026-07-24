import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <p className="eyebrow">First entry</p>
        <h1>Create your account</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input type="text" name="username" required minLength={3} maxLength={24} value={form.username} onChange={handleChange} />
          </label>
          <label>
            Email
            <input type="email" name="email" required value={form.email} onChange={handleChange} />
          </label>
          <label>
            Password
            <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
