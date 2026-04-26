import Link from "next/link";
import { PostCard } from "../../components/post-card";
import { getMe, getPosts } from "../../lib/api";

export default async function MePage() {
  const [me, followingPosts] = await Promise.all([getMe(), getPosts("following")]);

  if (!me) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">尚未登录</h1>
          <p className="text-slate-500 mb-6">请先登录以查看个人主页</p>
          <Link href="/login" className="inline-flex h-10 items-center justify-center rounded-md bg-black px-8 font-medium text-white transition-colors hover:bg-neutral-800">
            去登录
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f8fafc] text-slate-900 font-sans py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4 space-y-10">
        
        {/* Profile Card */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-10 relative overflow-hidden">
          {/* 装饰背景 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full -z-10"></div>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-slate-400 shrink-0">
              {me.profile.displayName.charAt(0)}
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{me.profile.displayName}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                    @{me.username}
                  </span>
                  {me.profile.joinedLabel && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                      {me.profile.joinedLabel}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-slate-600 mb-6 max-w-lg leading-relaxed">
                {me.profile.bio || "这个人很懒，还没写简介。"}
              </p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  状态: {me.status}
                </div>
                <div>加入于: {new Date(me.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="shrink-0 mt-4 sm:mt-0">
              <button className="px-6 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-sm font-medium rounded-lg transition-colors shadow-sm">
                编辑资料
              </button>
            </div>
          </div>
        </section>

        {/* 关注的动态 */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              关注的动态
            </h2>
          </div>
          
          <div className="px-8 pb-4">
            {followingPosts.items.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">暂无动态</h3>
                <p className="text-slate-500 text-sm mb-6">你关注的板块或用户最近没有发布新内容。</p>
                <Link href="/boards" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                  去探索更多板块 →
                </Link>
              </div>
            ) : (
              followingPosts.items.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
