"use client";

import { useState } from "react";
import type { Comment } from "../lib/types";

type CommentThreadProps = {
  comments: Comment[];
  canReply?: boolean;
  busyCommentId?: string;
  onReply?: (commentId: string, content: string) => Promise<void>;
};

export function CommentThread({ comments, canReply = false, busyCommentId = "", onReply }: CommentThreadProps) {
  if (comments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
        <p className="text-sm font-medium text-slate-500">还没有评论，来做第一个发言的人吧。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {comments.map((comment, index) => (
        <div key={comment.id} className="animate-slide-in-up opacity-0" style={{ animationDelay: `${index * 80}ms` }}>
          <CommentItem
            comment={comment}
            canReply={canReply}
            busyCommentId={busyCommentId}
            onReply={onReply}
          />
        </div>
      ))}
    </div>
  );
}

type CommentItemProps = {
  comment: Comment;
  isReply?: boolean;
  canReply: boolean;
  busyCommentId: string;
  onReply?: (commentId: string, content: string) => Promise<void>;
};

function CommentItem({ comment, isReply = false, canReply, busyCommentId, onReply }: CommentItemProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState("");
  const hasReply = Array.isArray(comment.replies) && comment.replies.length > 0;
  const isBusy = busyCommentId === comment.id;
  const replyDisabled = !canReply || isReply || comment.isDeleted || hasReply || !onReply;

  const handleReplySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = replyContent.trim();
    if (!content) {
      setReplyError("请输入回复内容");
      return;
    }

    if (!onReply) {
      return;
    }

    setReplyError("");
    try {
      await onReply(comment.id, content);
      setReplyContent("");
      setReplyOpen(false);
    } catch (error) {
      setReplyError(error instanceof Error ? error.message : "回复失败");
    }
  };

  return (
    <div className={`${isReply ? "ml-12 mt-6 border-l-2 border-slate-100 pl-6" : ""}`}>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-bold text-slate-500">
          {comment.author.displayName.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-bold text-black">{comment.author.displayName}</span>
            {comment.author.id === "admin" && (
              <span className="rounded border border-slate-900 bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">MOD</span>
            )}
            <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>

          <div className="mb-3 text-sm leading-relaxed text-slate-700">
            {comment.isDeleted ? <span className="italic text-slate-400">该评论已被删除</span> : comment.content}
          </div>

          {!replyDisabled && (
            <button
              type="button"
              onClick={() => {
                setReplyOpen((current) => !current);
                setReplyError("");
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {replyOpen ? "收起回复" : "回复"}
            </button>
          )}

          {replyOpen && !replyDisabled && (
            <form onSubmit={handleReplySubmit} className="mt-4 animate-slide-in-up space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <textarea
                value={replyContent}
                onChange={(event) => setReplyContent(event.target.value)}
                rows={3}
                placeholder={`回复 ${comment.author.displayName}`}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--primary-strong)]"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isBusy}
                  className="rounded-2xl border border-[var(--primary)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
                >
                  {isBusy ? "处理中..." : "提交回复"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyOpen(false);
                    setReplyContent("");
                    setReplyError("");
                  }}
                  disabled={isBusy}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                >
                  取消
                </button>
              </div>
              {replyError && <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">{replyError}</div>}
            </form>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isReply={true}
              canReply={canReply}
              busyCommentId={busyCommentId}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
