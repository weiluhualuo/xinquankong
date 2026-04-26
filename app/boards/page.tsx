import Link from "next/link";
import { getBoards, getTags } from "../../lib/api";

export default async function BoardsPage() {
  const [boards, tags] = await Promise.all([getBoards(), getTags()]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f8fafc] text-slate-900 font-sans py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <section className="mb-12 max-w-2xl">
          <div className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 border border-blue-100 shadow-sm mb-6">
            板块中心
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            板块是 v1 的一级入口。
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            先控制数量，把综合讨论、兴趣分享、求助问答、资源交流这四类内容跑起来。
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {boards.map((board) => (
            <Link key={board.id} href={`/board/${board.slug}`} className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300 transition-all hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 h-full">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-sm">
                    {board.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">{board.name}</h2>
                    <p className="text-sm text-slate-500">/{board.slug}</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {board.description}
                </p>
              </div>
              <div className="flex items-center text-blue-600 text-sm font-semibold mt-auto group-hover:translate-x-1 transition-transform">
                进入板块讨论 <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
            </Link>
          ))}
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
              标签只做主题辅助，不取代板块。
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Link key={tag.id} href={`/tag/${tag.name}`} className="inline-flex items-center rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200">
                <span className="text-slate-400 mr-1.5">#</span>{tag.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

