"use client";

import { Comment } from "../lib/types";

export function CommentThread({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
        <p className="text-sm font-medium text-slate-500">还没有评论，来做第一个发言的人吧。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
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
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );
}
