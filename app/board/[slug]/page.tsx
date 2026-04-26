export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { PostCard } from "../../../components/post-card";
import { BoardActions } from "../../../components/board-actions";
import { getBoard } from "../../../lib/api";

export default async function BoardDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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
}