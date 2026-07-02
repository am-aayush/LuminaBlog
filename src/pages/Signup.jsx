import React, { useEffect, useState } from "react";
import { Sparkles, Lock, AtSign, Mail } from "lucide-react";
import { GlowButton } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer} from "react-toastify";
import notify from "../utils/notify";
import authService from "../appwrite/auth";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../features/auth/authSlice";

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

const Signup = () => {
  const { register, handleSubmit, watch } = useForm();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSignup = async (data) => {
    try {
      if (data.password === data.confirmPassword) {
        const userData = await authService.createAccount(data);
        if (userData) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) dispatch(authLogin(currentUser));
          navigate("/");
        }
      } else {
        notify("Password not Matched");
      }
    } catch (error) {
      notify("Error while creating account");
    }
  };

  return (
    <div
      className="min-h-screen antialiased"
      style={{
        fontFamily: "var(--font-sans)",
        background: "#121826",
        color: "#E2E8F0",
      }}
    >
      {/* <button onClick={()=>notify("sdfas")}>Notify !</button> */}
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
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
              Create account
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Join Lumina and start publishing
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSignup)}>
            <div
              className="rounded-2xl p-7 border"
              style={{
                background: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(24px)",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    Name
                  </label>
                  <GlassInput
                    icon={AtSign}
                    type="text"
                    autoComplete="name"
                    placeholder="Your Name"
                    {...register("name", { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <GlassInput
                    icon={Mail}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="mail"
                    {...register("email", { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <GlassInput
                    icon={Lock}
                    type="password"
                    placeholder="Min. 8 characters"
                    autoComplete="password"
                    {...register("password", { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    Confirm Password
                  </label>
                  <GlassInput
                    icon={Lock}
                    type="password"
                    placeholder="Repeat password"
                    autoComplete="repeat-password"
                    {...register("confirmPassword", { required: true })}
                  />
                </div>

                <p className="text-[11px] text-slate-600 pt-1">
                  By creating an account you agree to our{" "}
                  <span className="text-blue-400 cursor-pointer hover:text-blue-300">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-400 cursor-pointer hover:text-blue-300">
                    Privacy Policy
                  </span>
                  .
                </p>

                <GlowButton
                  // onClick={() => toast("Hello")}
                  className="w-full justify-center py-3"
                >
                  Create Free Account
                </GlowButton>
              </div>
            </div>
          </form>
          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link to="/login">
              <button
                onClick={() => setPage("login")}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
