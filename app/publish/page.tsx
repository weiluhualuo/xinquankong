export const dynamic = "force-dynamic";

import Link from "next/link";
import { PublishForm } from "../../components/publish-form";
import { ApiError, getBoards, getPostTypes, getTags } from "../../lib/api";

function ErrorState({ message }: { message: string }) {
  return <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 px-4 py-16"><div className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-10 text-center"><h1 className="text-2xl font-bold text-slate-900">发帖页加载失败</h1><p className="mt-3 text-sm text-slate-500">{message}</p><div className="mt-6"><Link href="/" className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white">返回首页</Link></div></div></div>;
}

export default async function PublishPage() {
  try {
    const [boards, tags, postTypes] = await Promise.all([getBoards(), getTags(), getPostTypes()]);

    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-[#f8fafc] py-10 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-block rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 shadow-sm">
              发布帖子
            </div>
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              V1 先把图文发帖流程做好
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              标题、摘要、正文、板块、标签和图片，已经足够把论坛的内容密度跑起来。
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 md:p-10">
            <PublishForm boards={boards} tags={tags} postTypes={postTypes} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "后端暂时不可用，请稍后再试";
    return <ErrorState message={message} />;
  }
}
