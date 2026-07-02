import React, { useState } from "react";
import { Sparkles, Mail, Lock } from "lucide-react";
import { GlowButton } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../features/auth/authSlice";
import { ToastContainer} from "react-toastify";
import notify from "../utils/notify"
function GlassInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      )}
      <input
        className={`w-full border border-white/8 rounded-xl py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 transition-all duration-200 text-sm ${
          Icon ? "pl-10 pr-4" : "px-4"
        }`}
        style={{
          background: "rgba(255,255,255,0.04)",
          boxShadow: "none",
        }}
        onFocus={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
        {...props}
      />
    </div>
  );
}

const Login = () => {
  const [remember, setRemember] = useState(false)
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  

  const login =  async (data) => {
    console.log(data)
    const response = await authService.login(data)
    if (response) {
      const userData = await authService.getCurrentUser()
      if(userData) dispatch(authLogin(userData))
      navigate("/")
    }else{
      notify("Login Failed")
    }

  }
  

  return (
    <div
      className="min-h-screen antialiased"
      style={{
        fontFamily: "var(--font-sans)",
        background: "#121826",
        color: "#E2E8F0",
      }}
    >
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Brand mark */}
          <div className="flex flex-col items-center mb-9">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                boxShadow: "0 0 40px rgba(59,130,246,0.4)",
              }}
            >
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1
              className="text-2xl font-bold text-slate-100"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Sign in to your Lumina account
            </p>
          </div>

          {/* Glass card */}
          <div
            className="rounded-2xl p-7 border"
            style={{
              background: "rgba(255,255,255,0.035)",
              backdropFilter: "blur(24px)",
              borderColor: "rgba(255,255,255,0.08)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
            }}
          >
            <form onSubmit={handleSubmit(login)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    Email address
                  </label>
                  <GlassInput
                    icon={Mail}
                    type="email"
                    placeholder="you@example.com"
                    {...register("email",{required:true})}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <GlassInput
                    icon={Lock}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="password"
                    {...register("password",{required:true})}
                  />
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <label
                    className="flex items-center gap-2 cursor-pointer select-none"
                    onClick={() => setRemember(!remember)}
                  >
                    <div
                      className="w-4 h-4 rounded border flex items-center justify-center transition-all duration-150 shrink-0"
                      style={
                        remember
                          ? { background: "#3B82F6", borderColor: "#3B82F6" }
                          : {
                              background: "rgba(255,255,255,0.04)",
                              borderColor: "rgba(255,255,255,0.15)",
                            }
                      }
                    >
                      {remember && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M1.5 5L3.8 7.5L8.5 2.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">Remember me</span>
                  </label>
                  <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    Forgot password?
                  </button>
                </div>

                <GlowButton
                  className="w-full justify-center mt-1 py-3 cursor-pointer "
                >
                  Sign In to Lumina
                </GlowButton>
              </div>
            </form>
          </div>

          <p className="text-center text-sm text-slate-600 mt-6">
            {"Don't have an account? "}
            <Link to="/signup">
              <button className="text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer">
                Create one free
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
