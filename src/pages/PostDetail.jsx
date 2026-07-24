import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import CommentSection from "../components/CommentSection.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await client.get(`/posts/${id}`);
        setPost(data.post);
      } catch {
        setError("This entry could not be found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this entry permanently?")) return;
    try {
      await client.delete(`/posts/${id}`);
      navigate("/");
    } catch {
      // ignore
    }
  };

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;
  if (error || !post) return <div className="empty-state"><p>{error}</p></div>;

  const isOwner = user && post.author?._id === user.id;

  return (
    <article className="post-detail fade-in">
      <div className="post-detail-cover" style={{ background: post.coverColor }} />
      <div className="post-detail-header">
        {post.tags?.length > 0 && (
          <div className="tag-row">
            {post.tags.map((t) => <span className="tag-pill" key={t}>#{t}</span>)}
          </div>
        )}
        <h1>{post.title}</h1>
        <div className="post-detail-meta">
          <span className="avatar-chip" style={{ background: post.author?.avatarColor }}>
            {post.author?.username?.[0]?.toUpperCase() || "?"}
          </span>
          <div>
            <strong>{post.author?.username}</strong>
            <p>{formatDate(post.createdAt)}</p>
          </div>
        </div>
        {isOwner && (
          <div className="owner-actions">
            <Link to={`/posts/${id}/edit`} className="btn btn-outline">Edit</Link>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>

      <div className="post-detail-content">
        {post.content.split(/\n{2,}/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <CommentSection postId={id} />
    </article>
  );
}
