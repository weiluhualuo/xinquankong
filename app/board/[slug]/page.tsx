export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "../../../components/post-card";
import { BoardActions } from "../../../components/board-actions";
import { ApiError, getBoard } from "../../../lib/api";

function ErrorState({ message }: { message: string }) {
  return <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 px-4 py-16"><div className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-10 text-center"><h1 className="text-2xl font-bold text-slate-900">板块详情加载失败</h1><p className="mt-3 text-sm text-slate-500">{message}</p><div className="mt-6"><Link href="/boards" className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white">返回板块页</Link></div></div></div>;
}

export default async function BoardDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const board = await getBoard(slug);

    if (!board) {
      notFound();
    }

    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-[#f8fafc] font-sans text-slate-900">
        <div className="relative overflow-hidden border-b border-slate-200" style={{ backgroundColor: `${board.color}08` }}>
          <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 md:py-24">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: board.color }} aria-hidden="true" />
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Board</span>
                </div>

                <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">{board.name}</h1>
                <p className="text-lg font-medium leading-relaxed text-slate-600">{board.description}</p>
              </div>

              <BoardActions
                slug={board.slug}
                color={board.color}
                isFollowing={Boolean(board.isFollowing)}
                postCount={board.postCount}
                followerCount={board.followerCount}
              />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex gap-6">
              <span className="-mb-[18px] border-b-2 border-slate-900 pb-4 text-sm font-bold text-slate-900">最新动态</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm md:px-10">
            {board.posts.length === 0 ? (
              <div className="py-24 text-center">
                <h3 className="mb-2 text-lg font-bold text-slate-900">板块还在冷启动</h3>
                <p className="text-slate-500">做第一个在这里留下足迹的人吧。</p>
              </div>
            ) : (
              board.posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "后端暂时不可用，请稍后再试";
    return <ErrorState message={message} />;
  }
}
