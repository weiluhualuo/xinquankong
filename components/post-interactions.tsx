"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, createPostComment, getPost, togglePostFavorite, togglePostLike } from "../lib/api";
import { Comment, PostDetail } from "../lib/types";
import { CommentThread } from "./comment-thread";

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "操作失败，请稍后重试";
}

export function PostInteractions({ post }: { post: PostDetail }) {
  const router = useRouter();
  const [liked, setLiked] = useState(Boolean(post.isLiked));
  const [favorited, setFavorited] = useState(Boolean(post.isFavorited));
  const [likes, setLikes] = useState(post.metrics.likes);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [commentValue, setCommentValue] = useState("");
  const [loadingAction, setLoadingAction] = useState<"like" | "favorite" | "comment" | "">("");
  const [error, setError] = useState("");

  useEffect(() => {
    const syncPostState = async () => {
      try {
        const latest = await getPost(post.id);
        if (!latest) {
          return;
        }

        setLiked(Boolean(latest.isLiked));
        setFavorited(Boolean(latest.isFavorited));
        setLikes(latest.metrics.likes);
        setComments(latest.comments);
      } catch {
        // keep server-rendered fallback state
      }
    };

    void syncPostState();
  }, [post.id]);

  const handleLike = async () => {
    setLoadingAction("like");
    setError("");

    try {
      const result = await togglePostLike(post.id);
      setLiked(result.liked);
      setLikes((current) => Math.max(current + (result.liked ? 1 : -1), 0));
      router.refresh();
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    } finally {
      setLoadingAction("");
    }
  };

  const handleFavorite = async () => {
    setLoadingAction("favorite");
    setError("");

    try {
      const result = await togglePostFavorite(post.id);
      setFavorited(result.favorited);
      router.refresh();
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    } finally {
      setLoadingAction("");
    }
  };

  const handleComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (commentValue.trim().length < 2) {
      setError("评论至少 2 个字符");
      return;
    }

    setLoadingAction("comment");
    setError("");

    try {
      const created = await createPostComment(post.id, commentValue.trim());
      setComments((current) => [...current, created]);
      setCommentValue("");
      router.refresh();
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    } finally {
      setLoadingAction("");
    }
  };

  return (
    <aside className="shrink-0 space-y-6 lg:w-96">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xs font-bold uppercase tracking-wider text-slate-400">互动概览</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center">
            <div className="mb-1 text-3xl font-black text-blue-600">{likes}</div>
            <div className="text-xs font-medium text-slate-500">点赞</div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center">
            <div className="mb-1 text-3xl font-black text-slate-900">{comments.length}</div>
            <div className="text-xs font-medium text-slate-500">评论</div>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <button
            type="button"
            disabled={loadingAction === "like"}
            onClick={() => void handleLike()}
            className={`w-full rounded-xl border py-3 text-sm font-bold transition-all ${
              liked
                ? "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            } disabled:opacity-50`}
          >
            {loadingAction === "like" ? "处理中..." : liked ? "已点赞" : "点赞帖子"}
          </button>

          <button
            type="button"
            disabled={loadingAction === "favorite"}
            onClick={() => void handleFavorite()}
            className={`w-full rounded-xl border py-3 text-sm font-bold transition-all ${
              favorited
                ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            } disabled:opacity-50`}
          >
            {loadingAction === "favorite" ? "处理中..." : favorited ? "已收藏" : "收藏帖子"}
          </button>
        </div>

        {error && <p className="mt-4 text-xs text-red-500">{error}</p>}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center justify-between text-lg font-bold text-slate-900">
          评论区
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-normal text-slate-500">{comments.length} 条</span>
        </h2>

        <form onSubmit={handleComment} className="mb-6 space-y-3">
          <textarea
            value={commentValue}
            onChange={(event) => setCommentValue(event.target.value)}
            rows={4}
            placeholder="写下你的评论..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            disabled={loadingAction === "comment"}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {loadingAction === "comment" ? "提交中..." : "发表评论"}
          </button>
        </form>

        <CommentThread comments={comments} />
      </section>
    </aside>
  );
}
