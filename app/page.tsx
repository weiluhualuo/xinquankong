export const dynamic = "force-dynamic";

import Link from "next/link";
import { BoardPanel } from "../components/board-panel";
import { PostCard } from "../components/post-card";
import { getBoards, getPosts, getTags } from "../lib/api";

export default async function HomePage() {
  const [boards, latest, hot, tags] = await Promise.all([
    getBoards(),
    getPosts("latest"),
    getPosts("hot"),
    getTags()
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 text-black font-sans selection:bg-black selection:text-white">
      <section className="mx-auto max-w-5xl px-4 py-20 md:py-32">
        <div className="flex flex-col gap-8">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-white px-4 py-1.5 text-xs font-semibold text-blue-600 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              公开讨论优先于关系链
            </span>
          </div>

          <div className="relative animate-slide-up">
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tighter text-black md:text-6xl lg:text-7xl">
              把有信息密度的兴趣帖子，
              <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 via-blue-500 to-slate-600 bg-clip-text text-transparent">
                  重新放回首页中心。
                </span>
                <span className="absolute inset-0 -z-0 bg-gradient-to-r from-blue-400 to-blue-300 opacity-40 blur-xl"></span>
              </span>
            </h1>
          </div>

          <p className="max-w-2xl animate-slide-up text-lg font-medium leading-relaxed text-slate-600 md:text-xl" style={{ animationDelay: "0.1s" }}>
            新权空的 v1 只做最核心的论坛动作：板块浏览、图文发帖、评论回复、收藏与审核。推荐算法暂时后置，把内容结构先做扎实。
          </p>

          <div className="flex flex-wrap gap-4 pt-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/publish" className="group relative inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/40 active:translate-y-0">
              <span className="relative z-10">写第一篇帖子</span>
              <span className="absolute inset-0 rounded-md bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            </Link>
            <Link href="/boards" className="group inline-flex h-12 items-center justify-center rounded-md border-2 border-slate-200 bg-white/80 px-8 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:text-blue-600 active:translate-y-0">
              逛板块
              <svg className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 border-t border-blue-100/50 pt-20 sm:grid-cols-3">
          {[
            { num: "4", title: "首发板块", desc: "先用少量板块承载内容，不做空分区" },
            { num: "图文帖", title: "统一内容模型", desc: "标题、摘要、正文与配图的纯粹组合" },
            { num: "先发后审", title: "保障流动性", desc: "配合前端举报与后台审核机制" }
          ].map((item, index) => (
            <div key={index} className="group relative rounded-2xl border border-blue-100/50 bg-gradient-to-br from-white to-blue-50/30 p-6 transition-all duration-500 hover:border-blue-200 hover:shadow-glow-sm">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-2 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent">{item.num}</div>
                <div className="font-semibold text-slate-800">{item.title}</div>
                <div className="mt-1 text-sm text-slate-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-blue-100/50 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight">精选板块</h2>
            <Link href="/boards" className="group flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600">
              查看全部
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {boards.map((board) => (
              <BoardPanel key={board.id} board={board} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-blue-100/50">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-8">
              <h2 className="mb-8 text-2xl font-bold tracking-tight">最新发布</h2>
              <div className="divide-y divide-blue-100/50">
                {latest.items.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            <div className="space-y-16 pt-8 lg:col-span-4 lg:pt-0">
              <div>
                <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400">社区热帖</h3>
                <div className="flex flex-col gap-4">
                  {hot.items.slice(0, 5).map((post, index) => (
                    <Link key={post.id} href={`/post/${post.id}`} className="group relative flex items-start gap-4 rounded-xl border border-transparent p-4 transition-all duration-300 hover:border-blue-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent">
                      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 transition-all duration-300 group-hover:from-blue-100 group-hover:to-blue-50">
                        <span className="text-sm font-bold text-slate-400 transition-colors group-hover:text-blue-500">{index + 1}</span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 line-clamp-2 text-sm font-bold leading-tight transition-colors group-hover:text-blue-600">{post.title}</div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                          <span>{post.metrics.likes} 赞</span>
                          <span>·</span>
                          <span>{post.metrics.comments} 评论</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400">热门标签</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag.id} className="inline-flex items-center rounded border border-blue-100 px-3 py-1.5 text-xs font-bold text-blue-500">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

