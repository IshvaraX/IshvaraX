/** Detect and normalise PDF links for embedding. */
export function isPdf(url: string): boolean {
  if (!url) return false;
  const path = url.split("?")[0].split("#")[0].toLowerCase();
  return (
    path.endsWith(".pdf") ||
    url.startsWith("data:application/pdf") ||
    /drive\.google\.com\/file\/d\//.test(url)
  );
}

/** Return an embeddable src for a PDF (Google Drive links become /preview). */
export function pdfEmbedSrc(url: string): string {
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  return url;
}
