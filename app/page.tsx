export const dynamic = "force-dynamic";

import Link from "next/link";
import { AnimateOnScroll } from "../components/animate-on-scroll";
import { AnnouncementStrip } from "../components/announcement-strip";
import { MobilePostsTabs } from "../components/mobile-posts-tabs";
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
        <section className="relative mx-auto max-w-6xl px-4 py-12 md:py-20">
          <div className="absolute -top-20 -left-20 h-72 w-72 animate-morph bg-cyan-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -top-10 right-0 h-60 w-60 animate-morph bg-sky-400/15 blur-3xl pointer-events-none" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-0 left-1/2 h-48 w-48 animate-morph bg-teal-400/10 blur-3xl pointer-events-none" style={{ animationDelay: "4s" }} />
          <div className="relative max-w-4xl">
            <AnnouncementStrip announcements={announcements} />
            <div className="animate-slide-in-up opacity-0 inline-flex rounded-full border border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">{homepageContent.heroBadge}</div>
            <h1 className="mt-4 animate-slide-in-up opacity-0 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl" style={{ animationDelay: "100ms" }}>
              <span className="gradient-text">{homepageContent.heroTitle}</span>
            </h1>
            <p className="mt-4 animate-slide-in-up opacity-0 max-w-2xl text-base leading-7 text-slate-600 md:text-lg md:leading-8" style={{ animationDelay: "200ms" }}>{homepageContent.heroDescription}</p>
            <div className="mt-6 animate-slide-in-up opacity-0 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4" style={{ animationDelay: "300ms" }}>
              <Link href="/publish" className="hover-lift rounded-xl bg-gradient-to-r from-cyan-600 to-sky-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-xl hover:shadow-cyan-500/30">写一篇帖子</Link>
              <Link href="/boards" className="glass hover-glow rounded-xl px-6 py-3 text-center text-sm font-semibold text-cyan-700 transition hover:bg-white/80">浏览板块</Link>
            </div>
          </div>
        </section>

        {/* Mobile: boards horizontal scroll */}
        <section className="border-t border-cyan-100 bg-white/50 lg:hidden">
          <div className="px-4 py-5">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">Boards</div>
            <h2 className="mt-2 text-lg font-black tracking-tight">精选板块</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-5" style={{ WebkitOverflowScrolling: "touch" }}>
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/board/${board.slug}`}
                className="hover-lift flex w-40 shrink-0 flex-col rounded-2xl glass p-4 transition hover:-translate-y-0.5 hover:shadow-glow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: board.color }} />
                  <span className="truncate text-sm font-bold text-slate-900">{board.name}</span>
                </div>
                <p className="mt-2 line-clamp-2 flex-1 text-xs leading-5 text-slate-500">{board.description}</p>
                <div className="mt-3 text-xs font-semibold text-slate-400">{board.postCount} 帖子</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mobile: posts with tab switching */}
        <section className="border-t border-cyan-100 bg-white/50 lg:hidden">
          <div className="px-4 pt-5">
            <MobilePostsTabs
              latestContent={
                <div className="divide-y divide-slate-200 px-4">
                  {latest.items.map((post) => <PostCard key={`m-l-${post.id}`} post={post} />)}
                </div>
              }
              hotContent={
                <div className="space-y-3 px-4">
                  {hot.items.slice(0, 5).map((post, index) => (
                    <Link key={`m-h-${post.id}`} href={`/post/${post.id}`} className="block rounded-2xl glass p-4 transition hover:-translate-y-0.5 hover:shadow-glow-sm">
                      <div className={`text-xs font-semibold ${index < 3 ? "text-cyan-600" : "text-slate-400"}`}>#{index + 1}</div>
                      <div className="mt-2 text-sm font-bold text-slate-900">{post.title}</div>
                      <div className="mt-2 text-xs text-slate-500">{post.metrics.likes} 赞 / {post.metrics.comments} 评论</div>
                    </Link>
                  ))}
                </div>
              }
            />
          </div>
          <div className="px-4 pb-5">
            <div className="mt-6 border-t border-cyan-100 pt-5">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">Topics</div>
              <h3 className="text-base font-bold">热门标签</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag.id} className="rounded-full border border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Desktop: 3-column layout */}
        <section className="hidden border-t border-cyan-100 bg-white/50 lg:block">
          <div className="mx-auto max-w-6xl px-0 py-0">
            <div className="bg-gradient-to-br from-white via-cyan-50/30 to-sky-50/20">
              <div className="grid grid-cols-[220px_1fr_300px]">
                  <AnimateOnScroll animation="fade-left" className="rounded-none border-b border-cyan-100 bg-white/60 p-0 shadow-none border-b-0 border-r backdrop-blur-sm">
                    <div className="mb-5 flex items-end justify-between gap-3 px-5 pt-5">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">Boards</div>
                        <h2 className="mt-2 text-xl font-black tracking-tight">精选板块</h2>
                      </div>
                      <Link href="/boards" className="text-xs font-semibold text-cyan-500 hover:text-cyan-700">全部</Link>
                    </div>
                    <div className="px-5 pb-5">
                      {boards.map((board, index) => (
                        <Link key={board.id} href={`/board/${board.slug}`} className={`block py-4 transition-all hover:bg-cyan-50/50 ${index > 0 ? "border-t border-cyan-100" : ""}`}>
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

                    <div className="mt-8 border-t border-cyan-100 px-5 pt-6 pb-5">
                      <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">Topics</div>
                      <h3 className="text-lg font-bold">热门标签</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span key={tag.id} className="rounded-full border border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </AnimateOnScroll>

                  <AnimateOnScroll animation="fade-up" delay={100} className="rounded-none border-b border-cyan-100 bg-white/80 shadow-none overflow-hidden min-w-0 border-b-0 border-r backdrop-blur-sm">
                    <div className="border-b border-cyan-100 px-6 py-5">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">Feed</div>
                          <h2 className="mt-2 text-xl font-black tracking-tight">最新帖子</h2>
                        </div>
                        <div className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-600">{latest.total} 篇</div>
                      </div>
                    </div>
                    <div className="divide-y divide-cyan-100 px-6 py-2">
                      {latest.items.map((post) => <PostCard key={post.id} post={post} />)}
                    </div>
                  </AnimateOnScroll>

                  <AnimateOnScroll animation="fade-right" delay={200} className="rounded-none bg-gradient-to-b from-cyan-50/50 to-sky-50/30 shadow-none">
                    <div className="px-5 pt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">Momentum</div>
                    <h2 className="mt-2 px-5 text-xl font-black tracking-tight">热门帖子</h2>
                    <div className="mt-5 space-y-3 px-5 pb-5">
                      {hot.items.slice(0, 5).map((post, index) => (
                        <Link key={post.id} href={`/post/${post.id}`} className="hover-lift block rounded-2xl glass p-4 transition hover:-translate-y-0.5 hover:shadow-glow-sm">
                          <div className={`text-xs font-semibold ${index < 3 ? "text-cyan-600" : "text-slate-400"}`}>#{index + 1}</div>
                          <div className="mt-2 text-sm font-bold text-slate-900">{post.title}</div>
                          <div className="mt-2 text-xs text-slate-500">{post.metrics.likes} 赞 / {post.metrics.comments} 评论</div>
                        </Link>
                      ))}
                    </div>
                  </AnimateOnScroll>
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