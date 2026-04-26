"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, getBoard, toggleBoardFollow } from "../lib/api";

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "操作失败，请稍后重试";
}

export function BoardActions({
  slug,
  isFollowing,
  color,
  postCount,
  followerCount
}: {
  slug: string;
  isFollowing: boolean;
  color: string;
  postCount: number;
  followerCount: number;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(isFollowing);
  const [followers, setFollowers] = useState(followerCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const syncBoardState = async () => {
      try {
        const latest = await getBoard(slug);
        if (!latest) {
          return;
        }

        setFollowing(Boolean(latest.isFollowing));
        setFollowers(latest.followerCount);
      } catch {
        // keep server-rendered fallback state
      }
    };

    void syncBoardState();
  }, [slug]);

  const handleFollow = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await toggleBoardFollow(slug);
      setFollowing(result.following);
      setFollowers((current) => Math.max(current + (result.following ? 1 : -1), 0));
      router.refresh();
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shrink-0 rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">{postCount}</span>
            <span className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">发帖</span>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">{followers}</span>
            <span className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">关注</span>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => void handleFollow()}
          className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all shadow-sm ${
            following
              ? "border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
              : "bg-slate-900 text-white hover:bg-slate-800"
          } disabled:opacity-50`}
          style={!following ? { boxShadow: `0 10px 24px ${color}25` } : undefined}
        >
          {loading ? "处理中..." : following ? "已关注板块" : "关注板块"}
        </button>

        <Link
          href={`/publish?board=${slug}`}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-50 px-4 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-100"
        >
          在此板块发帖
        </Link>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
