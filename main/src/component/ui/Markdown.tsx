"use client";

import { Suspense, lazy } from "react";

type MarkdownProps = {
  children: string;
  className?: string;
};

const MarkdownRenderer = lazy(() => import("./MarkdownRenderer"));

const Markdown = ({ children, className }: MarkdownProps) => (
  <div className={`g-markdown ${className ?? ""}`}>
    <Suspense fallback={<div className="whitespace-pre-wrap">{children}</div>}>
      <MarkdownRenderer>{children}</MarkdownRenderer>
    </Suspense>
  </div>
);

export default Markdown;
