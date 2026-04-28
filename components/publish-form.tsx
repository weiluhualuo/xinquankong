"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError, createForumPost } from "../lib/api";
import type { BoardSummary, PostTypeOptionRecord, TagSummary } from "../lib/types";

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "发帖失败，请稍后再试。";
}

export function PublishForm({ boards, tags, postTypes }: { boards: BoardSummary[]; tags: TagSummary[]; postTypes: PostTypeOptionRecord[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetBoard = searchParams.get("board") ?? boards[0]?.slug ?? "general";
  const activePostTypes = useMemo(() => postTypes.filter((item) => item.isActive), [postTypes]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBoard, setSelectedBoard] = useState(presetBoard);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [type, setType] = useState(activePostTypes[0]?.value ?? "");
  const boardOptions = useMemo(() => boards, [boards]);
  const selectedBoardMeta = boardOptions.find((board) => board.slug === selectedBoard) ?? boardOptions[0];
  const selectedTypeMeta = activePostTypes.find((item) => item.value === type) ?? activePostTypes[0];

  const toggleTag = (slug: string) => {
    setSelectedTags((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : current.length >= 3
          ? current
          : [...current, slug]
    );
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

      if (!type) {
        throw new Error("当前没有可用的帖子类型，请联系管理员先创建帖子类型");
      }

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
      {error && <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700">{error}</div>}

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Board</div>
              <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900">选择板块</h2>
            </div>
            {selectedBoardMeta && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                当前：{selectedBoardMeta.name}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {boardOptions.map((board) => {
              const active = selectedBoard === board.slug;
              return (
                <button
                  key={board.id}
                  type="button"
                  onClick={() => setSelectedBoard(board.slug)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-[var(--accent)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: board.color }} />
                    <span className="text-sm font-bold">{board.name}</span>
                  </div>
                  <div className={`mt-2 text-xs leading-5 ${active ? "text-slate-200" : "text-slate-500"}`}>
                    {board.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Type</div>
              <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900">帖子类型</h2>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              当前：{selectedTypeMeta?.label ?? "未选择"}
            </span>
          </div>
          {activePostTypes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
              当前没有可用的帖子类型，请联系管理员在后台先创建。
            </div>
          ) : (
            <div className="space-y-3">
              <label className="mb-2 block text-sm font-bold text-slate-900">从下拉中选择</label>
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-[var(--primary-strong)] focus:outline-none focus:ring-2 focus:ring-[rgba(159,196,234,0.45)]"
              >
                {activePostTypes.map((item) => (
                  <option key={item.id} value={item.value}>{item.label}</option>
                ))}
              </select>
              {selectedTypeMeta && (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600">
                  <div className="font-semibold text-slate-900">{selectedTypeMeta.label}</div>
                  <div className="mt-2 leading-6">{selectedTypeMeta.description || "该类型暂无额外说明。"}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-slate-900">标题 *</label>
          <input type="text" name="title" required minLength={6} maxLength={120} placeholder="用一句话概括你的核心观点" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium focus:border-[var(--primary-strong)] focus:outline-none focus:ring-2 focus:ring-[rgba(159,196,234,0.45)]" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-slate-900">摘要 *</label>
          <textarea name="excerpt" required minLength={10} rows={2} placeholder="补充必要背景，让列表页也能看懂" className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[var(--primary-strong)] focus:outline-none focus:ring-2 focus:ring-[rgba(159,196,234,0.45)]" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-900">封面图 URL</label>
          <input type="url" name="coverImageUrl" placeholder="https://example.com/cover.jpg" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[var(--primary-strong)] focus:outline-none focus:ring-2 focus:ring-[rgba(159,196,234,0.45)]" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-900">配图 URL</label>
          <textarea name="imageUrls" rows={4} placeholder="每行一个 URL，或用逗号分隔，最多 6 张图。" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[var(--primary-strong)] focus:outline-none focus:ring-2 focus:ring-[rgba(159,196,234,0.45)]" />
        </div>
      </section>

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-900">正文 *</label>
        <textarea name="content" required minLength={20} rows={12} placeholder="把完整内容写在这里..." className="w-full min-h-[220px] resize-y rounded-2xl border border-slate-200 bg-white p-4 focus:border-[var(--primary-strong)] focus:outline-none focus:ring-2 focus:ring-[rgba(159,196,234,0.45)]" />
        <p className="mt-2 text-xs text-slate-500">支持纯文本和 Markdown。</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-900">标签 *</label>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => {
            const active = selectedTags.includes(tag.slug);
            return (
              <button key={tag.id} type="button" onClick={() => toggleTag(tag.slug)} className={`rounded-full border px-4 py-2 text-sm font-medium ${active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-[var(--accent)]"}`}>
                #{tag.name}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-slate-500">最多选择 3 个标签。</p>
      </div>

      <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900">取消</button>
        <button type="submit" disabled={isLoading} className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-900 bg-slate-900 px-8 font-medium text-white disabled:opacity-50">
          {isLoading ? "发布中..." : "确认发布"}
        </button>
      </div>
    </form>
  );
}