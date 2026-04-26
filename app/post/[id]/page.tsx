import Image from "next/image";
import { notFound } from "next/navigation";
import { getPost } from "../../../lib/api";
import { PostInteractions } from "../../../components/post-interactions";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f8fafc] py-10 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 lg:flex-row">
        <article className="min-w-0 flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="p-8 md:p-12">
            <div className="mb-6 flex items-center gap-3">
              <span
                className="rounded-full border px-3 py-1 text-xs font-bold"
                style={{ borderColor: post.board.color, color: post.board.color, backgroundColor: `${post.board.color}15` }}
              >
                {post.board.name}
              </span>
              <span className="text-sm text-slate-500">{new Date(post.createdAt).toLocaleDateString("zh-CN")}</span>
            </div>

            <h1 className="mb-6 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">{post.title}</h1>

            <div className="mb-10 flex items-center gap-3 border-b border-slate-100 pb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-600">
                {post.author.displayName.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-slate-900">{post.author.displayName}</div>
                <div className="text-xs text-slate-500">{post.metrics.views} 次浏览</div>
              </div>
            </div>

            {post.excerpt && (
              <p className="mb-10 rounded-r-xl border-l-4 border-blue-500 bg-slate-50 py-4 pl-6 text-xl font-medium leading-relaxed text-slate-600">
                {post.excerpt}
              </p>
            )}

            {post.coverImageUrl ? (
              <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <Image src={post.coverImageUrl} alt="帖子封面" fill className="object-cover" sizes="100vw" />
              </div>
            ) : null}

            <div className="prose prose-slate max-w-none text-lg">
              <p className="whitespace-pre-wrap leading-loose">{post.content}</p>
            </div>

            {post.images.length ? (
              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {post.images.map((image) => (
                  <div key={image.id} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <Image src={image.imageUrl} alt="帖子配图" fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </article>

        <PostInteractions post={post} />
      </div>
    </div>
  );
}
