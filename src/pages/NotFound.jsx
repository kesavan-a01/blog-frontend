import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="empty-state fade-in">
      <p className="eyebrow">404</p>
      <h1>This page fell out of the margin.</h1>
      <Link to="/" className="btn btn-primary">Back to the index</Link>
    </div>
  );
}
