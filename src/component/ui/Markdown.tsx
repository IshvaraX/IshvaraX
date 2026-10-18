import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

type MarkdownProps = {
  children: string;
  className?: string;
};

/** Renders a project/job description written in Markdown (with soft line breaks). */
const Markdown = ({ children, className }: MarkdownProps) => (
  <div className={`g-markdown ${className ?? ""}`}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        a: ({ ...props }) => (
          <a target="_blank" rel="noopener noreferrer" {...props} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  </div>
);

export default Markdown;
