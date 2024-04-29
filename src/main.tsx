import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { About } from "./pages/about.tsx";
import { BlogTop } from "./pages/blog_top.tsx";
import { Article } from "./pages/article.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <About />,
  },
  {
    path: "blog",
    element: <BlogTop />,
  },
  {
    path: "blog/:articleId",
    element: <Article />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
