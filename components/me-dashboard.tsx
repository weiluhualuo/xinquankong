"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, createMyInviteCode, deleteForumPost, getMe, getMyActivity, getMyPosts, updateMeProfile } from "../lib/api";
import type { MyActivity, PostSummary, UserInviteCode, UserProfile } from "../lib/types";
import { PostCard } from "./post-card";

function getRoleLabel(role: string) {
  if (role === "ADMIN") return "管理员";
  if (role === "MODERATOR") return "版主";
  return "用户";
}

function getRoleTone(role: string) {
  if (role === "ADMIN") return "bg-rose-50 text-rose-700 border-rose-200";
  if (role === "MODERATOR") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

function getProgressPercent(me: UserProfile) {
  const span = me.progression.progressSpan || 1;
  return Math.max(0, Math.min(100, (me.progression.progressInLevel / span) * 100));
}

function copyInviteCode(code: string) {
  return navigator.clipboard.writeText(code);
}

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "加载失败，请稍后再试。";
}

export function MeDashboard() {
  const [me, setMe] = useState<UserProfile | null>(null);
  const [activity, setActivity] = useState<MyActivity | null>(null);
  const [myPosts, setMyPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [postBusy, setPostBusy] = useState("");
  const [editing, setEditing] = useState(false);
  const [activePanel, setActivePanel] = useState<"posts" | "activity">("posts");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [copiedInviteCode, setCopiedInviteCode] = useState("");
  const [form, setForm] = useState({ displayName: "", bio: "", avatarUrl: "", joinedLabel: "" });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [user, activityData, postsData] = await Promise.all([getMe(), getMyActivity(10), getMyPosts()]);
        setMe(user);
        setActivity(activityData);
        setMyPosts(Array.isArray(postsData) ? postsData : (postsData?.items ?? []));
        if (user) {
          setForm({
            displayName: user.profile.displayName ?? "",
            bio: user.profile.bio ?? "",
            avatarUrl: user.profile.avatarUrl ?? "",
            joinedLabel: user.profile.joinedLabel ?? ""
          });
        }
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updateMeProfile({
        displayName: form.displayName.trim() || undefined,
        bio: form.bio.trim() || undefined,
        avatarUrl: form.avatarUrl.trim() || undefined,
        joinedLabel: form.joinedLabel.trim() || undefined
      });
      setMe(updated);
      setForm({
        displayName: updated.profile.displayName ?? "",
        bio: updated.profile.bio ?? "",
        avatarUrl: updated.profile.avatarUrl ?? "",
        joinedLabel: updated.profile.joinedLabel ?? ""
      });
      setSuccess("资料已更新。");
      setEditing(false);
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const confirmed = window.confirm("确认删除这篇帖子吗？删除后会从公开列表中移除。");
    if (!confirmed) {
      return;
    }

    setPostBusy(`delete-${postId}`);
    setError("");
    setSuccess("");
    try {
      await deleteForumPost(postId);
      setMyPosts((current) => current.filter((post) => post.id !== postId));
      setSuccess("帖子已删除。");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setPostBusy("");
    }
  };

  const handleGenerateInviteCode = async () => {
    setInviteBusy(true);
    setInviteError("");
    setInviteSuccess("");
    setCopiedInviteCode("");
    try {
      const created = await createMyInviteCode();
      setMe((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          inviteCodes: [created, ...current.inviteCodes]
        };
      });
      setInviteSuccess(`邀请码 ${created.code} 已生成。`);
    } catch (inviteCreateError) {
      setInviteError(getErrorMessage(inviteCreateError));
    } finally {
      setInviteBusy(false);
    }
  };

  const handleCopyInviteCode = async (inviteCode: UserInviteCode) => {
    setInviteError("");
    setInviteSuccess("");
    try {
      await copyInviteCode(inviteCode.code);
      setCopiedInviteCode(inviteCode.id);
      setInviteSuccess(`邀请码 ${inviteCode.code} 已复制。`);
    } catch {
      setInviteError("复制失败，请手动复制邀请码。");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl animate-pulse rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="h-80 rounded-3xl bg-slate-50" />
            <div className="h-80 rounded-3xl bg-slate-50" />
          </div>
        </div>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-slate-900">尚未登录</h1>
          <p className="mb-6 text-slate-500">请先登录后查看个人页。</p>
          {error && <p className="mb-4 text-sm text-slate-700">{error}</p>}
          <Link href="/login" className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-8 font-medium text-white">
            前往登录
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 py-12 text-slate-900 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="space-y-6 order-2 lg:order-1">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-8 py-6">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActivePanel("posts")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${activePanel === "posts" ? "bg-slate-900 text-white shadow-md" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:shadow-sm"}`}
                  >
                    我的帖子
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePanel("activity")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${activePanel === "activity" ? "bg-slate-900 text-white shadow-md" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:shadow-sm"}`}
                  >
                    最近动态
                  </button>
                </div>
              </div>

              {activePanel === "posts" ? (
                <>
                  <div className="border-b border-slate-100 px-8 py-6">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">我的帖子</h2>
                        <p className="mt-1 text-sm text-slate-500">你可以在这里编辑或删除自己发布的帖子。</p>
                      </div>
                      <Link href="/publish" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50">
                        发布新帖子
                      </Link>
                    </div>
                  </div>
                  <div className="px-8 py-6">
                    {myPosts.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
                        你还没有发布帖子。
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {myPosts.map((post) => (
                          <div key={post.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold">{post.board.name}</span>
                                  {post.status && <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold">{post.status}</span>}
                                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                                </div>
                                <h3 className="mt-3 text-lg font-bold text-slate-900">{post.title}</h3>
                                {post.excerpt && <p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Link
                                  href={`/post/${post.id}/edit`}
                                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
                                >
                                  编辑
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => void handleDeletePost(post.id)}
                                  disabled={postBusy === `delete-${post.id}`}
                                  className="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                                >
                                  {postBusy === `delete-${post.id}` ? "删除中..." : "删除"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b border-slate-100 px-8 py-6">
                    <h2 className="text-xl font-bold text-slate-900">最近动态</h2>
                    <p className="mt-1 text-sm text-slate-500">查看你最近发出的帖子动态。</p>
                  </div>
                  <div className="px-8 pb-4">
                    {!activity || (activity.recentPosts ?? []).length === 0 ? (
                      <div className="py-20 text-center">
                        <h3 className="mb-2 text-lg font-medium text-slate-900">暂无最近动态</h3>
                        <p className="mb-6 text-sm text-slate-500">你关注的板块最近还没有新的内容。</p>
                        <Link href="/boards" className="text-sm font-medium text-cyan-600 hover:underline">
                          去看看板块
                        </Link>
                      </div>
                    ) : (
                      (activity.recentPosts ?? []).map((post) => <PostCard key={post.id} post={post} />)
                    )}
                  </div>
                </>
              )}
            </section>
          </div>

          <aside className="order-1 lg:order-2 lg:sticky lg:top-24">
            <section className="rounded-3xl border border-cyan-100 bg-white/80 p-8 shadow-glass backdrop-blur-sm">
              <div className="flex flex-col gap-6">
                {me.profile.avatarUrl ? (
                  <img src={me.profile.avatarUrl} alt={me.profile.displayName} className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-glow-sm animate-float-gentle" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-cyan-100 to-sky-100 text-3xl font-bold text-cyan-400 shadow-glow-sm animate-float-gentle">
                    {me.profile.displayName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex flex-col gap-3">
                    <h1 className="text-2xl font-bold text-slate-900">{me.profile.displayName}</h1>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-xs font-bold text-cyan-600">@{me.username}</span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getRoleTone(me.role)}`}>{getRoleLabel(me.role)}</span>
                      <span className="rounded-full border border-cyan-200 bg-gradient-to-r from-cyan-500 to-sky-500 px-2.5 py-0.5 text-xs font-bold text-white">Lv.{me.level}</span>
                      {me.profile.joinedLabel && (
                        <span className="rounded-full border border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50 px-2.5 py-0.5 text-xs font-bold text-cyan-700">{me.profile.joinedLabel}</span>
                      )}
                    </div>
                  </div>
                  <p className="mt-5 leading-relaxed text-slate-600">{me.profile.bio || "还没有填写简介。"}</p>
                  <div className="mt-5 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-sky-50 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-slate-700">成长进度</span>
                      <span className="text-cyan-500">{me.experience} / {me.progression.nextLevelExperience} EXP</span>
                    </div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-cyan-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 animate-progress-fill" style={{ width: `${getProgressPercent(me)}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 gap-3">
                      <span>当前等级 Lv.{me.progression.level}</span>
                      <span>距离下一等级还差 {Math.max(0, me.progression.nextLevelExperience - me.experience)} EXP</span>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2 text-sm text-slate-500">
                    <div>状态 {me.status}</div>
                    <div>加入时间 {new Date(me.createdAt).toLocaleDateString()}</div>
                    <div>邀请门槛 Lv.{me.inviteRequirementLevel}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditing((current) => !current);
                    setSuccess("");
                    setError("");
                  }}
                  className="hover-lift rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-2 text-sm font-medium text-white shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30"
                >
                  {editing ? "取消编辑" : "编辑资料"}
                </button>
              </div>

              <div className="mt-8 grid gap-4 border-t border-cyan-100 pt-6">
                <div className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-sky-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">邀请中心</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {me.canGenerateInviteCode ? "你已达到生成邀请码的等级，可以直接生成并分享。" : `达到 Lv.${me.inviteRequirementLevel} 后可生成邀请码。`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleGenerateInviteCode()}
                      disabled={!me.canGenerateInviteCode || inviteBusy}
                      className="hover-lift rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {inviteBusy ? "生成中..." : "生成邀请码"}
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-cyan-100 bg-white/80 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-cyan-400">邀请人</div>
                      <div className="mt-2 text-sm font-medium text-slate-900">
                        {me.invitedBy ? `${me.invitedBy.displayName} (@${me.invitedBy.username})` : "暂无邀请人信息"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-cyan-100 bg-white/80 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-cyan-400">已邀请用户</div>
                      <div className="mt-2 text-sm font-medium text-slate-900">{(me.invitedUsers ?? []).length} 人</div>
                    </div>
                  </div>

                  {(inviteError || inviteSuccess) && (
                    <div className="mt-4">
                      {inviteError && <p className="text-sm text-slate-700">{inviteError}</p>}
                      {inviteSuccess && <p className="text-sm text-emerald-600">{inviteSuccess}</p>}
                    </div>
                  )}

                  <div className="mt-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">我的邀请码</h3>
                      <p className="mt-1 text-xs text-slate-500">默认每个邀请码可使用 1 次，复制后发送给被邀请人即可。</p>
                    </div>
                    {(me.inviteCodes ?? []).length === 0 ? (
                      <div className="rounded-xl border border-dashed border-cyan-200 bg-white px-4 py-6 text-sm text-slate-500">你还没有生成邀请码。</div>
                    ) : (
                      <div className="space-y-3">
                        {(me.inviteCodes ?? []).map((inviteCode) => (
                          <div key={inviteCode.id} className="flex flex-col gap-3 rounded-xl border border-cyan-100 bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <div className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">{inviteCode.code}</div>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span>剩余 {inviteCode.remainingUses}/{inviteCode.maxUses}</span>
                                <span>已兑换 {inviteCode.redemptionCount}</span>
                                <span>{inviteCode.isActive ? "可用" : "已停用"}</span>
                              </div>
                              {inviteCode.note && <p className="mt-2 text-sm text-slate-500">{inviteCode.note}</p>}
                            </div>
                            <button
                              type="button"
                              onClick={() => void handleCopyInviteCode(inviteCode)}
                              className="rounded-lg border border-cyan-200 bg-white px-4 py-2 text-sm font-medium text-cyan-600 shadow-sm hover:bg-cyan-50"
                            >
                              {copiedInviteCode === inviteCode.id ? "已复制" : "复制邀请码"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {(me.invitedUsers ?? []).length > 0 && (
                    <div className="mt-4 rounded-xl border border-cyan-100 bg-white/80 p-4">
                      <h3 className="text-sm font-semibold text-cyan-700">我邀请的用户</h3>
                      <div className="mt-3 space-y-2">
                        {(me.invitedUsers ?? []).map((user) => (
                          <div key={user.id} className="flex items-center justify-between gap-3 text-sm">
                            <div className="min-w-0">
                              <div className="font-medium text-slate-900">{user.displayName}</div>
                              <div className="text-slate-500">@{user.username}</div>
                            </div>
                            <div className="shrink-0 text-xs text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {(editing || error || success) && (
                  <form onSubmit={handleSave} className="grid gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">显示名称</label>
                      <input
                        value={form.displayName}
                        onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-black focus:bg-white"
                        maxLength={30}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">加入标签</label>
                      <input
                        value={form.joinedLabel}
                        onChange={(event) => setForm((current) => ({ ...current, joinedLabel: event.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-black focus:bg-white"
                        maxLength={30}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">头像 URL</label>
                      <input
                        value={form.avatarUrl}
                        onChange={(event) => setForm((current) => ({ ...current, avatarUrl: event.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-black focus:bg-white"
                        maxLength={500}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">个人简介</label>
                      <textarea
                        value={form.bio}
                        onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-black focus:bg-white"
                        maxLength={240}
                        rows={4}
                      />
                    </div>
                    {(error || success) && (
                      <div>
                        {error && <p className="text-sm text-slate-700">{error}</p>}
                        {success && <p className="text-sm text-emerald-600">{success}</p>}
                      </div>
                    )}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-900 bg-slate-900 px-6 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {saving ? "保存中..." : "保存资料"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}