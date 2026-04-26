"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError, createForumPost } from "../lib/api";
import { BoardSummary, TagSummary } from "../lib/types";

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "发帖失败，请稍后重试";
}

export function PublishForm({ boards, tags }: { boards: BoardSummary[]; tags: TagSummary[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetBoard = searchParams.get("board") ?? boards[0]?.slug ?? "general";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBoard, setSelectedBoard] = useState(presetBoard);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [type, setType] = useState("SHARE");

  const boardOptions = useMemo(() => boards, [boards]);

  const toggleTag = (slug: string) => {
    setSelectedTags((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, slug];
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const title = String(formData.get("title") ?? "").trim();
      const excerpt = String(formData.get("excerpt") ?? "").trim();
      const content = String(formData.get("content") ?? "").trim();
      const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();
      const imageUrls = String(formData.get("imageUrls") ?? "")
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 6);

      if (selectedTags.length === 0) {
        throw new Error("至少选择一个标签");
      }

      const created = await createForumPost({
        title,
        excerpt,
        content,
        boardSlug: selectedBoard,
        type,
        ...(coverImageUrl ? { coverImageUrl } : {}),
        tagSlugs: selectedTags,
        ...(imageUrls.length ? { imageUrls } : {})
      });

      router.push(`/post/${created.id}`);
      router.refresh();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">{error}</div>
      )}

      <div>
        <label className="mb-2 block text-sm font-bold text-black">发布到哪个板块？ *</label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {boardOptions.map((board) => (
            <button
              key={board.id}
              type="button"
              onClick={() => setSelectedBoard(board.slug)}
              className={`rounded-md border px-4 py-3 text-center text-sm font-medium transition-all ${
                selectedBoard === board.slug
                  ? "border-black bg-black text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {board.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-black">标题 *</label>
          <input
            type="text"
            name="title"
            required
            minLength={6}
            maxLength={120}
            placeholder="用一句话概括你想表达的核心"
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-base font-medium transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-black">摘要 *</label>
          <textarea
            name="excerpt"
            required
            minLength={10}
            rows={2}
            placeholder="补充说明背景，让读者在列表页更有兴趣点进来"
            className="w-full resize-none rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-black">帖子类型 *</label>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="GENERAL">GENERAL</option>
            <option value="HELP">HELP</option>
            <option value="SHARE">SHARE</option>
            <option value="RESOURCE">RESOURCE</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-black">封面图 URL</label>
          <input
            type="url"
            name="coverImageUrl"
            placeholder="https://example.com/cover.jpg"
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-black">正文 *</label>
        <textarea
          name="content"
          required
          minLength={20}
          rows={12}
          placeholder="展开聊聊你的想法..."
          className="w-full min-h-[220px] resize-y rounded-md border border-neutral-200 bg-white p-4 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
        />
        <p className="mt-2 text-xs text-neutral-500">支持普通文本和 Markdown 内容，长度至少 20 个字符。</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-black">选择标签 *</label>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => {
            const active = selectedTags.includes(tag.slug);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.slug)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                #{tag.name}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-neutral-500">最多选择 3 个标签。</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-black">配图 URL（选填）</label>
        <textarea
          name="imageUrls"
          rows={4}
          placeholder="每行一个图片 URL，或使用逗号分隔，最多 6 张"
          className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="flex items-center justify-end gap-4 border-t border-neutral-100 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:text-black"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-11 items-center justify-center rounded-md bg-black px-8 font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "发布中..." : "确认发布"}
        </button>
      </div>
    </form>
  );
}
