export const dynamic = "force-dynamic";

import Link from "next/link";
import { ApiError, getBoards, getTags } from "../../lib/api";

function ErrorState({ message }: { message: string }) {
  return <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 px-4 py-16"><div className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-10 text-center"><h1 className="text-2xl font-bold text-slate-900">板块页加载失败</h1><p className="mt-3 text-sm text-slate-500">{message}</p></div></div>;
}

export default async function BoardsPage() {
  try {
    const [boards, tags] = await Promise.all([getBoards(), getTags()]);
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 py-16 text-slate-900">
        <div className="mx-auto max-w-6xl px-4">
          <section className="mb-12 max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">板块中心</div>
            <h1 className="text-4xl font-black tracking-tight">浏览社区板块</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">板块负责划分主题，标签只负责辅助检索，不替代板块结构。</p>
          </section>
          <div className="grid gap-6 md:grid-cols-2">{boards.map((board) => <Link key={board.id} href={`/board/${board.slug}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: board.color }} /><div><h2 className="text-xl font-bold">{board.name}</h2><p className="text-sm text-slate-500">/{board.slug}</p></div></div><p className="mt-4 text-sm leading-7 text-slate-600">{board.description}</p><div className="mt-4 text-sm font-semibold text-sky-700">进入板块</div></Link>)}</div>
          <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><h2 className="text-2xl font-bold">可用标签</h2><div className="mt-5 flex flex-wrap gap-3">{tags.map((tag) => <span key={tag.id} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">#{tag.name}</span>)}</div></section>
        </div>
      </div>
    );
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "后端暂时不可用，请稍后再试";
    return <ErrorState message={message} />;
  }
}