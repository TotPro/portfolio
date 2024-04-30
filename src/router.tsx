import { createBrowserRouter } from "react-router-dom";
import { About } from "./pages/about";
import { BlogTop } from "./pages/blog_top";
import { Article } from "./pages/article";

export const router = createBrowserRouter([
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
