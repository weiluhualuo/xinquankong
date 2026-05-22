"use client";

import { useState } from "react";
import { createCommentReply, createPostComment, getStoredAuthToken, togglePostFavorite, togglePostLike } from "../lib/api";
import type { Comment, PostDetail } from "../lib/types";
import { CommentThread } from "./comment-thread";

function requireLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

function appendReplyToComments(items: Comment[], commentId: string, reply: Comment): Comment[] {
  return items.map((item) => {
    if (item.id === commentId) {
      return {
        ...item,
        replies: [...(item.replies ?? []), reply]
      };
    }

    if (item.replies && item.replies.length > 0) {
      return {
        ...item,
        replies: appendReplyToComments(item.replies, commentId, reply)
      };
    }

    return item;
  });
}

function countComments(items: Comment[]): number {
  return items.reduce((total, item) => total + 1 + countComments(item.replies ?? []), 0);
}

export function PostInteractions({ post }: { post: PostDetail }) {
  const [liked, setLiked] = useState(Boolean(post.isLiked));
  const [favorited, setFavorited] = useState(Boolean(post.isFavorited));
  const [likes, setLikes] = useState(post.metrics.likes);
  const [favorites, setFavorites] = useState(post.isFavorited ? 1 : 0);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState<"like" | "favorite" | "comment" | "reply" | "">("");
  const [busyCommentId, setBusyCommentId] = useState("");
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [favAnimating, setFavAnimating] = useState(false);

  const commentCount = countComments(comments);

  const ensureLogin = () => {
    if (!getStoredAuthToken()) {
      requireLogin();
      return false;
    }

    return true;
  };

  const handleToggleLike = async () => {
    if (!ensureLogin()) {
      return;
    }

    setBusyAction("like");
    setError("");
    setLikeAnimating(true);
    try {
      const result = await togglePostLike(post.id);
      setLiked(result.liked);
      setLikes((current) => Math.max(0, current + (result.liked ? 1 : -1)));
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "点赞失败");
    } finally {
      setBusyAction("");
      setTimeout(() => setLikeAnimating(false), 600);
    }
  };

  const handleToggleFavorite = async () => {
    if (!ensureLogin()) {
      return;
    }

    setBusyAction("favorite");
    setError("");
    setFavAnimating(true);
    try {
      const result = await togglePostFavorite(post.id);
      setFavorited(result.favorited);
      setFavorites((current) => Math.max(0, current + (result.favorited ? 1 : -1)));
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "收藏失败");
    } finally {
      setBusyAction("");
      setTimeout(() => setFavAnimating(false), 600);
    }
  };

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = commentContent.trim();
    if (!content) {
      setError("请输入评论内容");
      return;
    }

    if (!ensureLogin()) {
      return;
    }

    setBusyAction("comment");
    setError("");
    try {
      const created = await createPostComment(post.id, content);
      setComments((current) => [created, ...current]);
      setCommentContent("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "评论失败");
    } finally {
      setBusyAction("");
    }
  };

  const handleReplySubmit = async (commentId: string, content: string) => {
    if (!ensureLogin()) {
      return;
    }

    setBusyAction("reply");
    setBusyCommentId(commentId);
    setError("");
    try {
      const created = await createCommentReply(commentId, content);
      setComments((current) => appendReplyToComments(current, commentId, created));
    } catch (submitError) {
      throw (submitError instanceof Error ? submitError : new Error("回复失败"));
    } finally {
      setBusyAction("");
      setBusyCommentId("");
    }
  };

  return (
    <>
      {/* Mobile floating action bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-white/30 glass-strong px-4 py-2.5 lg:hidden" style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}>
        <button type="button" onClick={handleToggleLike} disabled={busyAction !== ""} className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium disabled:opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={`h-5 w-5 transition-transform ${liked ? "text-rose-500" : "text-slate-500"} ${likeAnimating ? "animate-heart-beat" : ""}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <span className={`transition-all ${liked ? "text-rose-500 font-semibold" : "text-slate-500"}`}>{likes}</span>
        </button>
        <button type="button" onClick={handleToggleFavorite} disabled={busyAction !== ""} className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium disabled:opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={`h-5 w-5 transition-transform ${favorited ? "text-amber-500" : "text-slate-500"} ${favAnimating ? "animate-scale-in" : ""}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
          <span className={`transition-all ${favorited ? "text-amber-500 font-semibold" : "text-slate-500"}`}>收藏</span>
        </button>
        <a href="#comments" className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
          </svg>
          <span>{commentCount}</span>
        </a>
      </div>

    <aside className="w-full shrink-0 animate-slide-in-right opacity-0 lg:w-[360px]" style={{ animationDelay: "200ms" }}>
      <div className="space-y-6 lg:sticky lg:top-24">
        <section className="rounded-3xl border border-cyan-100 bg-white/80 p-6 shadow-glass backdrop-blur-sm">
          <h2 className="text-lg font-bold text-slate-900">互动数据</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-sky-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">点赞</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{likes}</div>
            </div>
            <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-sky-50 to-cyan-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">收藏</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{favorites}</div>
            </div>
            <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-teal-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">评论</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{commentCount}</div>
            </div>
            <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">浏览</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{post.metrics.views}</div>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <button type="button" onClick={handleToggleLike} disabled={busyAction !== ""} className={`hover-lift rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 ${likeAnimating ? "animate-pulse-glow" : ""}`}>
              {liked ? "取消点赞" : "点赞帖子"}
            </button>
            <button type="button" onClick={handleToggleFavorite} disabled={busyAction !== ""} className={`hover-lift rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 disabled:opacity-50 ${favAnimating ? "animate-pulse-glow" : ""}`}>
              {favorited ? "取消收藏" : "收藏帖子"}
            </button>
          </div>
        </section>

        <section id="comments" className="rounded-3xl border border-cyan-100 bg-white/80 p-6 shadow-glass backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">评论区</h2>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-600">
              {commentCount} 条
            </span>
          </div>

          <form onSubmit={handleCommentSubmit} className="mt-5 space-y-3">
            <textarea
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
              rows={4}
              placeholder="写下你的看法"
              className="w-full rounded-2xl border border-cyan-200 bg-cyan-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
            />
            <button type="submit" disabled={busyAction !== ""} className="rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 disabled:opacity-50">
              发布评论
            </button>
          </form>

          {error && <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">{error}</div>}

          <div className="mt-6 border-t border-slate-100 pt-6">
            <CommentThread comments={comments} canReply={true} busyCommentId={busyCommentId} onReply={handleReplySubmit} />
          </div>
        </section>
      </div>
    </aside>
    </>
  );
}
