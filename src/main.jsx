import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
//Pages Import for Routing
import App from "./App.jsx";
import {
  EditPost,
  Home,
  Login,
  MakePost,
  Signup,
  ViewAllPost,
  ViewPost,
} from "./pages/index.js";
import { AuthLayout } from "./components/index.js";
import { Provider } from "react-redux";
import store from "./store/store.js";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="" element={<Home />} />
        <Route
          path="all-posts"
          element={
            <AuthLayout authentication={true}>
              <ViewAllPost />
            </AuthLayout>
          }
        />
        <Route
          path="add-post"
          element={
            <AuthLayout authentication={true}>
              <MakePost />
            </AuthLayout>
          }
        />
        <Route
          path="edit-post/:slug"
          element={
            <AuthLayout authentication={true}>
              <EditPost />
            </AuthLayout>
          }
        />
        <Route path="viewpost/:slug" element={<ViewPost />} />
      </Route>
      , //SeperatePath for Login and Signup Pages
      <Route
        path="/login"
        element={
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        }
      />
      ,
      <Route
        path="/signup"
        element={
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        }
      />
      ,
    </>,
  ),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
