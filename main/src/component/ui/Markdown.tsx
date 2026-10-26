"use client";

import { Suspense, lazy } from "react";

type MarkdownProps = {
  children: string;
  className?: string;
};

// react-markdown + remark plugins are only downloaded when a description is actually shown.
const MarkdownRenderer = lazy(() => import("./MarkdownRenderer"));

/** Renders a project/job description written in Markdown (with soft line breaks). */
const Markdown = ({ children, className }: MarkdownProps) => (
  <div className={`g-markdown ${className ?? ""}`}>
    <Suspense fallback={<div className="whitespace-pre-wrap">{children}</div>}>
      <MarkdownRenderer>{children}</MarkdownRenderer>
    </Suspense>
  </div>
);

export default Markdown;
