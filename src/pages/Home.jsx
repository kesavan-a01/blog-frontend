import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import PostCard from "../components/PostCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchPosts = async (q = "", p = 1) => {
    setLoading(true);
    try {
      const { data } = await client.get("/posts", { params: { search: q || undefined, page: p } });
      setPosts(data.posts);
      setPages(data.pages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts(search, 1);
  };

  const goToPage = (p) => {
    setPage(p);
    fetchPosts(search, p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="home-page fade-in">
      <section className="hero">
        <p className="eyebrow">Vol. I — a full-stack journal</p>
        <h1>
          Write it. <span className="ink-underline">Publish it.</span> Talk it over
          <span className="cursor-blink">.</span>
        </h1>
        <p className="hero-sub">
          Marginalia is a small blogging platform for posting your thinking and
          collecting the notes readers leave in the margins.
        </p>
        <div className="hero-actions">
          <Link to={user ? "/new" : "/register"} className="btn btn-primary btn-lg">
            {user ? "Start a new entry" : "Join & start writing"}
          </Link>
          <a href="#entries" className="btn btn-outline btn-lg">Browse entries</a>
        </div>
      </section>

      <section id="entries" className="entries-section">
        <div className="entries-header">
          <h2>Latest entries</h2>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search titles, tags, content…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-ghost">Search</button>
          </form>
        </div>

        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>No entries yet. The page is blank — someone has to write the first line.</p>
            {user && <Link to="/new" className="btn btn-primary">Write the first entry</Link>}
          </div>
        ) : (
          <>
            <div className="post-grid">
              {posts.map((p, i) => (
                <PostCard post={p} index={i} key={p._id} />
              ))}
            </div>
            {pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`page-btn ${p === page ? "active" : ""}`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
