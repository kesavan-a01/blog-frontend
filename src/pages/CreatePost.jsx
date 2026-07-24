import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const { data } = await client.post("/posts", { ...form, tags });
      navigate(`/posts/${data.post._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not publish entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-page fade-in">
      <p className="eyebrow">New entry</p>
      <h1>Write something worth annotating</h1>
      <form className="editor-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input type="text" name="title" required maxLength={140} value={form.title} onChange={handleChange} placeholder="Give it a headline…" />
        </label>
        <label>
          Content
          <textarea name="content" required rows={12} value={form.content} onChange={handleChange} placeholder="Start writing…" />
        </label>
        <label>
          Tags <span className="label-hint">(comma separated)</span>
          <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="react, mongodb, life" />
        </label>
        {error && <p className="form-error">{error}</p>}
        <div className="editor-actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Publishing…" : "Publish entry"}
          </button>
        </div>
      </form>
    </div>
  );
}
