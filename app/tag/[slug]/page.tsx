export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "../../../components/post-card";
import { ApiError, getPostsByTag } from "../../../lib/api";

function ErrorState({ message }: { message: string }) {
  return <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 px-4 py-16"><div className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-10 text-center"><h1 className="text-2xl font-bold text-slate-900">标签页加载失败</h1><p className="mt-3 text-sm text-slate-500">{message}</p></div></div>;
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const posts = await getPostsByTag(slug);
    if (!posts.items.length) {
      return <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 px-4 py-16 text-slate-900"><div className="mx-auto max-w-5xl"><div className="mb-4 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">标签页</div><h1 className="text-4xl font-black">#{slug}</h1><p className="mt-4 text-lg text-slate-600">当前还没有公开帖子使用这个标签。</p><Link href="/boards" className="mt-6 inline-block text-sm font-medium text-sky-700 hover:underline">返回板块页</Link></div></div>;
    }
    return <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 px-4 py-16 text-slate-900"><div className="mx-auto max-w-5xl"><div className="mb-4 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">标签页</div><h1 className="text-4xl font-black">#{slug}</h1><p className="mt-4 text-lg text-slate-600">这里展示所有使用该标签的公开帖子。</p><section className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm md:px-10">{posts.items.map((post) => <PostCard key={post.id} post={post} />)}</section></div></div>;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    const message = error instanceof ApiError ? error.message : "后端暂时不可用，请稍后再试";
    return <ErrorState message={message} />;
  }
}