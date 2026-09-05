"use client";

/** Embeds a PDF in an inline viewer with a fallback open link. */
const PdfViewer = ({ src, title }: { src: string; title?: string }) => (
  <div>
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <iframe
        src={src}
        title={title ?? "PDF document"}
        className="absolute inset-0 h-full w-full"
      />
    </div>
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex text-xs text-[var(--accent-2)] hover:underline"
    >
      Open PDF ↗
    </a>
  </div>
);

export default PdfViewer;
