"use client";

import React from "react";

interface VideoMatch {
  platform: "youtube" | "bilibili" | "vimeo";
  src: string;
  index: number;
  length: number;
}

const videoPatterns: { platform: VideoMatch["platform"]; regex: RegExp; buildSrc: (m: RegExpMatchArray) => string }[] = [
  {
    platform: "youtube",
    regex: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/g,
    buildSrc: (m) => `https://www.youtube.com/embed/${m[1]}`,
  },
  {
    platform: "bilibili",
    regex: /(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/(BV[a-zA-Z0-9]+)(?:\/?\?[^\s]*)?/g,
    buildSrc: (m) => `//player.bilibili.com/player.html?bvid=${m[1]}&high_quality=1`,
  },
  {
    platform: "vimeo",
    regex: /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d{5,})/g,
    buildSrc: (m) => `https://player.vimeo.com/video/${m[1]}`,
  },
];

function findVideos(text: string): VideoMatch[] {
  const matches: VideoMatch[] = [];
  for (const { platform, regex, buildSrc } of videoPatterns) {
    for (const m of text.matchAll(regex)) {
      if (m.index !== undefined) {
        matches.push({ platform, src: buildSrc(m), index: m.index, length: m[0].length });
      }
    }
  }
  matches.sort((a, b) => a.index - b.index);
  return matches;
}

function VideoEmbed({ platform, src }: { platform: VideoMatch["platform"]; src: string }) {
  return (
    <div className="my-5 overflow-hidden rounded-2xl border border-slate-200 bg-black">
      <div className="relative" style={{ paddingTop: platform === "bilibili" ? "62.5%" : "56.25%" }}>
        <iframe
          src={src}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={`${platform} video`}
        />
      </div>
    </div>
  );
}

export function RichContent({ content }: { content: string }) {
  const videos = findVideos(content);

  if (videos.length === 0) {
    return <p className="whitespace-pre-wrap leading-loose">{content}</p>;
  }

  const blocks: React.ReactNode[] = [];
  let cursor = 0;

  videos.forEach((video, i) => {
    if (video.index > cursor) {
      blocks.push(
        <p key={`t-${i}`} className="whitespace-pre-wrap leading-loose">
          {content.slice(cursor, video.index)}
        </p>
      );
    }
    blocks.push(<VideoEmbed key={`v-${i}`} platform={video.platform} src={video.src} />);
    cursor = video.index + video.length;
  });

  if (cursor < content.length) {
    blocks.push(
      <p key="t-end" className="whitespace-pre-wrap leading-loose">
        {content.slice(cursor)}
      </p>
    );
  }

  return <>{blocks}</>;
}
