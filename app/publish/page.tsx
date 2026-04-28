export const dynamic = "force-dynamic";

import { PublishForm } from "../../components/publish-form";
import { getBoards, getPostTypes, getTags } from "../../lib/api";

export default async function PublishPage() {
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
}