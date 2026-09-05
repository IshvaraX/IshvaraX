"use client";

import { useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Load the YouTube IFrame Player API once, shared across players.
let apiPromise: Promise<void> | null = null;
function loadApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as any;
  if (w.YT && w.YT.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise<void>((resolve) => {
      const prev = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    });
  }
  return apiPromise;
}

type Props = {
  videoId?: string | null;
  playlistId?: string | null;
  title?: string;
};

/** Inline YouTube player. For playlists it exposes prev / play-next controls. */
const YouTubePlayer = ({ videoId, playlistId, title }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  // Build a standard embed URL (this alone plays the video/playlist).
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
  });
  if (typeof window !== "undefined") params.set("origin", window.location.origin);
  let src: string;
  if (playlistId) {
    params.set("list", playlistId);
    params.set("listType", "playlist");
    src = `https://www.youtube.com/embed/${videoId || "videoseries"}?${params}`;
  } else {
    src = `https://www.youtube.com/embed/${videoId}?${params}`;
  }

  // Attach the IFrame API to the existing iframe so we can drive prev/next.
  useEffect(() => {
    if (!playlistId) return;
    let cancelled = false;
    loadApi().then(() => {
      if (cancelled || !iframeRef.current) return;
      const YT = (window as any).YT;
      playerRef.current = new YT.Player(iframeRef.current, {
        events: { onReady: () => !cancelled && setReady(true) },
      });
    });
    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [playlistId, src]);

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--border)] bg-black">
        <iframe
          ref={iframeRef}
          src={src}
          title={title ?? "YouTube video player"}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {playlistId && (
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            disabled={!ready}
            onClick={() => playerRef.current?.previousVideo?.()}
            className="g-btn px-3 py-1.5 text-xs disabled:opacity-50"
          >
            ◂ Prev
          </button>
          <button
            type="button"
            disabled={!ready}
            onClick={() => playerRef.current?.nextVideo?.()}
            className="g-btn g-btn-primary px-3 py-1.5 text-xs disabled:opacity-50"
          >
            Play next ▸
          </button>
          <span className="text-xs text-[var(--muted)]">
            Playlist{title ? ` · ${title}` : ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;
