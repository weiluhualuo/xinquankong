export const dynamic = "force-dynamic";

import Link from "next/link";
import { PostCard } from "../../components/post-card";
import { getMe, getPosts } from "../../lib/api";

export default async function MePage() {
  const [me, followingPosts] = await Promise.all([getMe(), getPosts("following")]);

  if (!me) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-slate-900">尚未登录</h1>
          <p className="mb-6 text-slate-500">请先登录以查看个人主页</p>
          <Link href="/login" className="inline-flex h-10 items-center justify-center rounded-md bg-black px-8 font-medium text-white transition-colors hover:bg-neutral-800">
            去登录
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f8fafc] py-12 text-slate-900 md:py-20">
      <div className="mx-auto max-w-4xl space-y-10 px-4">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="absolute right-0 top-0 -z-10 h-64 w-64 rounded-bl-full bg-blue-50"></div>
          <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-3xl font-bold text-slate-400 shadow-md">
              {me.profile.displayName.charAt(0)}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                <h1 className="text-2xl font-bold text-slate-900">{me.profile.displayName}</h1>
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">@{me.username}</span>
                  {me.profile.joinedLabel && <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">{me.profile.joinedLabel}</span>}
                </div>
              </div>
              <p className="mb-6 max-w-lg leading-relaxed text-slate-600">{me.profile.bio || "这个人很懒，还没写简介。"}</p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 sm:justify-start">
                <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500"></span>状态: {me.status}</div>
                <div>加入于: {new Date(me.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-8 py-6">
            <h2 className="text-xl font-bold text-slate-900">关注的动态</h2>
          </div>
          <div className="px-8 pb-4">
            {followingPosts.items.length === 0 ? (
              <div className="py-20 text-center">
                <h3 className="mb-2 text-lg font-medium text-slate-900">暂无动态</h3>
                <p className="mb-6 text-sm text-slate-500">你关注的板块最近还没有发布新内容。</p>
                <Link href="/boards" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">去探索更多板块 →</Link>
              </div>
            ) : (
              followingPosts.items.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
