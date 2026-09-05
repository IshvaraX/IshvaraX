/** Extract a YouTube video id from common URL formats, or null if not YouTube. */
export function getYouTubeId(url: string): string | null {
  return getYouTube(url).videoId;
}

/** Extract both a video id and a playlist id (either may be null). */
export function getYouTube(url: string): {
  videoId: string | null;
  playlistId: string | null;
} {
  if (!url) return { videoId: null, playlistId: null };
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");
    const playlistId = u.searchParams.get("list");
    let videoId: string | null = null;

    if (host === "youtu.be") {
      videoId = u.pathname.slice(1).split("/")[0] || null;
    } else if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (u.pathname === "/watch") {
        videoId = u.searchParams.get("v");
      } else {
        const parts = u.pathname.split("/").filter(Boolean);
        if (["embed", "shorts", "v"].includes(parts[0])) {
          // /embed/videoseries carries only a playlist
          videoId = parts[1] && parts[1] !== "videoseries" ? parts[1] : null;
        }
      }
    }
    return { videoId, playlistId };
  } catch {
    return { videoId: null, playlistId: null };
  }
}

export const isYouTube = (url: string) => {
  const { videoId, playlistId } = getYouTube(url);
  return Boolean(videoId || playlistId);
};
