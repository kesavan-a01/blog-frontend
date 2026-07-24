import React from "react";
import { Link } from "react-router-dom";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function PostCard({ post, index }) {
  return (
    <Link to={`/posts/${post._id}`} className="post-card" style={{ "--i": index }}>
      <div
        className="post-card-cover"
        style={
          post.coverImage
            ? { backgroundImage: `url(${post.coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: post.coverColor }
        }
      >
        <span className="post-card-index">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="post-card-body">
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="post-card-meta">
          <span className="avatar-chip small" style={{ background: post.author?.avatarColor }}>
            {post.author?.username?.[0]?.toUpperCase() || "?"}
          </span>
          <span className="meta-author">{post.author?.username || "Unknown"}</span>
          <span className="meta-dot">·</span>
          <span>{formatDate(post.createdAt)}</span>
          <span className="meta-dot">·</span>
          <span>{post.commentCount} comment{post.commentCount === 1 ? "" : "s"}</span>
        </div>
        {post.tags?.length > 0 && (
          <div className="tag-row">
            {post.tags.slice(0, 3).map((t) => (
              <span className="tag-pill" key={t}>#{t}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}




// import React from "react";
// import { Link } from "react-router-dom";

// const formatDate = (d) =>
//   new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// export default function PostCard({ post, index }) {
//   return (
//     <Link to={`/posts/${post._id}`} className="post-card" style={{ "--i": index }}>
//       <div className="post-card-cover" style={{ background: post.coverColor }}>
//         <span className="post-card-index">{String(index + 1).padStart(2, "0")}</span>
//       </div>
//       <div className="post-card-body">
//         <h3>{post.title}</h3>
//         <p>{post.excerpt}</p>
//         <div className="post-card-meta">
//           <span className="avatar-chip small" style={{ background: post.author?.avatarColor }}>
//             {post.author?.username?.[0]?.toUpperCase() || "?"}
//           </span>
//           <span className="meta-author">{post.author?.username || "Unknown"}</span>
//           <span className="meta-dot">·</span>
//           <span>{formatDate(post.createdAt)}</span>
//           <span className="meta-dot">·</span>
//           <span>{post.commentCount} comment{post.commentCount === 1 ? "" : "s"}</span>
//         </div>
//         {post.tags?.length > 0 && (
//           <div className="tag-row">
//             {post.tags.slice(0, 3).map((t) => (
//               <span className="tag-pill" key={t}>#{t}</span>
//             ))}
//           </div>
//         )}
//       </div>
//     </Link>
//   );
// }
