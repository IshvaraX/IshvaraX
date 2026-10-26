"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

const components = {
  a: (props: React.ComponentProps<"a">) => (
    <a target="_blank" rel="noopener noreferrer" {...props} />
  ),
};
const plugins = [remarkGfm, remarkBreaks];

const MarkdownRenderer = ({ children }: { children: string }) => (
  <ReactMarkdown remarkPlugins={plugins} components={components}>
    {children}
  </ReactMarkdown>
);

export default MarkdownRenderer;
