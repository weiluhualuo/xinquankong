import Link from "next/link";
import { BoardSummary } from "../lib/types";

export function BoardPanel({ board }: { board: BoardSummary }) {
  return (
    <Link
      href={`/board/${board.slug}`}
      className="group relative flex flex-col p-6 rounded-2xl border border-blue-100/50 bg-gradient-to-br from-white to-blue-50/20 hover:border-blue-200 hover:shadow-card-glow transition-all duration-500 min-h-[160px] overflow-hidden"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

      {/* 发光指示器 */}
      <div className="absolute top-4 right-4">
        <span
          className="relative flex h-3 w-3"
        >
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: board.color }}
          ></span>
          <span
            className="relative inline-flex rounded-full h-3 w-3"
            style={{ backgroundColor: board.color }}
          ></span>
        </span>
      </div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
          {board.name}
        </h3>
      </div>

      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-auto relative z-10">
        {board.description}
      </p>

      <div className="flex items-center gap-4 mt-6 text-xs font-medium text-slate-400 relative z-10">
        <span className="flex items-center gap-1.5 group-hover:text-blue-500 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          {board.postCount}
        </span>
        <span className="flex items-center gap-1.5 group-hover:text-blue-500 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          {board.followerCount}
        </span>
      </div>
    </Link>
  );
}
