export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { PublishForm } from "../../../../components/publish-form";
import type { PublishFormInitialValues } from "../../../../components/publish-form";
import { ApiError, getBoards, getPost, getPostTypes, getTags } from "../../../../lib/api";

function ErrorState({ message }: { message: string }) {
  return <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 px-4 py-16"><div className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-10 text-center"><h1 className="text-2xl font-bold text-slate-900">编辑页加载失败</h1><p className="mt-3 text-sm text-slate-500">{message}</p><div className="mt-6"><Link href="/" className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white">返回首页</Link></div></div></div>;
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [post, boards, tags, postTypes] = await Promise.all([
      getPost(id),
      getBoards(),
      getTags(),
      getPostTypes()
    ]);

    if (!post) {
      notFound();
    }

    const initialValues: PublishFormInitialValues = {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt ?? "",
      content: post.content,
      boardSlug: post.board.slug,
      type: post.type,
      tagSlugs: post.tags.map((t) => t.slug),
      imageUrls: post.images.sort((a, b) => a.sortOrder - b.sortOrder).map((img) => img.imageUrl)
    };

    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-[#f8fafc] pb-24 pt-4 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10 hidden text-center md:block">
            <div className="mb-4 inline-block rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 shadow-sm">
              编辑帖子
            </div>
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              修改帖子内容
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              编辑标题、摘要、正文、板块、标签和图片。
            </p>
          </div>

          <h1 className="mb-4 text-lg font-bold text-slate-900 md:hidden">编辑帖子</h1>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 md:p-10">
            <PublishForm
              boards={boards}
              tags={tags}
              postTypes={postTypes}
              initialValues={initialValues}
              submitLabel="保存修改"
              submittingLabel="保存中..."
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "后端暂时不可用，请稍后再试";
    return <ErrorState message={message} />;
  }
}
