import React, { useEffect, useState } from "react";
import {
  Flame,
  ArrowRight,
  Clock,
  Eye,
  Heart,
  TrendingUp,
  ChevronRight,
  BookOpen,
  Tag,
  Hash,
  CircleUser,
} from "lucide-react";
import Avatar from "../components/ui/Avatar";
import { GlowButton, CategoryBadge, PostCard } from "../components/index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";

const Home = () => {
  const [POSTs, setPOSTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    appwriteService
      .getAllPost()
      .then((res) => {
        const documents = res?.documents || [];

        documents.sort(
          (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt),
        );

        const newPost = documents.map((post, index) => {
          if (index === 0) {
            return { ...post, featured: true };
          }
          return post;
        });

        setPOSTs(newPost);
        setIsLoading(false);
      })
      .catch(() => {
        setPOSTs([]);
        setIsLoading(false);
      });
  }, []);

  const POSTS = POSTs.length
    ? POSTs
    : [
        {
          id: 1,
          title: "Title of the Blog Post",
          blogAbout: "blog About Content",
          category: "Technology",
          author: "AuthorName",
          date: "Jun 28, 2026",
          readTime: "6 min",
          featuredImage: "",
          likes: 0,
          featured: true,
        },
      ];

  function imageUrl(featuredImage) {
    if (!featuredImage) return null;
    return appwriteService.getFileView(featuredImage);
  }

  const TAGS = [
    "AI/ML",
    "Web3",
    "Design Systems",
    "TypeScript",
    "Cloud",
    "React",
    "GraphQL",
    "DevOps",
  ];

  const featured = POSTS.find((p) => p.featured);
  const trending = POSTS.filter((p) => p.category === "Technology").slice(0, 3);
  const showLoading = isLoading;
  const authStatus = useSelector((state) => state.auth.isLoggedIn);

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* ── Hero ── */}
        <section className="mb-14 grid lg:grid-cols-5 gap-8 items-center">
          {/* Left text col */}
          <div className="lg:col-span-2">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-blue-400 font-semibold mb-5 border"
              style={{
                background: "rgba(59,130,246,0.1)",
                borderColor: "rgba(59,130,246,0.2)",
              }}
            >
              <Flame className="w-3 h-3" />
              Featured Article
            </div>
            <h1
              className="text-4xl lg:text-5xl font-extrabold text-slate-100 leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ideas that{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #60A5FA, #818CF8)",
                }}
              >
                shape the future
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed mb-7">
              In-depth articles on technology, design, and engineering — written
              by practitioners at the frontier.
            </p>
            <Link to={authStatus ? "/all-posts" : "/login"}>
              <GlowButton className="flex items-center gap-2 cursor-pointer">
                {!authStatus && <>Login to </>}Explore All Posts
                <ArrowRight className="w-4 h-4" />
              </GlowButton>
            </Link>
          </div>

          {/* Featured card */}
          <div className="lg:col-span-3">
            {showLoading || !featured || !authStatus ? (
              <div
                className="group relative border rounded-2xl overflow-hidden transition-all duration-300 animate-pulse"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div className="relative h-72 bg-slate-800 flex justify-center items-center">
                  {!authStatus && (
                    <p className="text-slate-400">
                      Please log in to Access all Features.
                    </p>
                  )}
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div className="h-5 w-24 rounded-full bg-white/10" />
                  <div className="h-6 w-3/4 rounded bg-white/10" />
                  <div className="h-4 w-full rounded bg-white/10" />
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-40 rounded bg-white/10" />
                    <div className="h-4 w-24 rounded bg-white/10" />
                  </div>
                </div>
              </div>
            ) : (
              <Link to={`/viewpost/${featured.$id}`}>
                <div
                  className="group relative border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    borderColor: "rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.25)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 60px rgba(59,130,246,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="relative h-72 overflow-hidden bg-slate-800">
                    <img
                      src={imageUrl(featured.featuredImage)}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, #121826 0%, rgba(18,24,38,0.3) 50%, transparent 100%)",
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <CategoryBadge category={featured.category} />
                      <h2
                        className="text-xl font-bold text-white mt-2 mb-1.5 leading-snug"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {featured.title}
                      </h2>
                      <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">
                        {featured.blogAbout}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CircleUser />
                      <span className="text-sm font-medium text-slate-300">
                        {featured.userName || "Author"}
                      </span>
                      <span className="text-slate-700 text-sm">·</span>
                      <span className="text-xs text-slate-600">
                        {featured.$createdAt.split("T")[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {featured.readTime || "6 min"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {featured.likes || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* ── Main + Sidebar ── */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          {authStatus ? (
            <div className="lg:col-span-2 space-y-10">
              {/* Trending section */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <h2
                      className="text-base font-semibold text-slate-200"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Trending Now
                    </h2>
                  </div>
                  <Link to="/all-posts">
                  <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-medium cursor-pointer">
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {showLoading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-40 rounded-2xl border animate-pulse"
                          style={{
                            background: "rgba(255,255,255,0.025)",
                            borderColor: "rgba(255,255,255,0.07)",
                          }}
                        >
                          <div className="p-4 space-y-3">
                            <div className="h-4 w-20 rounded bg-white/10" />
                            <div className="h-5 w-3/4 rounded bg-white/10" />
                            <div className="h-4 w-full rounded bg-white/10" />
                          </div>
                        </div>
                      ))
                    : trending.map((post) => (
                        <div key={post.$id || post.id}>
                          <Link to={`/viewpost/${post.$id}`}>
                            <PostCard post={post} />
                          </Link>
                        </div>
                      ))}
                </div>
              </section>

              {/* Latest list */}
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <h2
                    className="text-base font-semibold text-slate-200"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Latest Articles
                  </h2>
                </div>
                <div className="space-y-2">
                  {POSTS.slice(3).map((post) => (
                    <Link to={`/viewpost/${post.$id}`} key={post.$id}>
                    <div
                      className="group flex gap-4 rounded-xl p-4 cursor-pointer border transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        borderColor: "rgba(255,255,255,0.05)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                        e.currentTarget.style.borderColor =
                          "rgba(59,130,246,0.14)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.05)";
                      }}
                    >
                      <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                        <img
                          src={imageUrl(post.featuredImage)}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CategoryBadge category={post.category} />
                        <h3 className="text-sm font-semibold text-slate-200 group-hover:text-blue-300 transition-colors mt-1.5 mb-1 leading-snug line-clamp-1">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                          <span>{post.userName}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {post.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                      </Link>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <>
              <div className="lg:col-span-2 space-y-10">
                <section className="flex flex-col items-center justify-center gap-6 py-20">
                  <h2
                    className="text-2xl font-bold text-slate-100"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Welcome to Lumina
                  </h2>
                  <p className="text-slate-400 text-sm text-center max-w-md">
                    Discover a world of insightful articles and engaging
                    discussions. Join our community and start sharing your ideas
                    today.
                  </p>
                  <div className="flex gap-4">
                    <Link to="/login">
                      <GlowButton variant="ghost" className="cursor-pointer ">
                        Login
                      </GlowButton>
                    </Link>
                    <Link to="/signup">
                      <GlowButton className="cursor-pointer">
                        Sign Up
                      </GlowButton>
                    </Link>
                  </div>
                </section>
              </div>
            </>
          )}

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Categories */}
            <div
              className="rounded-2xl p-5 border"
              style={{
                background: "rgba(255,255,255,0.025)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <h3
                className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Tag className="w-4 h-4 text-blue-400" />
                Categories
              </h3>
              <div className="space-y-1">
                {[
                  { label: "Technology", count: 10  , dot: "#3B82F6" },
                  { label: "Design", count: 18, dot: "#8B5CF6" },
                  { label: "Engineering", count: 15, dot: "#10B981" },
                  { label: "Blockchain", count: 9, dot: "#F59E0B" },
                  { label: "Science", count: 7, dot: "#06B6D4" },
                  { label: "Culture", count: 5, dot: "#F43F5E" },
                ].map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setPage("view-posts")}
                    className="w-full flex items-center justify-between py-2 px-2 rounded-lg group transition-all duration-150"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: cat.dot }}
                      />
                      <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                        {cat.label}
                      </span>
                    </div>
                    <span
                      className="text-[11px] text-slate-600 px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular tags */}
            <div
              className="rounded-2xl p-5 border"
              style={{
                background: "rgba(255,255,255,0.025)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <h3
                className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Hash className="w-4 h-4 text-blue-400" />
                Popular Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs text-slate-400 cursor-pointer border transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.07)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(59,130,246,0.12)";
                      e.currentTarget.style.borderColor =
                        "rgba(59,130,246,0.25)";
                      e.currentTarget.style.color = "#60A5FA";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.07)";
                      e.currentTarget.style.color = "";
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent posts */}
            {!isLoading && authStatus && (
              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <h3
                  className="text-sm font-semibold text-slate-200 mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Recent Posts
                </h3>
                <div className="space-y-4">
                  {POSTS.slice(0, 3).map((post) => (
                    <div
                      key={post.$id}
                      className="group flex gap-3 cursor-pointer"
                      >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                        <img
                          src={imageUrl(post.featuredImage)}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-300 group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1">
                          {post.$createdAt.split("T")[0]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;
