"use client";

import { useState } from "react";
import { createPostComment, getStoredAuthToken, togglePostFavorite, togglePostLike } from "../lib/api";
import type { Comment, PostDetail } from "../lib/types";
import { CommentThread } from "./comment-thread";

function requireLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export function PostInteractions({ post }: { post: PostDetail }) {
  const [liked, setLiked] = useState(Boolean(post.isLiked));
  const [favorited, setFavorited] = useState(Boolean(post.isFavorited));
  const [likes, setLikes] = useState(post.metrics.likes);
  const [favorites, setFavorites] = useState(post.isFavorited ? 1 : 0);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState<"like" | "favorite" | "comment" | "">("");

  const commentCount = comments.length;

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
    try {
      const result = await togglePostLike(post.id);
      setLiked(result.liked);
      setLikes((current) => Math.max(0, current + (result.liked ? 1 : -1)));
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "点赞失败");
    } finally {
      setBusyAction("");
    }
  };

  const handleToggleFavorite = async () => {
    if (!ensureLogin()) {
      return;
    }

    setBusyAction("favorite");
    setError("");
    try {
      const result = await togglePostFavorite(post.id);
      setFavorited(result.favorited);
      setFavorites((current) => Math.max(0, current + (result.favorited ? 1 : -1)));
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "收藏失败");
    } finally {
      setBusyAction("");
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
      // Author: 花落 | MIT License. Keep the client comment list responsive after submission.
      const created = await createPostComment(post.id, content);
      setComments((current) => [created, ...current]);
      setCommentContent("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "评论失败");
    } finally {
      setBusyAction("");
    }
  };

  return (
    <aside className="w-full shrink-0 lg:w-[360px]">
      <div className="space-y-6 lg:sticky lg:top-24">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">互动数据</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">点赞</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{likes}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">收藏</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{favorites}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">评论</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{commentCount}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">浏览</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{post.metrics.views}</div>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <button type="button" onClick={handleToggleLike} disabled={busyAction !== ""} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {liked ? "取消点赞" : "点赞帖子"}
            </button>
            <button type="button" onClick={handleToggleFavorite} disabled={busyAction !== ""} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 disabled:opacity-50">
              {favorited ? "取消收藏" : "收藏帖子"}
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">评论区</h2>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
              {commentCount} 条
            </span>
          </div>

          <form onSubmit={handleCommentSubmit} className="mt-5 space-y-3">
            <textarea
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
              rows={4}
              placeholder="写下你的看法"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--primary-strong)] focus:bg-white"
            />
            <button type="submit" disabled={busyAction !== ""} className="rounded-2xl border border-[var(--primary)] bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-slate-900 disabled:opacity-50">
              发布评论
            </button>
          </form>

          {error && <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">{error}</div>}

          <div className="mt-6 border-t border-slate-100 pt-6">
            <CommentThread comments={comments} />
          </div>
        </section>
      </div>
    </aside>
  );
}