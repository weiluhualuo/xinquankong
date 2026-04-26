"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ApiError,
  banUser,
  createBoard,
  createInviteCode,
  createInviteCodeBatch,
  deleteBoard,
  deleteInviteCode,
  getAdminBoards,
  getAdminInviteCodes,
  getAdminPosts,
  getAdminReports,
  getAdminStats,
  getAdminUsers,
  hidePost,
  publishPost,
  rejectReport,
  removePost,
  resolveReport,
  resolveReportAndHidePost,
  unbanUser,
  updateBoard,
  updateInviteCode
} from "../lib/api";
import {
  AdminBoardRecord,
  AdminInviteCodeSummary,
  AdminPostRecord,
  AdminStats,
  AdminUserRecord,
  ReportSummary
} from "../lib/types";

type DashboardBundle = {
  stats: AdminStats;
  reports: ReportSummary[];
  posts: AdminPostRecord[];
  users: AdminUserRecord[];
  boards: AdminBoardRecord[];
  inviteCodes: AdminInviteCodeSummary[];
};

type SectionKey = "overview" | "reports" | "posts" | "users" | "boards" | "invite-codes";

const ADMIN_ACTIVE_SECTION_KEY = "xinquankong.admin.active-section";

const sectionLinks: { id: SectionKey; label: string }[] = [
  { id: "overview", label: "概览" },
  { id: "reports", label: "举报" },
  { id: "posts", label: "帖子" },
  { id: "users", label: "用户" },
  { id: "boards", label: "板块" },
  { id: "invite-codes", label: "邀请码" }
];

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "请求失败，请稍后重试";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function statusClass(status: string) {
  switch (status) {
    case "ACTIVE":
    case "PUBLISHED":
    case "RESOLVED":
      return "bg-emerald-500/15 text-emerald-200 border border-emerald-400/20";
    case "PENDING":
    case "FLAGGED":
      return "bg-amber-500/15 text-amber-200 border border-amber-400/20";
    case "BANNED":
    case "HIDDEN":
    case "DELETED":
      return "bg-rose-500/15 text-rose-200 border border-rose-400/20";
    default:
      return "bg-slate-500/15 text-slate-200 border border-slate-400/20";
  }
}

function MetricCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-glow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-3 text-3xl font-bold text-white">{value}</div>
      <div className="mt-2 text-sm text-slate-400">{hint}</div>
    </div>
  );
}

