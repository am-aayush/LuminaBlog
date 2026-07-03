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
  ChevronDown,
  FileText,
} from "lucide-react";
import Avatar from "../ui/Avatar";
import { useDispatch, useSelector } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../features/auth/authSlice";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const links = [
    { id: "home", slug: "/", label: "Home", Icon: Home },
    { id: "add-post", slug: "/add-post", label: "Write", Icon: PlusSquare },
    { id: "view-posts", slug: "/all-posts", label: "Posts", Icon: BookOpen },
  ];
  const dropdownItems = [{ id: "my-posts", label: "My Posts", Icon: FileText }];
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
              // <div className="hidden md:flex items-center gap-3">
              //   <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium cursor-pointer">
              //     <CircleUser className="w-6 h-6" />
              //     <span>{user?.name || "User"}</span>
              //   </button>
              //   <button
              //     className="flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors text-sm ml-1 cursor-pointer"
              //     onClick={handleLogout}
              //   >
              //     <LogOut className="w-5 h-5" />
              //   </button>
              // </div>
              <div className="hidden md:flex items-center gap-2">
                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-slate-100 transition-all duration-200 border border-transparent hover:border-white/8 cursor-pointer"
                    style={
                      dropdownOpen
                        ? {
                            background: "rgba(255,255,255,0.06)",
                            borderColor: "rgba(255,255,255,0.09)",
                          }
                        : {}
                    }
                  >
                    <CircleUser />
                    <span className="hidden lg:inline">
                      {user?.name || "UserName"}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown panel */}
                  {dropdownOpen && (
                    <>
                      {/* Click-away backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div
                        className="absolute right-0 top-full mt-2 w-52 rounded-2xl border overflow-hidden z-20"
                        style={{
                          background: "rgba(22,30,46,0.97)",
                          backdropFilter: "blur(24px)",
                          borderColor: "rgba(255,255,255,0.09)",
                          boxShadow:
                            "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
                        }}
                      >
                        {/* Profile header */}
                        <div
                          className="px-4 py-3 border-b"
                          style={{ borderColor: "rgba(255,255,255,0.07)" }}
                        >
                          <div className="flex items-center gap-2.5">
                            <CircleUser />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-100 truncate">
                                {user?.name || "UserName"}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {user?.email || "example@example.com"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="p-1.5">
                          {dropdownItems.map(({ id, label, Icon }) => (
                            <Link to={"myposts"} key={id}>
                              <button
                                onClick={() => {
                                  setDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-100 transition-all duration-150 group cursor-pointer"
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.background =
                                    "rgba(255,255,255,0.06)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.background =
                                    "transparent")
                                }
                              >
                                <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                {label}
                              </button>
                            </Link>
                          ))}
                        </div>

                        {/* Divider + logout */}
                        <div
                          className="p-1.5 border-t"
                          style={{ borderColor: "rgba(255,255,255,0.07)" }}
                        >
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-rose-400 transition-all duration-150 cursor-pointer"
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background =
                                "rgba(239,68,68,0.07)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
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
