"use client";

import type { AnnouncementRecord } from "../lib/types";

export function AnnouncementStrip({ announcements }: { announcements: AnnouncementRecord[] }) {
  if (!announcements.length) {
    return null;
  }

  const primaryAnnouncement = announcements[0];
  const marqueeText = `【${primaryAnnouncement.title}】${primaryAnnouncement.content}`;

  return (
    <div className="pointer-events-none absolute right-0 top-4 z-30 w-full max-w-3xl text-slate-700 md:w-[32rem] md:translate-x-6">
      <div className="pointer-events-auto mb-3 flex justify-end">
        <span className="rounded-full border border-[var(--border)] bg-[var(--accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--accent-foreground)] shadow-sm backdrop-blur-sm">
          公告
        </span>
      </div>
      <div className="pointer-events-auto relative overflow-hidden rounded-full border border-white/75 bg-[rgba(255,255,255,0.88)] px-4 py-3 shadow-[0_22px_60px_-30px_rgba(15,23,42,0.45)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--accent)] via-white/88 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--accent)] via-white/88 to-transparent" />
        <div className="flex w-max animate-homepage-marquee gap-10 whitespace-nowrap pr-10 text-sm font-medium">
          <span>{marqueeText}</span>
          <span aria-hidden="true">{marqueeText}</span>
        </div>
      </div>
      <div className="pointer-events-auto mt-2 text-right text-xs text-slate-400">
        发布于 {new Date(primaryAnnouncement.createdAt).toLocaleString("zh-CN", { hour12: false })}
      </div>
      <style jsx>{`
        .animate-homepage-marquee {
          animation: homepage-marquee 24s linear infinite;
        }

        @keyframes homepage-marquee {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(calc(-50% - 1.25rem));
          }
        }
      `}</style>
    </div>
  );
}