"use client";

import { MdOpenInNew } from "react-icons/md";
import { getYouTube } from "@/lib/youtube";
import { isPdf, pdfEmbedSrc } from "@/lib/media";
import YouTubePlayer from "@/component/ui/YouTubePlayer";
import PdfViewer from "@/component/ui/PdfViewer";

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
      className="m3-btn m3-btn-outlined pl-4"
    >
      <MdOpenInNew aria-hidden />
      Open
    </a>
  );
};

export default CourseMedia;
