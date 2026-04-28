export const ADMIN_SECTIONS = [
  { id: "overview", label: "总览" },
  { id: "homepage", label: "首页" },
  { id: "reports", label: "举报" },
  { id: "posts", label: "帖子" },
  { id: "post-types", label: "帖子类型" },
  { id: "users", label: "用户" },
  { id: "boards", label: "板块" },
  { id: "tags", label: "标签" },
  { id: "invite-codes", label: "邀请码" },
  { id: "announcements", label: "公告" }
] as const;

export function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function badgeClass(status: string) {
  if (["ACTIVE", "PUBLISHED", "RESOLVED"].includes(status)) return "border-[var(--border)] bg-[var(--accent)] text-[var(--accent-foreground)]";
  if (["PENDING", "FLAGGED"].includes(status)) return "border-slate-200 bg-slate-100 text-slate-700";
  if (["BANNED", "HIDDEN", "DELETED"].includes(status)) return "border-slate-900 bg-slate-900 text-white";
  return "border-slate-200 bg-slate-100 text-slate-700";
}

export function inputClass() {
  return "min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-[var(--primary-strong)] focus:bg-white focus:ring-2 focus:ring-[rgba(159,196,234,0.45)]";
}

export function areaClass() {
  return "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[var(--primary-strong)] focus:bg-white focus:ring-2 focus:ring-[rgba(159,196,234,0.45)]";
}