import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import { fileToBanner169 } from "../utils/image";

export default function EditPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [coverImage, setCoverImage] = useState("");
  const [imageError, setImageError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await client.get(`/posts/${id}`);
        if (user && data.post.author?._id !== user.id) {
          navigate(`/posts/${id}`);
          return;
        }
        setForm({
          title: data.post.title,
          content: data.post.content,
          tags: (data.post.tags || []).join(", "),
        });
        setCoverImage(data.post.coverImage || "");
      } catch {
        setError("Could not load this entry.");
      } finally {
        setFetching(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError("");
    try {
      const dataUrl = await fileToBanner169(file);
      setCoverImage(dataUrl);
    } catch (err) {
      setImageError(err.message || "Could not process image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      await client.put(`/posts/${id}`, { ...form, tags, coverImage });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update entry");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loader-wrap"><div className="loader" /></div>;

  return (
    <div className="editor-page fade-in">
      <p className="eyebrow">Editing</p>
      <h1>Revise your entry</h1>
      <form className="editor-form" onSubmit={handleSubmit}>
        <label>
          Card banner <span className="label-hint">(16:9 image, optional)</span>
          <div className="banner-upload">
            {coverImage ? (
              <div className="banner-preview">
                <img src={coverImage} alt="Cover preview" />
                <button type="button" className="btn btn-outline banner-remove" onClick={() => setCoverImage("")}>
                  Remove image
                </button>
              </div>
            ) : (
              <label className="banner-dropzone">
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                <span>Click to upload a 16:9 banner image</span>
              </label>
            )}
          </div>
          {imageError && <p className="form-error">{imageError}</p>}
        </label>
        <label>
          Title
          <input type="text" name="title" required maxLength={140} value={form.title} onChange={handleChange} />
        </label>
        <label>
          Content
          <textarea name="content" required rows={12} value={form.content} onChange={handleChange} />
        </label>
        <label>
          Tags <span className="label-hint">(comma separated)</span>
          <input type="text" name="tags" value={form.tags} onChange={handleChange} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <div className="editor-actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}



// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import client from "../api/client";
// import { useAuth } from "../context/AuthContext.jsx";

// export default function EditPost() {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ title: "", content: "", tags: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const { data } = await client.get(`/posts/${id}`);
//         if (user && data.post.author?._id !== user.id) {
//           navigate(`/posts/${id}`);
//           return;
//         }
//         setForm({
//           title: data.post.title,
//           content: data.post.content,
//           tags: (data.post.tags || []).join(", "),
//         });
//       } catch {
//         setError("Could not load this entry.");
//       } finally {
//         setFetching(false);
//       }
//     };
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
//       await client.put(`/posts/${id}`, { ...form, tags });
//       navigate(`/posts/${id}`);
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not update entry");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) return <div className="loader-wrap"><div className="loader" /></div>;

//   return (
//     <div className="editor-page fade-in">
//       <p className="eyebrow">Editing</p>
//       <h1>Revise your entry</h1>
//       <form className="editor-form" onSubmit={handleSubmit}>
//         <label>
//           Title
//           <input type="text" name="title" required maxLength={140} value={form.title} onChange={handleChange} />
//         </label>
//         <label>
//           Content
//           <textarea name="content" required rows={12} value={form.content} onChange={handleChange} />
//         </label>
//         <label>
//           Tags <span className="label-hint">(comma separated)</span>
//           <input type="text" name="tags" value={form.tags} onChange={handleChange} />
//         </label>
//         {error && <p className="form-error">{error}</p>}
//         <div className="editor-actions">
//           <button className="btn btn-primary" type="submit" disabled={loading}>
//             {loading ? "Saving…" : "Save changes"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
