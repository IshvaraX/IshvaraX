import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
};

const PagePanel = ({ children, narrow = false, className = "" }: Props) => (
  <main className="mx-auto w-full max-w-[1320px] p-2 lg:p-3 lg:pl-1">
    <div
      className={`m3-panel min-h-[calc(100vh-7rem)] p-6 md:p-10 ${
        narrow ? "mx-auto max-w-3xl" : ""
      } ${className}`}
    >
      {children}
    </div>
  </main>
);

export default PagePanel;
