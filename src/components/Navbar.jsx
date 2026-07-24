import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">M</span>
          <span className="brand-name">Marginalia</span>
        </Link>

        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>Index</NavLink>
          {user && (
            <NavLink to="/new" onClick={() => setOpen(false)}>Write</NavLink>
          )}
          {user ? (
            <>
              <NavLink to="/profile" onClick={() => setOpen(false)}>
                <span className="avatar-chip" style={{ background: user.avatarColor }}>
                  {user.username[0]?.toUpperCase()}
                </span>
                {user.username}
              </NavLink>
              <button className="btn btn-ghost" onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setOpen(false)}>Sign in</NavLink>
              <NavLink to="/register" className="btn btn-primary nav-cta" onClick={() => setOpen(false)}>
                Join
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
