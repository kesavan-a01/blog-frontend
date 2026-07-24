import React, { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

const timeAgo = (d) => {
  const seconds = Math.floor((Date.now() - new Date(d)) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val} ${name}${val > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await client.get(`/posts/${postId}/comments`);
      setComments(data.comments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const { data } = await client.post(`/posts/${postId}/comments`, { text });
      setComments((c) => [data.comment, ...c]);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await client.delete(`/posts/${postId}/comments/${commentId}`);
      setComments((c) => c.filter((cm) => cm._id !== commentId));
    } catch {
      // ignore
    }
  };

  return (
    <section className="comments-section">
      <h3 className="section-heading">
        Marginalia <span className="section-count">({comments.length})</span>
      </h3>

      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <span className="avatar-chip" style={{ background: user.avatarColor }}>
            {user.username[0]?.toUpperCase()}
          </span>
          <div className="comment-form-body">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Leave a note in the margin…"
              rows={2}
            />
            {error && <p className="form-error">{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Posting…" : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="muted-note">Sign in to leave a comment.</p>
      )}

      {loading ? (
        <div className="loader-wrap small"><div className="loader" /></div>
      ) : comments.length === 0 ? (
        <p className="muted-note">No comments yet — be the first to annotate.</p>
      ) : (
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c._id} className="comment-item">
              <span className="avatar-chip small" style={{ background: c.author?.avatarColor }}>
                {c.author?.username?.[0]?.toUpperCase() || "?"}
              </span>
              <div className="comment-body">
                <div className="comment-meta">
                  <strong>{c.author?.username || "Unknown"}</strong>
                  <span>{timeAgo(c.createdAt)}</span>
                </div>
                <p>{c.text}</p>
              </div>
              {user && c.author?._id === user.id && (
                <button className="link-btn danger" onClick={() => handleDelete(c._id)}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
