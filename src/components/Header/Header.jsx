import React, { useState } from "react";
import {
  Sparkles,
  Home,
  PlusSquare,
  BookOpen,
  LogOut,
  Menu,
  X,
  CircleUser,
} from "lucide-react";
import Avatar from "../ui/Avatar";
import { useDispatch, useSelector } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../features/auth/authSlice";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "home", slug: "/", label: "Home", Icon: Home },
    { id: "add-post", slug: "/add-post", label: "Write", Icon: PlusSquare },
    { id: "view-posts", slug: "/all-posts", label: "Posts", Icon: BookOpen },
  ];

  const dispatch = useDispatch();
  const handleLogout = () => {
    authService.logout().then(() => {
      console.log("User logged out successfully");
      dispatch(logout());
    });
  };
  const authStatus = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.userData);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: "rgba(18,24,38,0.82)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={"/"}>
              <button className="flex items-center gap-2.5 cursor-pointer">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                    boxShadow: "0 0 20px rgba(59,130,246,0.35)",
                  }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span
                  className="font-bold text-slate-100 text-lg tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Lumina
                </span>
              </button>
            </Link>
            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map(({ id, slug, label, Icon }) => (
                <NavLink
                  to={slug}
                  key={id}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-blue-400 cursor-pointer ${
                      isActive
                        ? "bg-[rgba(59,130,246,0.12)] border border-[rgba(59,130,246,0.18)]"
                        : "bg-transparent border border-transparent"
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                </NavLink>
              ))}
            </div>

            {/* Right */}
            {authStatus ? (
              <div className="hidden md:flex items-center gap-3">
                <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium cursor-pointer">
                  <CircleUser className="w-6 h-6" />
                  <span>{user?.name || "User"}</span>
                </button>
                <button
                  className="flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors text-sm ml-1 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to={"/login"}>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors font-lg cursor-pointer">
                    Login
                  </button>
                </Link>
                <Link to={"/signup"}>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors font-lg cursor-pointer">
                    SingUp
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {open && (
            <div
              className="md:hidden pb-4 pt-3 border-t space-y-1"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              {links.map(({ id, label, Icon }) => (
                <NavLink
                  key={id}
                  to={links.find((link) => link.id === id)?.slug || "/"}
                  onClick={() => {
                    setOpen(false);
                  }}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-blue-400 ${
                      isActive
                        ? "bg-[rgba(59,130,246,0.10)] border border-[rgba(59,130,246,0.18)]"
                        : "bg-transparent border border-transparent"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
              {authStatus ? (
                <button
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-400 transition-colors cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <>
                  <Link to={"/login"}>
                    <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
                      Login
                    </button>
                  </Link>
                  <Link to={"/signup"}>
                    <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
                      SingUp
                    </button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
