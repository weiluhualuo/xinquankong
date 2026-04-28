import Link from "next/link";
import { PostSummary } from "../lib/types";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <div className="group -mx-4 rounded-xl border-b border-slate-100 px-4 py-6 transition-all duration-300 last:border-0 hover:bg-[linear-gradient(90deg,rgba(159,196,234,0.12),transparent)]">
      <div className="mb-3 flex items-center gap-3">
        <Link
          href={`/board/${post.board.slug}`}
          className="rounded-md border border-[var(--border)] bg-[var(--accent)] px-2.5 py-1 text-xs font-bold text-[var(--accent-foreground)] transition hover:border-[var(--primary)] hover:bg-[rgba(159,196,234,0.22)]"
        >
          {post.board.name}
        </Link>
        <span className="text-slate-300">·</span>
        <span className="text-xs font-medium text-slate-500">
          {post.author.displayName}
        </span>
        <span className="text-slate-300">·</span>
        <span className="text-xs text-slate-400">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <Link href={`/post/${post.id}`} className="block group/title">
        <h3 className="mb-3 text-xl font-bold leading-tight text-slate-900 transition-colors duration-300 group-hover/title:text-[var(--accent-foreground)]">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mb-4 text-sm leading-relaxed text-slate-500 transition-colors group-hover/title:text-slate-600 line-clamp-2">
            {post.excerpt}
          </p>
        )}
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="rounded px-2 py-0.5 text-xs text-slate-400 transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            >
              #{tag.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
          <div className="flex cursor-pointer items-center gap-1.5 transition-colors duration-300 group-hover:text-[var(--accent-foreground)]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
            </svg>
            {post.metrics.likes}
          </div>
          <div className="flex cursor-pointer items-center gap-1.5 transition-colors duration-300 group-hover:text-[var(--accent-foreground)]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            {post.metrics.comments}
          </div>
        </div>
      </div>
    </div>
  );
}