import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownProps = {
  children: string;
  className?: string;
};

/** Renders a project/job description written in Markdown. */
const Markdown = ({ children, className }: MarkdownProps) => (
  <div className={`g-markdown ${className ?? ""}`}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
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
