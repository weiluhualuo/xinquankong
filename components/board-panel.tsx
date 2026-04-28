import Link from "next/link";
import { BoardSummary } from "../lib/types";

export function BoardPanel({ board }: { board: BoardSummary }) {
  return (
    <Link
      href={`/board/${board.slug}`}
      className="group relative flex min-h-[160px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[linear-gradient(145deg,#ffffff,#f2f7fc)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-[0_20px_50px_-34px_rgba(159,196,234,0.38)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(159,196,234,0.18),transparent_40%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute right-4 top-4 h-3 w-3 rounded-full ring-4 ring-white/80" style={{ backgroundColor: board.color }} />

      <div className="relative z-10 mb-4 flex items-start justify-between">
        <h3 className="text-lg font-bold text-slate-900 transition-colors duration-300 group-hover:text-[var(--accent-foreground)]">
          {board.name}
        </h3>
      </div>

      <p className="relative z-10 mb-auto line-clamp-2 text-sm leading-relaxed text-slate-500">
        {board.description}
      </p>

      <div className="relative z-10 mt-6 flex items-center gap-4 text-xs font-medium text-slate-400">
        <span className="flex items-center gap-1.5 transition-colors group-hover:text-[var(--accent-foreground)]">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          {board.postCount}
        </span>
        <span className="flex items-center gap-1.5 transition-colors group-hover:text-[var(--accent-foreground)]">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          {board.followerCount}
        </span>
      </div>
    </Link>
  );
}