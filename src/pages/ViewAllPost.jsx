import React, { useEffect, useState } from "react";
import { PostCard, CategoryBadge  } from "../components/index";
import {
  LayoutGrid,
  AlignLeft,
  Search,
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  CircleUser ,
  Heart
} from "lucide-react";
import Avatar from "../components/ui/Avatar";
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import { Link } from "react-router-dom";

function ViewAllPost({ setPage, openPost }) {
  const CATEGORIES = [
    "All",
    "Technology",
    "Design",
    "Engineering",
    "Blockchain",
    "Science",
    "Culture",
  ];

  const [POSTS, setPOSTS] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 6;

  const getAllPosts = async () => {
    try {
      const p = await appwriteService.getAllPost();
      // console.log(p.documents);
      setPOSTS(p.documents);
    } catch (error) {
      console.error("Error while fetching posts");
    }
  };
  useEffect(() => {
    getAllPosts();
  }, []);

  const filtered = POSTS.filter((post) => {
    const matchCat =
      activeCategory === "All" || post.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  function handleSearch(val) {
    setSearch(val);
    setCurrentPage(1);
  }

  function handleCategory(cat) {
    setActiveCategory(cat);
    setCurrentPage(1);
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl font-bold text-slate-100"
              style={{ fontFamily: "var(--font-display)" }}
            >
              All Posts
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {filtered.length} article{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
          {/* View toggle */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl border self-start sm:self-auto"
            style={{
              background: "rgba(255,255,255,0.025)",
              borderColor: "rgba(255,255,255,0.07)",
            }}
          >
            {[
              ["grid", LayoutGrid],
              ["list", AlignLeft],
            ].map(([mode, Icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="p-2 rounded-lg transition-all duration-150"
                style={
                  viewMode === mode
                    ? { background: "rgba(59,130,246,0.18)", color: "#60A5FA" }
                    : { color: "#475569" }
                }
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Search + filters */}
        <div className="space-y-3 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search articles by title, excerpt, or author..."
              className="w-full border rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 transition-all text-sm"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-150"
                style={
                  activeCategory === cat
                    ? {
                        background: "rgba(59,130,246,0.18)",
                        borderColor: "rgba(59,130,246,0.35)",
                        color: "#60A5FA",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "#64748B",
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <Search className="w-7 h-7 text-slate-600" />
            </div>
            <p className="text-slate-400 font-semibold">No posts found</p>
            <p className="text-slate-600 text-sm mt-1">
              Try a different keyword or category filter
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {paginated.map((post) => (
              <Link key={post.$id} to={`/viewpost/${post.$id}`}>
              <PostCard key={post.$id} post={post} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {paginated.map((post) => (
              <Link key={post.$id} to={`/viewpost/${post.$id}`}>              
                <div
                key={post.$id}
                className="group flex gap-5 rounded-2xl p-5 cursor-pointer border transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.045)";
                  e.currentTarget.style.borderColor = "rgba(59,130,246,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                <div className="w-32 h-24 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  <img
                    src={appwriteService.getFileView(post.featuredImage)}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <CategoryBadge category={post.category} />
                  </div>
                  <h3
                    className="font-semibold text-slate-100 group-hover:text-blue-300 transition-colors mb-1 leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-3 leading-relaxed">
                    {post.blogAbout}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <CircleUser />
                      <span>{post.userName}</span>
                    </div>
                    <span className="text-slate-700">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.$createdAt.split("T")[0]}
                    </span>
                    <span className="text-slate-700">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      5-10 min read
                    </span>  
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes} Likes
                    </span>                  
                  </div>
                </div>
                <div className="`shrink-0 self-center">
                  <button className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
                </Link>
            ))}
          </div>
        )}


        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className="w-9 h-9 rounded-xl text-sm font-medium border transition-all duration-150"
                style={
                  currentPage === n
                    ? {
                        background: "rgba(59,130,246,0.18)",
                        borderColor: "rgba(59,130,246,0.35)",
                        color: "#60A5FA",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "#64748B",
                      }
                }
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewAllPost;
