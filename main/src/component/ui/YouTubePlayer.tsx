"use client";

import { useEffect, useRef, useState } from "react";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";

type YTPlayer = {
  previousVideo?: () => void;
  nextVideo?: () => void;
  destroy?: () => void;
};
type YTNamespace = {
  Player: new (el: HTMLIFrameElement, opts: { events: { onReady: () => void } }) => YTPlayer;
};
type YTWindow = Window & { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void };

let apiPromise: Promise<void> | null = null;
function loadApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as YTWindow;
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

const YouTubePlayer = ({ videoId, playlistId, title }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);

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

  useEffect(() => {
    if (!playlistId) return;
    let cancelled = false;
    loadApi().then(() => {
      if (cancelled || !iframeRef.current) return;
      const YT = (window as YTWindow).YT;
      if (!YT) return;
      playerRef.current = new YT.Player(iframeRef.current, {
        events: { onReady: () => !cancelled && setReady(true) },
      });
    });
    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        playerRef.current = null;
      }
      playerRef.current = null;
    };
  }, [playlistId, src]);

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          ref={iframeRef}
          src={src}
          title={title ?? "YouTube video player"}
          loading="lazy"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {playlistId && (
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            disabled={!ready}
            onClick={() => playerRef.current?.previousVideo?.()}
            className="m3-btn m3-btn-outlined pl-4"
          >
            <MdSkipPrevious aria-hidden />
            Prev
          </button>
          <button
            type="button"
            disabled={!ready}
            onClick={() => playerRef.current?.nextVideo?.()}
            className="m3-btn m3-btn-tonal pr-4"
          >
            Play next
            <MdSkipNext aria-hidden />
          </button>
          <span className="m3-body-small text-on-surface-variant">
            Playlist{title ? ` · ${title}` : ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;
