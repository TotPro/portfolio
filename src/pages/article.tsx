import { Link, useParams } from "react-router-dom";
import { useFetchRawTxt } from "../hooks/useFetch";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

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
      <nav>
        <Link className="items" to="/">
          About
        </Link>
        <Link className="items" to="/blog">
          Blog
        </Link>
      </nav>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {data}
      </ReactMarkdown>
    </>
  );
};
