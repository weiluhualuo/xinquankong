export const dynamic = "force-dynamic";

import Link from "next/link";
import { AnnouncementStrip } from "../components/announcement-strip";
import { PostCard } from "../components/post-card";
import { ApiError, getAnnouncements, getBoards, getHomepageContent, getPosts, getTags } from "../lib/api";

function ErrorState({ message }: { message: string }) {
  return <div className="min-h-screen bg-slate-50 px-4 py-20 text-slate-900"><div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm"><h1 className="text-2xl font-bold">首页加载失败</h1><p className="mt-3 text-sm text-slate-500">{message}</p><div className="mt-6"><Link href="/login" className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white">登录</Link></div></div></div>;
}

export default async function HomePage() {
  try {
    const [boards, latest, hot, tags, announcements, homepageContent] = await Promise.all([
      getBoards(),
      getPosts("latest"),
      getPosts("hot"),
      getTags(),
      getAnnouncements(),
      getHomepageContent()
    ]);

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <section className="relative mx-auto max-w-6xl px-4 py-20">
          <div className="relative max-w-4xl">
            <AnnouncementStrip announcements={announcements} />
            <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-foreground)]">{homepageContent.heroBadge}</div>
            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-6xl">{homepageContent.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{homepageContent.heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/publish" className="rounded-xl border border-slate-900 bg-slate-900 px-8 py-3 text-sm font-semibold text-white">写一篇帖子</Link>
              <Link href="/boards" className="rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-semibold">浏览板块</Link>
            </div>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="text-3xl font-bold">{boards.length}</div><div className="mt-2 font-semibold">板块</div><div className="mt-1 text-sm text-slate-500">先把讨论结构控制清楚。</div></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="text-3xl font-bold">{latest.total}</div><div className="mt-2 font-semibold">帖子</div><div className="mt-1 text-sm text-slate-500">最新公开讨论内容。</div></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="text-3xl font-bold">{tags.length}</div><div className="mt-2 font-semibold">标签</div><div className="mt-1 text-sm text-slate-500">辅助检索，不替代板块。</div></div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-0 py-0">
            <div className="bg-gradient-to-br from-white via-slate-50 to-[var(--accent)]">
              <div className="overflow-x-auto">
                <div className="flex min-w-max gap-0">
                  <section className="w-[220px] shrink-0 rounded-none border-r border-slate-200 bg-white p-0 shadow-none">
                    <div className="mb-5 flex items-end justify-between gap-3 px-5 pt-5">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Boards</div>
                        <h2 className="mt-2 text-xl font-black tracking-tight">精选板块</h2>
                      </div>
                      <Link href="/boards" className="text-xs font-semibold text-slate-500 hover:text-slate-900">全部</Link>
                    </div>
                    <div className="px-5 pb-5">
                      {boards.map((board, index) => (
                        <Link key={board.id} href={`/board/${board.slug}`} className={`block py-4 transition hover:bg-slate-50 ${index > 0 ? "border-t border-slate-200" : ""}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: board.color }} />
                                <span className="truncate text-sm font-bold text-slate-900">{board.name}</span>
                              </div>
                              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{board.description}</p>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className="text-base font-black text-slate-900">{board.postCount}</div>
                              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">帖子</div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-8 border-t border-slate-200 px-5 pt-6 pb-5">
                      <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Topics</div>
                      <h3 className="text-lg font-bold">热门标签</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span key={tag.id} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="w-[620px] shrink-0 rounded-none border-r border-slate-200 bg-white shadow-none overflow-hidden">
                    <div className="border-b border-slate-200 px-6 py-5">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Feed</div>
                          <h2 className="mt-2 text-xl font-black tracking-tight">最新帖子</h2>
                        </div>
                        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">{latest.total} 篇</div>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-200 px-6 py-2">
                      {latest.items.map((post) => <PostCard key={post.id} post={post} />)}
                    </div>
                  </section>

                  <section className="w-[300px] shrink-0 rounded-none bg-slate-50 shadow-none">
                    <div className="px-5 pt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Momentum</div>
                    <h2 className="mt-2 px-5 text-xl font-black tracking-tight">热门帖子</h2>
                    <div className="mt-5 space-y-3 px-5 pb-5">
                      {hot.items.slice(0, 5).map((post, index) => (
                        <Link key={post.id} href={`/post/${post.id}`} className="block rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300">
                          <div className="text-xs font-semibold text-slate-400">#{index + 1}</div>
                          <div className="mt-2 text-sm font-bold text-slate-900">{post.title}</div>
                          <div className="mt-2 text-xs text-slate-500">{post.metrics.likes} 赞 / {post.metrics.comments} 评论</div>
                        </Link>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "后端暂时不可用，请稍后再试";
    return <ErrorState message={message} />;
  }
}