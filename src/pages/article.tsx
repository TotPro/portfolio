import { Link, useParams } from "react-router-dom";
import { useFetchRawTxt } from "../hooks/useFetch";
import Markdown from "react-markdown";

export const Article = () => {
  const { articleId } = useParams();
  const { data, error, isLoading } = useFetchRawTxt(
    `/articles/${articleId}/index.md`,
  );

  if (error) return <div>failed to load</div>;
  if (!data || isLoading) return <div>loading...</div>;

  // データをレンダリングする
  return (
    <>
      <Link to="/">About</Link>
      <Link to="/blog">Blog</Link>
      <Markdown>{data}</Markdown>
    </>
  );
};
