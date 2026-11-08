// Mirrors IMAGE_MAX_BYTES / allowed types in the backend's models.py.
export const IMAGE_MAX_BYTES = 500_000;
export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/gif";
const IMAGE_TYPES = new Set(IMAGE_ACCEPT.split(","));

/** Validate an uploaded image and resolve to its data URL, or reject with a user-facing message. */
export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!IMAGE_TYPES.has(file.type)) {
      reject(new Error("Please choose a PNG, JPEG, WebP or GIF image."));
      return;
    }
    if (file.size > IMAGE_MAX_BYTES) {
      reject(new Error(`Please choose an image under ${Math.round(IMAGE_MAX_BYTES / 1000)} KB.`));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  });
}

export function isPdf(url: string): boolean {
  if (!url) return false;
  const path = url.split("?")[0].split("#")[0].toLowerCase();
  return (
    path.endsWith(".pdf") ||
    url.startsWith("data:application/pdf") ||
    /drive\.google\.com\/file\/d\//.test(url)
  );
}

export function pdfEmbedSrc(url: string): string {
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  return url;
}
