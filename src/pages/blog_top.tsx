import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import "./blog_top.css";

type Article = {
  dirName: string;
  title: string;
  date: string;
};

export const BlogTop = () => {
  const { data, error, isLoading } = useFetch<{
    articles: Article[];
  }>("/articles/article_list.json");

  if (error) return <div>failed to load</div>;
  if (!data || isLoading) return <div>loading...</div>;

  // データをレンダリングする
  return (
    <>
      <img className="header" src="/header_2.png" alt="header" />
      <nav>
        <Link className="items" to="/">
          About
        </Link>
        <Link className="items" to="/blog">
          Blog
        </Link>
      </nav>

      <ul>
        {data.articles.map((article, i) => {
          return (
            <li>
              <Link to={article.dirName} key={i} className="article">
                {article.title}
              </Link>
              <br />
              {article.date}
            </li>
          );
        })}
      </ul>
    </>
  );
};
