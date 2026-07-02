import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Header, Footer } from "./components/index";
import authService from "./appwrite/auth";
import { login, logout } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((user) => {
        if (user) {
          dispatch(login(user));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => {
        dispatch(logout());
      });
  }, [dispatch]);

  return (
    <>
      <div
        className="min-h-screen antialiased"
        style={{
          fontFamily: "var(--font-sans)",
          background: "#121826",
          color: "#E2E8F0",
        }}
      >
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default App;
