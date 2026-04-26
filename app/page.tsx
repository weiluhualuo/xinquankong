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
      {/* 顶部 Hero 区域 */}
      <section className="mx-auto max-w-5xl px-4 py-20 md:py-32">
        <div className="flex flex-col gap-8">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-white px-4 py-1.5 text-xs font-semibold text-blue-600 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              公开讨论优先于关系链
            </span>
          </div>

          {/* 标题区域带高光效果 */}
          <div className="relative animate-slide-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-black leading-[1.1]">
              把有信息密度的兴趣帖子，
              <br className="hidden md:block"/>
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 via-blue-500 to-slate-600 bg-clip-text text-transparent">
                  重新放回首页中心。
                </span>
                <span className="absolute inset-0 blur-xl opacity-40 bg-gradient-to-r from-blue-400 to-blue-300 -z-0"></span>
              </span>
            </h1>
          </div>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
            新泉空的 v1 只做最核心的论坛动作：板块浏览、图文发帖、评论回复、收藏与审核。推荐算法暂时后置，把内容结构先做扎实。
          </p>

          <div className="flex flex-wrap gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/publish" className="group relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 h-12 px-8 py-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0">
              <span className="relative z-10">写第一篇帖子</span>
              <span className="absolute inset-0 rounded-md bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link href="/boards" className="group inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 border-2 border-slate-200 bg-white/80 backdrop-blur-sm hover:border-blue-300 hover:bg-white hover:text-blue-600 hover:-translate-y-0.5 active:translate-y-0 h-12 px-8 py-2">
              逛板块
              <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 极简数据条 - 带发光卡片效果 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-20 mt-20 border-t border-blue-100/50">
          {[
            { num: "4", title: "首发板块", desc: "先用少量板块承载内容，不做空分区" },
            { num: "图文帖", title: "统一内容模型", desc: "标题、摘要、正文与配图的纯粹组合" },
            { num: "先发后审", title: "保障流动性", desc: "配合前端举报与后台审核机制" }
          ].map((item, i) => (
            <div
              key={i}
              className="group relative p-6 rounded-2xl border border-blue-100/50 bg-gradient-to-br from-white to-blue-50/30 hover:border-blue-200 hover:shadow-glow-sm transition-all duration-500 animate-slide-up"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  {item.num}
                </div>
                <div className="font-semibold text-slate-800">{item.title}</div>
                <div className="text-sm text-slate-500 mt-1">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 版块区域 */}
      <section className="border-t border-blue-100/50 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">精选板块</h2>
            </div>
            <Link href="/boards" className="group text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2">
              查看全部
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {boards.map((board, i) => (
              <div
                key={board.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <BoardPanel board={board} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 主体内容网格 */}
      <section className="border-t border-blue-100/50">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

            {/* 左侧：最新发布 */}
            <div className="lg:col-span-8">
              <h2 className="text-2xl font-bold tracking-tight mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                最新发布
              </h2>

              <div className="divide-y divide-blue-100/50">
                {latest.items.map((post, i) => (
                  <div
                    key={post.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧：热帖与标签 */}
            <div className="lg:col-span-4 space-y-16 pt-8 lg:pt-0">

              {/* 热帖 */}
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </span>
                  社区热帖
                </h3>
                <div className="flex flex-col gap-4">
                  {hot.items.slice(0, 5).map((post, i) => (
                    <Link
                      key={post.id}
                      href={`/post/${post.id}`}
                      className="group relative flex gap-4 items-start p-4 rounded-xl border border-transparent hover:border-blue-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-300"
                    >
                      <span className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 group-hover:from-blue-100 group-hover:to-blue-50 transition-all duration-300">
                        <span className="text-sm font-bold text-slate-400 group-hover:text-blue-500 transition-colors">{i + 1}</span>
                        {i < 3 && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"></span>
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm leading-tight mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </div>
                        <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            {post.metrics.likes}
                          </span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {post.metrics.comments}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 标签 */}
              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </span>
                  热门标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <Link
                      key={tag.id}
                      href={`/tag/${tag.name}`}
                      className="group relative inline-flex items-center border border-blue-100 px-3 py-1.5 text-xs font-bold text-blue-500 transition-all duration-300 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:shadow-glow-sm hover:-translate-y-0.5"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <span className="relative z-10">#{tag.name}</span>
                    </Link>
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
