import { Link, useParams } from "react-router-dom";
import { useFetchRawTxt } from "../hooks/useFetch";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight"
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import React from "react";

export const Article: React.FC = () => {
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
        components={{
          // code: Code
          code(props) {
            const { children, className, node, ...rest } = props
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter
                style={atomOneDark}
                language={match[1]}
                showLineNumbers
                customStyle={{
                  margin: "16px 0px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  wordSpacing: "4px",
                  fontFamily: "monospace",
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>

            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          }
        }}
      >
        {data}
      </ReactMarkdown>
    </>
  );
};

// const Code: React.FC<{
//   children: React.ReactNode & React.ReactNode[]
//   inline?: boolean
// }> = ({ children, inline }) => {
//   if (inline) {
//     return <InlineCode>{children}</InlineCode>
//   }
//   return <CodeBlock>{children}</CodeBlock>
// }
//
// const InlineCode: React.FC<{
//   children: React.ReactNode & React.ReactNode[]
// }> = ({ children }) => {
//   return <code>{children}</code>
// }
//
// const CodeBlock: React.FC<{
//   children: React.ReactNode & React.ReactNode[]
//   className?: string
// }> = ({ children, className }) => {
//   const match = /language-(\w+)/.exec(className || "")
//   const lang = match && match[1] ? match[1] : ""
//
//   return (
//     <SyntaxHighlighter
//       style={atomOneDark /* eslint-disable-line */}
//       language={lang}
//       showLineNumbers
//       customStyle={{
//         margin: "16px 0px",
//         borderRadius: "4px",
//         fontSize: "12px",
//         wordSpacing: "4px",
//         fontFamily: "monospace",
//       }}
//     >
//       {String(children).replace(/\n$/, "")}
//     </SyntaxHighlighter>
//   )
// }
