"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ApiError,
  clearStoredAuthToken,
  getAdminAnnouncements,
  getAdminBoards,
  getAdminHomepageContent,
  getAdminInviteCodes,
  getAdminPosts,
  getAdminPostTypes,
  getAdminReports,
  getAdminStats,
  getAdminTags,
  getAdminUsers,
  getMe
} from "../lib/api";
import type { AnnouncementFormState, BatchFormState, BoardFormState, DashboardBundle, HomepageContentFormState, InviteFormState, PostTypeFormState, SectionKey, TagFormState } from "./admin/admin-types";
import { ADMIN_SECTIONS } from "./admin/admin-ui";
import { AnnouncementsSection, BoardsSection, HomepageContentSection, InviteCodesSection, OverviewSection, PostTypesSection, PostsSection, ReportsSection, TagsSection, UsersSection } from "./admin/admin-sections";

const ACTIVE_KEY = "xinquankong.admin.active-section";

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "请求失败";
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyKey, setBusyKey] = useState("");
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [adminDenied, setAdminDenied] = useState(false);
  const [boardForm, setBoardForm] = useState<BoardFormState>({ id: "", slug: "", name: "", description: "", color: "#9FC4EA" });
  const [tagForm, setTagForm] = useState<TagFormState>({ id: "", slug: "", name: "" });
  const [inviteForm, setInviteForm] = useState<InviteFormState>({ id: "", code: "", note: "", maxUses: 1, isActive: true });
  const [batchForm, setBatchForm] = useState<BatchFormState>({ count: 5, note: "", maxUses: 1, isActive: true });
  const [announcementForm, setAnnouncementForm] = useState<AnnouncementFormState>({ id: "", title: "", content: "", isActive: true, sortOrder: 0 });
  const [homepageForm, setHomepageForm] = useState<HomepageContentFormState>({ heroBadge: "", heroTitle: "", heroDescription: "" });
  const [postTypeForm, setPostTypeForm] = useState<PostTypeFormState>({ id: "", value: "", label: "", description: "", sortOrder: 0, isActive: true });

  const pendingReports = useMemo(() => data?.reports.filter((item) => item.status === "PENDING") ?? [], [data]);

  const resetForms = () => {
    setBoardForm({ id: "", slug: "", name: "", description: "", color: "#9FC4EA" });
    setTagForm({ id: "", slug: "", name: "" });
    setInviteForm({ id: "", code: "", note: "", maxUses: 1, isActive: true });
    setAnnouncementForm({ id: "", title: "", content: "", isActive: true, sortOrder: 0 });
    setPostTypeForm({ id: "", value: "", label: "", description: "", sortOrder: 0, isActive: true });
    if (data) {
      setHomepageForm({
        heroBadge: data.homepageContent.heroBadge,
        heroTitle: data.homepageContent.heroTitle,
        heroDescription: data.homepageContent.heroDescription
      });
    }
  };

  const load = async () => {
    setLoading(true);
    setError("");
    setSessionExpired(false);
    setAdminDenied(false);
    try {
      const me = await getMe();
      if (!me) {
        clearStoredAuthToken();
        setSessionExpired(true);
        setData(null);
        return;
      }

      if (me.role !== "ADMIN") {
        setAdminDenied(true);
        setError("需要管理员权限。");
        setData(null);
        return;
      }

      const [stats, homepageContent, reports, posts, postTypes, users, boards, tags, inviteCodes, announcements] = await Promise.all([
        getAdminStats(),
        getAdminHomepageContent(),
        getAdminReports(),
        getAdminPosts(),
        getAdminPostTypes(),
        getAdminUsers(),
        getAdminBoards(),
        getAdminTags(),
        getAdminInviteCodes(),
        getAdminAnnouncements()
      ]);
      setHomepageForm({
        heroBadge: homepageContent.heroBadge,
        heroTitle: homepageContent.heroTitle,
        heroDescription: homepageContent.heroDescription
      });
      setData({ stats, homepageContent, reports, posts, postTypes, users, boards, tags, inviteCodes, announcements });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        clearStoredAuthToken();
        setSessionExpired(true);
      }
      if (e instanceof ApiError && e.status === 403) {
        setAdminDenied(true);
      }
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = window.localStorage.getItem(ACTIVE_KEY);
    if (saved && ADMIN_SECTIONS.some((item) => item.id === saved)) {
      setActiveSection(saved as SectionKey);
    }
    void load();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ACTIVE_KEY, activeSection);
  }, [activeSection]);

  const runAction = async (key: string, action: () => Promise<unknown>, keepForms = false) => {
    setBusyKey(key);
    setError("");
    try {
      await action();
      await load();
      if (!keepForms) resetForms();
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        clearStoredAuthToken();
        setSessionExpired(true);
      }
      setError(getErrorMessage(e));
    } finally {
      setBusyKey("");
    }
  };

  const askNote = (title: string) => {
    const value = window.prompt(title, "");
    if (value === null) return null;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  };

  if (loading && !data) {
    return <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 p-8"><div className="mx-auto max-w-6xl animate-pulse rounded-3xl bg-white p-20" /></div>;
  }

  if (!data) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 p-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-900 bg-white p-10 text-center">
          <h1 className="text-2xl font-bold">{adminDenied ? "后台访问受限" : "后台数据加载失败"}</h1>
          <p className="mt-3 text-sm text-slate-500">{error || "请重新登录，并确认 API 已启动。"}</p>
          {sessionExpired && <p className="mt-2 text-xs text-slate-700">登录状态已失效。</p>}
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={() => void load()} className="rounded-xl border border-slate-900 bg-slate-900 px-5 py-3 text-sm font-semibold text-white">重新加载</button>
            <Link href={adminDenied ? "/" : "/login"} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold">{adminDenied ? "返回首页" : "登录"}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-24">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-foreground)]">后台控制台</div>
              <h1 className="mt-4 text-3xl font-black">后台管理</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">从左侧选择功能分区，右侧处理具体内容。</p>

              <div className="mt-6 space-y-2">
                {ADMIN_SECTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${activeSection === item.id ? "border-slate-900 border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                  >
                    <span>{item.label}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${activeSection === item.id ? "bg-white" : "bg-slate-300"}`} />
                  </button>
                ))}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <button type="button" onClick={() => void load()} className="w-full rounded-xl border border-slate-900 bg-slate-900 px-5 py-3 text-sm font-semibold text-white">刷新当前数据</button>
                <Link href="/login" className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold">登录页</Link>
              </div>
            </section>
          </aside>

          <main className="space-y-6">
            {error && <div className="rounded-2xl border border-slate-900 bg-slate-100 px-4 py-3 text-sm text-slate-900">{error}</div>}

            {activeSection === "overview" && <OverviewSection stats={data.stats} />}
            {activeSection === "homepage" && <HomepageContentSection homepageContent={data.homepageContent} homepageForm={homepageForm} setHomepageForm={setHomepageForm} busyKey={busyKey} runAction={runAction} />}
            {activeSection === "reports" && <ReportsSection reports={data.reports} pendingCount={pendingReports.length} busyKey={busyKey} runAction={runAction} askNote={askNote} />}
            {activeSection === "posts" && <PostsSection posts={data.posts} postTypes={data.postTypes} busyKey={busyKey} runAction={runAction} askNote={askNote} />}
            {activeSection === "post-types" && <PostTypesSection postTypes={data.postTypes} postTypeForm={postTypeForm} setPostTypeForm={setPostTypeForm} busyKey={busyKey} runAction={runAction} />}
            {activeSection === "users" && <UsersSection users={data.users} busyKey={busyKey} runAction={runAction} askNote={askNote} />}
            {activeSection === "boards" && <BoardsSection boards={data.boards} boardForm={boardForm} setBoardForm={setBoardForm} busyKey={busyKey} runAction={runAction} />}
            {activeSection === "tags" && <TagsSection tags={data.tags} tagForm={tagForm} setTagForm={setTagForm} busyKey={busyKey} runAction={runAction} />}
            {activeSection === "invite-codes" && <InviteCodesSection inviteCodes={data.inviteCodes} inviteForm={inviteForm} setInviteForm={setInviteForm} batchForm={batchForm} setBatchForm={setBatchForm} busyKey={busyKey} runAction={runAction} />}
            {activeSection === "announcements" && <AnnouncementsSection announcements={data.announcements} announcementForm={announcementForm} setAnnouncementForm={setAnnouncementForm} busyKey={busyKey} runAction={runAction} />}
          </main>
        </div>
      </div>
    </div>
  );
}