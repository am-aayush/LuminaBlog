import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";

const AuthLayout = ({ children, authentication = true }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!active) return;
        if (authentication) {
          if (!user && !authStatus) {
            navigate("/login", { replace: true });
          }
        } else {
          if (user || authStatus) {
            navigate("/", { replace: true });
          }
        }
      } finally {
        if (active) {
          setLoader(false);
        }
      }
    };

    checkAuth();

    return () => {
      active = false;
    };
  }, [authStatus, navigate, authentication]);

  return loader ? (
    <div
      className="min-h-screen antialiased flex justify-center items-center"
      style={{
        fontFamily: "var(--font-sans)",
        background: "#121826",
        color: "#E2E8F0",
      }}
    >
      Loding........
    </div>
  ) : (
    <>{children}</>
  );
};

export default AuthLayout;
