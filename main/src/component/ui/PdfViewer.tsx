"use client";

import { MdOpenInNew } from "react-icons/md";

/** Embeds a PDF in an inline viewer with a fallback open link. */
const PdfViewer = ({ src, title }: { src: string; title?: string }) => (
  <div>
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-container-high">
      <iframe
        src={src}
        title={title ?? "PDF document"}
        loading="lazy"
        className="absolute inset-0 h-full w-full"
      />
    </div>
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="m3-btn m3-btn-text -ml-3 mt-1"
    >
      Open PDF
      <MdOpenInNew aria-hidden />
    </a>
  </div>
);

export default PdfViewer;
