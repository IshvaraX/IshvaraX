"use client";

import { getYouTube } from "@/lib/youtube";
import { isPdf, pdfEmbedSrc } from "@/lib/media";
import YouTubePlayer from "@/component/ui/YouTubePlayer";
import PdfViewer from "@/component/ui/PdfViewer";

/** Renders the right inline embed for a course link: video, PDF, or a link. */
const CourseMedia = ({ link, title }: { link: string; title?: string }) => {
  const { videoId, playlistId } = getYouTube(link);
  if (videoId || playlistId) {
    return <YouTubePlayer videoId={videoId} playlistId={playlistId} title={title} />;
  }
  if (isPdf(link)) {
    return <PdfViewer src={pdfEmbedSrc(link)} title={title} />;
  }
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="g-btn inline-flex px-3 py-1.5 text-xs"
    >
      Open ↗
    </a>
  );
};

export default CourseMedia;
