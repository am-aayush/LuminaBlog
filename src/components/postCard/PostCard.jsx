import React from "react";
import { CategoryBadge } from "../index";
import { Clock, Heart, CircleUser } from "lucide-react";
import Avatar from "../ui/Avatar";
import appwriteService from "../../appwrite/config";
import parser from "html-react-parser";

function PostCard({ post }) {
  const imageUrl = appwriteService.getFileView(post.featuredImage);
  return (
    <div
      className="group flex flex-col border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.025)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = "rgba(59,130,246,0.22)";
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(59,130,246,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.025)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="relative h-44 overflow-hidden bg-slate-800">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(18,24,38,0.75) 0%, transparent 60%)",
          }}
        />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={post.category} />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-semibold text-slate-100 leading-snug mb-2 text-base group-hover:text-blue-300 transition-colors line-clamp-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {post.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
          {parser(post.blogAbout)}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <CircleUser />
            <div>
              <p className="text-xs font-medium text-slate-300">
                {post.userName}
              </p>
              <p className="text-[11px] text-slate-600">{post.createdAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {"5-10 min read"}
            </span>
            {/* <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {5}
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
