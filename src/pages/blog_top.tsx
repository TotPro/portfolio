import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

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
      <Link to="/">About</Link>
      <Link to="/blog">Blog</Link>

      <ul>
        {data.articles.map((article, i) => {
          return (
            <li>
              <Link to={article.dirName} key={i}>
                {article.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};
