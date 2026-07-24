import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import client from "../api/client";
import PostCard from "../components/PostCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const { data } = await client.get("/posts", { params: { limit: 100 } });
        setPosts(data.posts.filter((p) => p.author?._id === user.id));
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="profile-page fade-in">
      <div className="profile-header">
        <span className="avatar-chip large" style={{ background: user.avatarColor }}>
          {user.username[0]?.toUpperCase()}
        </span>
        <div>
          <h1>{user.username}</h1>
          <p className="muted-note">{user.email}</p>
        </div>
      </div>

      <h2 className="section-heading">Your entries <span className="section-count">({posts.length})</span></h2>
      {fetching ? (
        <div className="loader-wrap"><div className="loader" /></div>
      ) : posts.length === 0 ? (
        <p className="muted-note">You haven't published anything yet.</p>
      ) : (
        <div className="post-grid">
          {posts.map((p, i) => <PostCard post={p} index={i} key={p._id} />)}
        </div>
      )}
    </div>
  );
}
