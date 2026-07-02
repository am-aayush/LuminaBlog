import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Clock,
  Eye,
  Heart,
  Bookmark,
  Share2,
  Copy,
  MessageSquare,
  CircleUser,
} from "lucide-react";
import { GlowButton, CategoryBadge } from "../components/index";
import Avatar from "../components/ui/Avatar";
import { useParams, Link, useNavigate } from "react-router-dom";
import appwriteService from "../appwrite/config";
import parser from "html-react-parser";
import { useSelector } from "react-redux";

export default function BlogPostViewer() {
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((res) => {
        if (res) {
          setPost(res);
          setLikeCount(res.likes || 0);
        } else {
          navigate("/");
        }
      });
    }
  }, [slug, navigate]);

  useEffect(() => {
    if (post && user && post.likedBy) {
      setLiked(post.likedBy.includes(user.$id));
    }
  }, [post, user]);

  const imageUrl = appwriteService.getFileView(post?.featuredImage);

  // console.log(post);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0,
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function scrollToSection() {
    document
      .getElementById("dummy-heading")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const updateLikeCount = (newCount) => {
    let increment = true;
    if (!post || !user) return;
    if(newCount < post.likes && !liked) return; // Prevent decrementing likes if not liked
    if(newCount > post.likes && liked) return; // Prevent incrementing likes if already liked
    if(newCount-1 === post.likes){
      increment = false;
    }
    // console.log(increment)
    appwriteService
      .updateLikes(post.$id, newCount, user.$id, post.likedBy , increment)
      .then((res) => {
        if (res) {
          setLikeCount(newCount);
        }
      });
  };

  return (
    <div className="pt-16 min-h-screen">
      {/* Reading progress bar */}
      <div
        className="fixed top-16 left-0 right-0 z-40 h-0.5"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <div
          className="h-full transition-[width] duration-75"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(to right, #3B82F6, #818CF8)",
          }}
        />
      </div>

      {/* Hero image */}
      <div className="relative h-105 bg-slate-800 overflow-hidden">
        <img
          src={imageUrl}
          alt={post?.title || "Blog post hero image"}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(18,24,38,0.25) 0%, rgba(18,24,38,0.96) 100%)",
          }}
        />
        {/* Back button */}
        <div className="absolute top-6 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => {
              navigate("/all-posts");
            }}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors cursor-pointer"
            style={{
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(8px)",
              padding: "7px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Posts
          </button>
        </div>
      </div>

      {/* Article container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_248px] gap-14 -mt-20 relative z-10">
          {/* ── Main article ── */}
          <article className="min-w-0">
            {/* Post header */}
            <div className="mb-8">
              <h1
                className="text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {post?.title || "Blog Post Title"}
              </h1>

              <p className="text-[17px] text-slate-400 leading-relaxed mb-6">
                {post?.blogAbout ||
                  "This is a short description of the blog post."}
              </p>

              {/* Meta bar */}
              <div
                className="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-2.5">
                  <CircleUser />
                  <div>
                    <p className="text-md font-semibold text-slate-200">
                      {post?.userName || "UserName"}
                    </p>
                    <p className="text-[13px] text-slate-600">
                      {new Date(post?.$createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) || "Jan 1, 2024"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[12px] text-slate-600 ml-auto flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    5-10 min read
                  </span>
                  {/* <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    1.2k views
                  </span> */}
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    if (!post || !user) return;
                    updateLikeCount(likeCount + (liked ? -1 : 1));
                    setLiked(!liked);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all duration-200"
                  style={
                    liked
                      ? {
                          background: "rgba(239,68,68,0.12)",
                          borderColor: "rgba(239,68,68,0.25)",
                          color: "#F87171",
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          borderColor: "rgba(255,255,255,0.08)",
                          color: "#64748B",
                        }
                  }
                >
                  <Heart
                    className={`w-4 h-4 transition-transform ${liked ? "scale-110 fill-current" : ""}`}
                  />
                  <span className="font-medium tabular-nums">{likeCount}</span>
                </button>

                <button
                  onClick={() => setBookmarked((b) => !b)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all duration-200"
                  style={
                    bookmarked
                      ? {
                          background: "rgba(59,130,246,0.12)",
                          borderColor: "rgba(59,130,246,0.25)",
                          color: "#60A5FA",
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          borderColor: "rgba(255,255,255,0.08)",
                          color: "#64748B",
                        }
                  }
                >
                  <Bookmark
                    className={`w-4 h-4 transition-transform ${bookmarked ? "scale-110 fill-current" : ""}`}
                  />
                  {bookmarked ? "Saved" : "Save"}
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all duration-200 text-slate-500 hover:text-slate-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  {copied ? "Copied link!" : "Share"}
                </button>
              </div>
            </div>

            {/* Body */}
            <div>
              <h2
                id="dummy-heading"
                className="text-xl font-bold text-slate-100 mt-12 mb-4 scroll-mt-28"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {post?.title || "Title Section"}
              </h2>
              <span
                className="text-slate-300 leading-[1.9] mb-6"
                style={{ fontSize: "17px" }}
              >
                {parser(post?.content || "Blog content will appear here.")}
              </span>
            </div>

            {/* Tag footer */}
            <div
              className="flex flex-wrap gap-2 mt-10 pt-8 border-t"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}
            ></div>

            {/* Author bio card */}
            <div
              className="mt-8 p-6 rounded-2xl border flex gap-4 items-start"
              style={{
                background: "rgba(255,255,255,0.025)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <CircleUser className="w-10 h-10 text-blue-400 shrink-0" />
              <div>
                <p
                  className="text-sm font-bold text-slate-100 mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Written by {post?.userName || "UserName"}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {/* This is a short dummy author bio for reference. */}
                </p>
                <button className="mt-3 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Follow on Lumina →
                </button>
              </div>
            </div>

            {/* ── Comments ── */}
            <section className="mt-12 pb-16">
              <h2
                className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <MessageSquare className="w-5 h-5 text-blue-400" />0 Comment
              </h2>

              {/* New comment input */}
              <div
                className="flex gap-3 mb-8 p-4 rounded-xl border"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <CircleUser className="w-10 h-10 text-blue-400 shrink-0" />
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts on this article..."
                    className="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
                    rows={commentText ? 3 : 2}
                  />
                  {commentText.trim() && (
                    <div className="flex justify-end mt-2">
                      <GlowButton
                        className="text-xs px-4 py-1.5"
                        onClick={() => setCommentText("")}
                      >
                        Post Comment
                      </GlowButton>
                    </div>
                  )}
                </div>
              </div>

              {/* Comment list */}
              <div className="space-y-6">
                <div className="flex gap-3">
                  <CircleUser className="w-10 h-10 text-blue-400 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-slate-200">
                        Alice Bob
                      </span>
                      <span className="text-[11px] text-slate-600">
                        2 hours ago
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      This is a single dummy comment for reference.
                    </p>
                    <div className="flex items-center gap-4 mt-2.5">
                      <button className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
                        <Heart className="w-3 h-3" />5
                      </button>
                      <button className="text-[11px] text-slate-600 hover:text-blue-400 transition-colors font-medium">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </article>

          {/* ── Sticky sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              {/* Table of contents */}
              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  Contents
                </p>
                <nav className="space-y-0.5">
                  <button
                    onClick={() => scrollToSection()}
                    className="block w-full text-left text-[13px] text-slate-500 hover:text-blue-400 transition-colors py-1.5 pl-3 rounded-r border-l border-transparent hover:border-blue-500/40 leading-snug"
                  >
                    {post?.title || "Title Section"}
                  </button>
                </nav>
              </div>

              {/* Reading progress */}
              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                    Progress
                  </p>
                  <span className="text-[11px] text-slate-600 tabular-nums">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(to right, #3B82F6, #818CF8)",
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-600 mt-2">5-10 min read</p>
              </div>

              {/* Related posts */}
              {/* <div
                className="rounded-2xl p-5 border"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-4">
                  Related
                </p>
                <div className="space-y-4">
                  <div
                    className="group flex gap-3 cursor-pointer"
                    onClick={() => {}}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1506744626753-140228303d8d?w=96&h=96&fit=crop&auto=format"
                        alt="Dummy related post"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-300 group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
                        This is a dummy related post title
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1">
                        4 min read
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Share */}
              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  Share
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs border text-slate-400 hover:text-slate-200 transition-all duration-150"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "Copied!" : "Link"}
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs border text-slate-400 hover:text-slate-200 transition-all duration-150"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Continue reading */}
      </div>
    </div>
  );
}
