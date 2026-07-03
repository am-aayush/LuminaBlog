import { useEffect, useState } from "react";
import { GlowButton, CategoryBadge } from "../components";
import {
  PlusSquare,
  Calendar,
  Eye,
  Heart,
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  FileEdit,
  FileText,
} from "lucide-react";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function StatusTag({ status }) {
  return status === "active" ? (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
      style={{
        background: "rgba(16,185,129,0.12)",
        borderColor: "rgba(16,185,129,0.25)",
        color: "#34D399",
      }}
    >
      <CheckCircle2 className="w-3 h-3" />
      Published
    </span>
  ) : (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
      style={{
        background: "rgba(245,158,11,0.12)",
        borderColor: "rgba(245,158,11,0.25)",
        color: "#FBBF24",
      }}
    >
      <FileEdit className="w-3 h-3" />
      Draft
    </span>
  );
}

function MyPosts({ setPage, setEditPostId }) {
  const [tab, setTab] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [posts, setPosts] = useState([]);
  
  const getMyPosts = async (userId) => {
    const myPosts = await appwriteService.getMyPosts(userId);
    return myPosts;
  };
  useEffect(() => {
    getMyPosts(userData.$id).then((res) => {
      setPosts(res.documents);
    });
  }, []);
  const filtered = posts.filter((p) => tab === "all" || p.status === tab);
  const userData = useSelector((state) => state.auth.userData);
  const counts = {
    all: posts.length,
    active: posts.filter((p) => p.status === "active").length,
    draft: posts.filter((p) => p.status === "draft").length,
  };

  function confirmDelete(id) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  }

  function openEdit(id) {
    setEditPostId(id);
    setPage("edit-post");
  }

  function getImage(featuredImageId) {
    if (!featuredImageId) return null;
    const imageUrl = appwriteService.getFileView(featuredImageId);
    return imageUrl;
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-bold text-slate-100"
              style={{ fontFamily: "var(--font-display)" }}
            >
              My Posts
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Manage your published articles and drafts
            </p>
          </div>
          <Link to="/add-post">
            <GlowButton className="flex items-center gap-2 cursor-pointer">
              <PlusSquare className="w-4 h-4" />
              New Post
            </GlowButton>
          </Link>
        </div>

        {/* Tabs */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl mb-6 w-fit border"
          style={{
            background: "rgba(255,255,255,0.025)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          {["all", "active", "draft"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 capitalize"
              style={
                tab === t
                  ? { background: "rgba(59,130,246,0.18)", color: "#60A5FA" }
                  : { color: "#64748B" }
              }
            >
              {t === "active" ? "Published" : t === "draft" ? "Drafts" : "All"}
              <span
                className="text-[11px] px-1.5 py-0.5 rounded-full font-semibold tabular-nums"
                style={
                  tab === t
                    ? { background: "rgba(59,130,246,0.25)", color: "#93C5FD" }
                    : { background: "rgba(255,255,255,0.06)", color: "#475569" }
                }
              >
                {counts[t]}
              </span>
            </button>
          ))}
        </div>

        {/* Post list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <FileText className="w-7 h-7 text-slate-600" />
            </div>
            <p className="text-slate-400 font-semibold">No posts here yet</p>
            <p className="text-slate-600 text-sm mt-1">
              {tab === "draft"
                ? "Start writing and save a draft."
                : "Publish your first article."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => (
              <div
                key={post.$id}
                className="group flex gap-4 items-center rounded-2xl p-4 border transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                {/* Thumbnail */}
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  <img
                    src={getImage(post.featuredImage)}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusTag status={post.status} />
                    <CategoryBadge category={post.category} />
                  </div>
                  <h3
                    className="text-sm font-semibold text-slate-200 leading-snug line-clamp-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.$createdAt.split("T")[0]}
                    </span>
                    {post.status === "active" ? (
                      <>
                        <span className="text-slate-700">·</span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-700">·</span>
                        {/* <span>{post.wordCount.toLocaleString()} words</span> */}
                        <span className="text-slate-700">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/edit-post/${post.$id}`}>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 text-slate-400 hover:text-blue-400"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        borderColor: "rgba(255,255,255,0.08)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(59,130,246,0.10)";
                        e.currentTarget.style.borderColor =
                          "rgba(59,130,246,0.22)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.08)";
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </Link>
                  {deletingId === post.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => confirmDelete(post.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150"
                        style={{
                          background: "rgba(239,68,68,0.15)",
                          borderColor: "rgba(239,68,68,0.3)",
                          color: "#F87171",
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border text-slate-500 transition-all duration-150"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          borderColor: "rgba(255,255,255,0.08)",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 text-slate-500 hover:text-rose-400"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        borderColor: "rgba(255,255,255,0.08)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(239,68,68,0.08)";
                        e.currentTarget.style.borderColor =
                          "rgba(239,68,68,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.08)";
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary footer */}
        {filtered.length > 0 && (
          <div
            className="mt-6 px-4 py-3 rounded-xl border flex items-center gap-6 text-[11px] text-slate-600"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <span>{counts.active} published</span>
            <span className="text-slate-700">·</span>
            <span>{counts.draft} drafts</span>
            <span className="text-slate-700">·</span>
            {/* <span>
              {posts
                .reduce((s, p) => s + (p.status === "active" ? p.views : 0), 0)
                .toLocaleString()}{" "}
              total views
            </span> */}
            <span className="text-slate-700">·</span>
            <span>
              {posts.reduce(
                (s, p) => s + (p.status === "active" ? p.likes : 0),
                0,
              )}{" "}
              total likes
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPosts;
