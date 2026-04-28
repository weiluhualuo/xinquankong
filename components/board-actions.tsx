"use client";

import Link from "next/link";
import { useState } from "react";
import { ApiError, toggleBoardFollow } from "../lib/api";

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "请求失败";
}

export function BoardActions({
  slug,
  color,
  isFollowing,
  postCount,
  followerCount
}: {
  slug: string;
  color: string;
  isFollowing: boolean;
  postCount: number;
  followerCount: number;
}) {
  const [following, setFollowing] = useState(isFollowing);
  const [followers, setFollowers] = useState(followerCount);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleToggleFollow = async () => {
    setBusy(true);
    setError("");
    try {
      const result = await toggleBoardFollow(slug);
      setFollowing(result.following);
      setFollowers((current) => {
        if (result.following && !following) return current + 1;
        if (!result.following && following) return Math.max(0, current - 1);
        return current;
      });
    } catch (toggleError) {
      setError(getErrorMessage(toggleError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur md:w-[320px]">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <div className="text-sm font-semibold text-slate-700">板块操作</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">帖子</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{postCount}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">关注</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{followers}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void handleToggleFollow()}
          disabled={busy}
          className={`inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition disabled:opacity-50 ${
            following ? "border border-slate-200 bg-white text-slate-900 hover:bg-[var(--accent)]" : "border border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          {busy ? "处理中..." : following ? "已关注" : "关注板块"}
        </button>

        <Link
          href={`/publish?board=${slug}`}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-[var(--accent)]"
        >
          New Post
        </Link>
      </div>

      {error && <div className="mt-3 text-sm text-slate-700">{error}</div>}
    </div>
  );
}