function SectionShell({
  id,
  title,
  description,
  children
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8"
    >
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyKey, setBusyKey] = useState("");
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");

  const [boardForm, setBoardForm] = useState({
    id: "",
    slug: "",
    name: "",
    description: "",
    color: "#0EA5E9"
  });
  const [inviteForm, setInviteForm] = useState({
    id: "",
    code: "",
    note: "",
    maxUses: 1,
    isActive: true
  });
  const [batchForm, setBatchForm] = useState({
    count: 5,
    note: "",
    maxUses: 1,
    isActive: true
  });

  const pendingReports = useMemo(
    () => data?.reports.filter((report) => report.status === "PENDING") ?? [],
    [data]
  );

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [stats, reports, posts, users, boards, inviteCodes] = await Promise.all([
        getAdminStats(),
        getAdminReports(),
        getAdminPosts(),
        getAdminUsers(),
        getAdminBoards(),
        getAdminInviteCodes()
      ]);

      setData({ stats, reports, posts, users, boards, inviteCodes });
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedSection = window.localStorage.getItem(ADMIN_ACTIVE_SECTION_KEY);
    if (savedSection && sectionLinks.some((item) => item.id === savedSection)) {
      setActiveSection(savedSection as SectionKey);
    }

    void loadDashboard();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ADMIN_ACTIVE_SECTION_KEY, activeSection);
  }, [activeSection]);

  const runAction = async (key: string, action: () => Promise<unknown>, options?: { keepForms?: boolean }) => {
    setBusyKey(key);
    setError("");

    try {
      await action();
      await loadDashboard();
      if (!options?.keepForms) {
        setBoardForm({ id: "", slug: "", name: "", description: "", color: "#0EA5E9" });
        setInviteForm({ id: "", code: "", note: "", maxUses: 1, isActive: true });
      }
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    } finally {
      setBusyKey("");
    }
  };

  const askNote = (title: string) => {
    const value = window.prompt(title, "");
    if (value === null) {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  };

  if (loading && !data) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-[radial-gradient(circle_at_top,#1e3a8a_0%,#020617_45%,#020617_100%)] px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-24 rounded-3xl bg-white/5" />
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 rounded-2xl bg-white/5" />
            ))}
          </div>
          <div className="h-[480px] rounded-3xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-[radial-gradient(circle_at_top,#1e3a8a_0%,#020617_45%,#020617_100%)] px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-rose-400/20 bg-rose-500/10 p-10 text-center">
          <div className="text-2xl font-bold">后台数据加载失败</div>
          <p className="mt-3 text-sm text-rose-100/90">{error || "请先登录管理员账号，并确认 API 已启动。"}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              重新加载
            </button>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              前往登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[radial-gradient(circle_at_top,#1e3a8a_0%,#020617_45%,#020617_100%)] px-4 py-10 text-white md:py-12">
      <div className="mx-auto max-w-[1440px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="rounded-2xl border border-sky-300/15 bg-sky-400/10 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Admin Navigation</div>
              <div className="mt-3 text-2xl font-black text-white">后台管理</div>
              <div className="mt-2 text-sm leading-6 text-slate-400">侧边导航保留常用入口，右侧继续承载完整的操作面板。</div>
            </div>

            <nav className="mt-5 space-y-2">
              {sectionLinks.map((item) => {
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`flex min-h-11 w-full items-center justify-between rounded-xl border px-4 text-sm font-medium transition ${
                      isActive
                        ? "border-sky-300/35 bg-sky-400/15 text-white shadow-glow-sm"
                        : "border-white/8 bg-white/[0.03] text-slate-200 hover:border-sky-300/25 hover:bg-sky-400/10 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`text-xs ${isActive ? "text-sky-200" : "text-slate-500"}`}>{isActive ? "●" : "#"}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">快速态势</div>
                <div className="mt-3 grid gap-3">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>待处理举报</span>
                    <span className="font-bold text-amber-200">{pendingReports.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>启用邀请码</span>
                    <span className="font-bold text-sky-200">{data.stats.overview.activeInviteCodes}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>封禁用户</span>
                    <span className="font-bold text-rose-200">{data.stats.overview.bannedUsers}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void loadDashboard()}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                刷新后台数据
              </button>
              <Link
                href="/login"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                返回登录页
              </Link>
            </div>
          </div>
        </aside>

        <div className="space-y-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 lg:hidden">
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">导航</div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {sectionLinks.map((item) => {
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`inline-flex min-h-11 shrink-0 items-center rounded-xl border px-4 text-sm font-medium transition ${
                      isActive
                        ? "border-sky-300/35 bg-sky-400/15 text-white"
                        : "border-white/10 bg-white/5 text-slate-200 hover:border-sky-300/25 hover:bg-sky-400/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

        {activeSection === "overview" && (
        <section
          id="overview"
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.16),transparent_40%)]" />
          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                  Admin Control Center
                </div>
                <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">新泉空后台管理面板</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  这里把统计、举报、帖子、用户、板块和邀请码放进同一个工作台。所有操作都直接命中后端
                  API，适合你本地联调和后续继续扩展。
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void loadDashboard()}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  刷新数据
                </button>
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  重新登录
                </Link>
              </div>
            </div>


            {error && (
              <div className="rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="用户总数"
                value={data.stats.overview.users}
                hint={`活跃 ${data.stats.overview.activeUsers} / 封禁 ${data.stats.overview.bannedUsers}`}
              />
              <MetricCard
                label="内容体量"
                value={data.stats.overview.posts}
                hint={`评论 ${data.stats.overview.comments} / 标签 ${data.stats.overview.tags}`}
              />
              <MetricCard
                label="待处理举报"
                value={data.stats.reports.pending}
                hint={`已处理 ${data.stats.reports.resolved} / 驳回 ${data.stats.reports.rejected}`}
              />
              <MetricCard
                label="邀请码"
                value={data.stats.overview.inviteCodes}
                hint={`启用 ${data.stats.overview.activeInviteCodes} / 已使用 ${data.stats.overview.usedInviteCodes}`}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">近期操作</h2>
                    <p className="text-sm text-slate-400">管理员最新处理记录</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {data.stats.recentActions.map((action) => (
                    <div key={action.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-sky-400/10 px-2.5 py-1 text-xs font-semibold text-sky-200">
                          {action.action}
                        </span>
                        <span className="text-xs text-slate-500">{action.targetType}</span>
                        <span className="text-xs text-slate-500">{action.targetId}</span>
                      </div>
                      <div className="mt-2 text-sm text-slate-200">{action.note || "无备注"}</div>
                      <div className="mt-3 text-xs text-slate-500">
                        {action.actor.displayName} · {formatDate(action.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
                <h2 className="text-lg font-bold text-white">热门板块</h2>
                <p className="mt-1 text-sm text-slate-400">按帖子量和关注量聚合</p>
                <div className="mt-5 space-y-3">
                  {data.stats.topBoards.map((board) => (
                    <div key={board.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: board.color }} />
                        <div className="font-semibold text-white">{board.name}</div>
                      </div>
                      <div className="mt-3 flex gap-5 text-sm text-slate-400">
                        <span>帖子 {board.postCount}</span>
                        <span>关注 {board.followerCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {activeSection === "reports" && (
        <SectionShell id="reports" title="举报队列" description="处理举报、驳回举报，或一键隐藏被举报帖子。">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-100">待处理 {pendingReports.length}</span>
            <span>总举报 {data.reports.length}</span>
          </div>
          <div className="space-y-4">
            {data.reports.map((report) => (
              <div key={report.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200">
                        {report.targetType}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-xs text-slate-500">目标 {report.targetId}</span>
                      {report.reporter && (
                        <span className="text-xs text-slate-500">
                          举报人 {report.reporter.profile?.displayName ?? report.reporter.username}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{report.reason}</div>
                      <div className="mt-2 rounded-xl border border-white/8 bg-slate-950/50 p-3 text-sm leading-6 text-slate-300">
                        {report.details || "无补充说明"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:max-w-[280px] lg:justify-end">
                    {report.status === "PENDING" && (
                      <>
                        <button
                          type="button"
                          disabled={busyKey === `resolve-${report.id}`}
                          onClick={() => {
                            const note = askNote("填写处理备注（可选）");
                            if (note === null) return;
                            void runAction(`resolve-${report.id}`, () => resolveReport(report.id, note));
                          }}
                          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20 disabled:opacity-50"
                        >
                          标记已处理
                        </button>
                        {report.targetType === "POST" && (
                          <button
                            type="button"
                            disabled={busyKey === `hide-${report.id}`}
                            onClick={() => {
                              const note = askNote("填写隐藏说明（可选）");
                              if (note === null) return;
                              void runAction(`hide-${report.id}`, () => resolveReportAndHidePost(report.id, note));
                            }}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20 disabled:opacity-50"
                          >
                            处理并隐藏帖子
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={busyKey === `reject-${report.id}`}
                          onClick={() => {
                            const note = askNote("填写驳回备注（可选）");
                            if (note === null) return;
                            void runAction(`reject-${report.id}`, () => rejectReport(report.id, note));
                          }}
                          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                        >
                          驳回举报
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-500">创建于 {formatDate(report.createdAt)}</div>
              </div>
            ))}
          </div>
        </SectionShell>
        )}

        {activeSection === "posts" && (
        <SectionShell id="posts" title="帖子管理" description="快速切换帖子状态，处理隐藏、恢复和后台删除。">
          <div className="grid gap-4 xl:grid-cols-2">
            {data.posts.map((post) => (
              <div key={post.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(post.status)}`}>
                    {post.status}
                  </span>
                  <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-200">
                    {post.board.name}
                  </span>
                  <span className="text-xs text-slate-500">{post.author.profile?.displayName ?? post.author.username}</span>
                </div>
                <div className="mt-3 text-lg font-bold text-white">{post.title}</div>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{post.excerpt || post.content}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>浏览 {post.viewCount}</span>
                  <span>点赞 {post.likeCount}</span>
                  <span>评论 {post.commentCount}</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.status !== "HIDDEN" && (
                    <button
                      type="button"
                      disabled={busyKey === `post-hide-${post.id}`}
                      onClick={() => {
                        const note = askNote("填写隐藏原因（可选）");
                        if (note === null) return;
                        void runAction(`post-hide-${post.id}`, () => hidePost(post.id, note));
                      }}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20 disabled:opacity-50"
                    >
                      隐藏
                    </button>
                  )}
                  {post.status !== "PUBLISHED" && (
                    <button
                      type="button"
                      disabled={busyKey === `post-publish-${post.id}`}
                      onClick={() => {
                        const note = askNote("填写恢复说明（可选）");
                        if (note === null) return;
                        void runAction(`post-publish-${post.id}`, () => publishPost(post.id, note));
                      }}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      发布
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busyKey === `post-delete-${post.id}`}
                    onClick={() => {
                      const note = askNote("填写删除说明（可选）");
                      if (note === null) return;
                      void runAction(`post-delete-${post.id}`, () => removePost(post.id, note));
                    }}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
        )}

        {activeSection === "users" && (
        <SectionShell id="users" title="用户管理" description="查看用户发帖量和举报量，并执行封禁或解封操作。">
          <div className="grid gap-4 xl:grid-cols-2">
            {data.users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(user.status)}`}>
                    {user.status}
                  </span>
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200">
                    {user.role}
                  </span>
                </div>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold text-white">{user.profile?.displayName ?? user.username}</div>
                    <div className="mt-1 text-sm text-slate-400">@{user.username}</div>
                    {user.profile?.bio && <div className="mt-2 text-sm leading-6 text-slate-400">{user.profile.bio}</div>}
                  </div>
                  <div className="text-right text-xs text-slate-500">{formatDate(user.createdAt)}</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                  <span>帖子 {user._count.posts}</span>
                  <span>评论 {user._count.comments}</span>
                  <span>举报 {user._count.reports}</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {user.status !== "BANNED" ? (
                    <button
                      type="button"
                      disabled={busyKey === `ban-${user.id}`}
                      onClick={() => {
                        const note = askNote("填写封禁原因（可选）");
                        if (note === null) return;
                        void runAction(`ban-${user.id}`, () => banUser(user.id, note));
                      }}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20 disabled:opacity-50"
                    >
                      封禁用户
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busyKey === `unban-${user.id}`}
                      onClick={() => {
                        const note = askNote("填写解封备注（可选）");
                        if (note === null) return;
                        void runAction(`unban-${user.id}`, () => unbanUser(user.id, note));
                      }}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      解封用户
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
        )}
        {activeSection === "boards" && (
        <SectionShell id="boards" title="板块管理" description="创建板块、更新板块信息，或删除空板块。">
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const payload = {
                  slug: boardForm.slug.trim(),
                  name: boardForm.name.trim(),
                  description: boardForm.description.trim(),
                  color: boardForm.color.trim()
                };
                void runAction(
                  boardForm.id ? `board-update-${boardForm.id}` : "board-create",
                  () => (boardForm.id ? updateBoard(boardForm.id, payload) : createBoard(payload)),
                  { keepForms: false }
                );
              }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="mb-4 text-lg font-bold text-white">{boardForm.id ? "编辑板块" : "新建板块"}</div>
              <div className="space-y-4">
                <input
                  value={boardForm.slug}
                  onChange={(event) => setBoardForm((current) => ({ ...current, slug: event.target.value }))}
                  placeholder="slug，例如 games"
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-sky-400/40"
                  required
                />
                <input
                  value={boardForm.name}
                  onChange={(event) => setBoardForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="板块名称"
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-sky-400/40"
                  required
                />
                <textarea
                  value={boardForm.description}
                  onChange={(event) => setBoardForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="板块简介"
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/40"
                  required
                />
                <div className="flex items-center gap-3">
                  <input
                    value={boardForm.color}
                    onChange={(event) => setBoardForm((current) => ({ ...current, color: event.target.value }))}
                    placeholder="#0EA5E9"
                    className="min-h-11 flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-sky-400/40"
                    required
                  />
                  <span className="h-11 w-11 rounded-xl border border-white/10" style={{ backgroundColor: boardForm.color }} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={busyKey === "board-create" || busyKey === `board-update-${boardForm.id}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    {boardForm.id ? "保存板块" : "创建板块"}
                  </button>
                  {boardForm.id && (
                    <button
                      type="button"
                      onClick={() => setBoardForm({ id: "", slug: "", name: "", description: "", color: "#0EA5E9" })}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      取消编辑
                    </button>
                  )}
                </div>
              </div>
            </form>

            <div className="space-y-4">
              {data.boards.map((board) => (
                <div key={board.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: board.color }} />
                        <div className="text-lg font-bold text-white">{board.name}</div>
                        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200">
                          /{board.slug}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{board.description}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                        <span>帖子 {board._count.posts}</span>
                        <span>关注 {board._count.followers}</span>
                        <span>更新于 {formatDate(board.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          setBoardForm({
                            id: board.id,
                            slug: board.slug,
                            name: board.name,
                            description: board.description,
                            color: board.color
                          })
                        }
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        disabled={board._count.posts > 0 || board._count.followers > 0 || busyKey === `board-delete-${board.id}`}
                        onClick={() => void runAction(`board-delete-${board.id}`, () => deleteBoard(board.id))}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        删除空板块
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>
        )}

        {activeSection === "invite-codes" && (
        <SectionShell
          id="invite-codes"
          title="邀请码管理"
          description="创建、批量生成、启停、改备注、调整次数，以及删除未使用邀请码。"
        >
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const payload = {
                    ...(inviteForm.code.trim() ? { code: inviteForm.code.trim() } : {}),
                    ...(inviteForm.note.trim() ? { note: inviteForm.note.trim() } : {}),
                    maxUses: Number(inviteForm.maxUses),
                    isActive: inviteForm.isActive
                  };

                  void runAction(
                    inviteForm.id ? `invite-update-${inviteForm.id}` : "invite-create",
                    () => (inviteForm.id ? updateInviteCode(inviteForm.id, payload) : createInviteCode(payload)),
                    { keepForms: false }
                  );
                }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="mb-4 text-lg font-bold text-white">{inviteForm.id ? "编辑邀请码" : "单个邀请码"}</div>
                <div className="space-y-4">
                  <input
                    value={inviteForm.code}
                    onChange={(event) => setInviteForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))}
                    placeholder="自定义邀请码，可留空自动生成"
                    className="min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-sky-400/40"
                  />
                  <input
                    value={inviteForm.note}
                    onChange={(event) => setInviteForm((current) => ({ ...current, note: event.target.value }))}
                    placeholder="备注，例如首批内测"
                    className="min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-sky-400/40"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="number"
                      min={1}
                      value={inviteForm.maxUses}
                      onChange={(event) =>
                        setInviteForm((current) => ({ ...current, maxUses: Number(event.target.value) || 1 }))
                      }
                      className="min-h-11 rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-sky-400/40"
                    />
                    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-slate-200">
                      <input
                        type="checkbox"
                        checked={inviteForm.isActive}
                        onChange={(event) => setInviteForm((current) => ({ ...current, isActive: event.target.checked }))}
                      />
                      立即启用
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      disabled={busyKey === "invite-create" || busyKey === `invite-update-${inviteForm.id}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                      {inviteForm.id ? "保存邀请码" : "创建邀请码"}
                    </button>
                    {inviteForm.id && (
                      <button
                        type="button"
                        onClick={() => setInviteForm({ id: "", code: "", note: "", maxUses: 1, isActive: true })}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        取消编辑
                      </button>
                    )}
                  </div>
                </div>
              </form>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void runAction("invite-batch", () =>
                    createInviteCodeBatch({
                      count: Number(batchForm.count),
                      ...(batchForm.note.trim() ? { note: batchForm.note.trim() } : {}),
                      maxUses: Number(batchForm.maxUses),
                      isActive: batchForm.isActive
                    })
                  );
                }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="mb-4 text-lg font-bold text-white">批量生成</div>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={batchForm.count}
                      onChange={(event) => setBatchForm((current) => ({ ...current, count: Number(event.target.value) || 1 }))}
                      className="min-h-11 rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-sky-400/40"
                    />
                    <input
                      type="number"
                      min={1}
                      value={batchForm.maxUses}
                      onChange={(event) =>
                        setBatchForm((current) => ({ ...current, maxUses: Number(event.target.value) || 1 }))
                      }
                      className="min-h-11 rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-sky-400/40"
                    />
                  </div>
                  <input
                    value={batchForm.note}
                    onChange={(event) => setBatchForm((current) => ({ ...current, note: event.target.value }))}
                    placeholder="批次备注"
                    className="min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-sky-400/40"
                  />
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={batchForm.isActive}
                      onChange={(event) => setBatchForm((current) => ({ ...current, isActive: event.target.checked }))}
                    />
                    生成后立即启用
                  </label>
                  <button
                    type="submit"
                    disabled={busyKey === "invite-batch"}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10 px-4 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/20 disabled:opacity-50"
                  >
                    生成一批邀请码
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              {data.inviteCodes.map((invite) => (
                <div key={invite.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-100">
                          {invite.code}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            invite.isActive ? statusClass("ACTIVE") : statusClass("HIDDEN")
                          }`}
                        >
                          {invite.isActive ? "启用" : "停用"}
                        </span>
                      </div>
                      <div className="mt-3 text-sm leading-6 text-slate-300">{invite.note || "无备注"}</div>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                        <span>总次数 {invite.maxUses}</span>
                        <span>已使用 {invite.useCount}</span>
                        <span>剩余 {invite.remainingUses}</span>
                        <span>创建于 {formatDate(invite.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          setInviteForm({
                            id: invite.id,
                            code: invite.code,
                            note: invite.note ?? "",
                            maxUses: invite.maxUses,
                            isActive: invite.isActive
                          })
                        }
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        disabled={busyKey === `invite-toggle-${invite.id}`}
                        onClick={() =>
                          void runAction(`invite-toggle-${invite.id}`, () =>
                            updateInviteCode(invite.id, { isActive: !invite.isActive })
                          )
                        }
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10 px-4 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/20 disabled:opacity-50"
                      >
                        {invite.isActive ? "停用" : "启用"}
                      </button>
                      <button
                        type="button"
                        disabled={invite.useCount > 0 || busyKey === `invite-delete-${invite.id}`}
                        onClick={() => void runAction(`invite-delete-${invite.id}`, () => deleteInviteCode(invite.id))}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        删除未使用码
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>
        )}
        </div>
      </div>
    </div>
  );
}












