import type {
  AdminAnnouncementRecord,
  AdminBoardRecord,
  AdminHomepageContentRecord,
  AdminInviteCodeSummary,
  AdminPostRecord,
  AdminPostTypeOptionRecord,
  AdminStats,
  AdminTagRecord,
  AdminUserRecord,
  ReportSummary
} from "../../lib/types";
import type {
  AnnouncementFormState,
  AskAdminNote,
  BatchFormState,
  BoardFormState,
  HomepageContentFormState,
  PostTypeFormState,
  InviteFormState,
  RunAdminAction,
  StateSetter,
  TagFormState
} from "./admin-types";
import { areaClass, badgeClass, formatDate, inputClass } from "./admin-ui";
import {
  banUser,
  createAnnouncement,
  createBoard,
  createInviteCode,
  createInviteCodeBatch,
  createPostTypeOption,
  createTag,
  deleteAnnouncement,
  deleteBoard,
  deleteInviteCode,
  deletePostTypeOption,
  deleteTag,
  hidePost,
  publishPost,
  rejectReport,
  removePost,
  resolveReport,
  resolveReportAndHidePost,
  unbanUser,
  updateAdminPostType,
  updateAnnouncement,
  updateBoard,
  updateHomepageContent,
  updateInviteCode,
  updatePostTypeOption,
  updateTag
} from "../../lib/api";

export function OverviewSection({ stats }: { stats: AdminStats }) {
  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold">总览</h2>
        <p className="mt-1 text-sm text-slate-500">当前平台运行状态。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="用户" value={stats.overview.users} hint={`活跃 ${stats.overview.activeUsers} / 封禁 ${stats.overview.bannedUsers}`} />
        <MetricCard label="内容" value={stats.overview.posts} hint={`评论 ${stats.overview.comments} / 标签 ${stats.overview.tags}`} />
        <MetricCard label="待处理举报" value={stats.reports.pending} hint={`已处理 ${stats.reports.resolved} / 驳回 ${stats.reports.rejected}`} />
        <MetricCard label="邀请码" value={stats.overview.inviteCodes} hint={`活跃 ${stats.overview.activeInviteCodes} / 已使用 ${stats.overview.usedInviteCodes}`} />
      </div>
    </section>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
      <div className="mt-2 text-sm text-slate-500">{hint}</div>
    </div>
  );
}

export function HomepageContentSection({ homepageContent, homepageForm, setHomepageForm, busyKey, runAction }: { homepageContent: AdminHomepageContentRecord; homepageForm: HomepageContentFormState; setHomepageForm: StateSetter<HomepageContentFormState>; busyKey: string; runAction: RunAdminAction; }) {
  return (
    <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={(event) => { event.preventDefault(); void runAction("homepage-update", () => updateHomepageContent({ heroBadge: homepageForm.heroBadge.trim(), heroTitle: homepageForm.heroTitle.trim(), heroDescription: homepageForm.heroDescription.trim() }), true); }} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-bold">首页文案</h2>
        <p className="mt-2 text-sm text-slate-500">这里管理首页 Hero 区的徽标、主标题和说明文案。</p>
        <div className="mt-4 space-y-4">
          <input value={homepageForm.heroBadge} onChange={(event) => setHomepageForm((current) => ({ ...current, heroBadge: event.target.value }))} placeholder="首页徽标文案" className={inputClass()} maxLength={40} required />
          <input value={homepageForm.heroTitle} onChange={(event) => setHomepageForm((current) => ({ ...current, heroTitle: event.target.value }))} placeholder="首页主标题" className={inputClass()} maxLength={120} required />
          <textarea value={homepageForm.heroDescription} onChange={(event) => setHomepageForm((current) => ({ ...current, heroDescription: event.target.value }))} placeholder="首页说明文案" rows={6} className={areaClass()} maxLength={500} required />
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busyKey === "homepage-update"} className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">保存首页文案</button>
            <button type="button" onClick={() => setHomepageForm({ heroBadge: homepageContent.heroBadge, heroTitle: homepageContent.heroTitle, heroDescription: homepageContent.heroDescription })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold">恢复当前值</button>
          </div>
        </div>
      </form>
      <div className="rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">当前预览</h2>
          <span className="text-xs text-slate-400">更新于 {formatDate(homepageContent.updatedAt)}</span>
        </div>
        <div className="mt-5 rounded-3xl border border-[var(--border)] bg-gradient-to-br from-white via-[var(--accent)] to-slate-50 p-6">
          <div className="inline-flex rounded-full border border-sky-200 bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-foreground)]">{homepageForm.heroBadge || homepageContent.heroBadge}</div>
          <h3 className="mt-6 text-4xl font-black tracking-tight text-slate-900">{homepageForm.heroTitle || homepageContent.heroTitle}</h3>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">{homepageForm.heroDescription || homepageContent.heroDescription}</p>
        </div>
      </div>
    </section>
  );
}

export function ReportsSection({ reports, pendingCount, busyKey, runAction, askNote }: { reports: ReportSummary[]; pendingCount: number; busyKey: string; runAction: RunAdminAction; askNote: AskAdminNote; }) {
  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div><h2 className="text-2xl font-bold">举报</h2><p className="mt-1 text-sm text-slate-500">待处理：{pendingCount}</p></div>
      {reports.map((report) => (
        <div key={report.id} className="rounded-2xl border border-slate-200 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${badgeClass(report.status)}`}>{report.status}</span>
                <span className="text-xs text-slate-500">{report.targetType}</span>
                <span className="text-xs text-slate-500">{report.targetId}</span>
                <span className="text-xs text-slate-500">{formatDate(report.createdAt)}</span>
              </div>
              <div className="mt-2 font-semibold">{report.reason}</div>
              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{report.details || "没有补充说明。"}</div>
            </div>
            {report.status === "PENDING" && (
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button type="button" disabled={busyKey === `resolve-${report.id}`} onClick={() => { const note = askNote("填写处理备注（可选）"); if (note === null) return; void runAction(`resolve-${report.id}`, () => resolveReport(report.id, note)); }} className="rounded-xl border border-[var(--border)] bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)] disabled:opacity-50">处理</button>
                {report.targetType === "POST" && <button type="button" disabled={busyKey === `hide-${report.id}`} onClick={() => { const note = askNote("填写处理并隐藏的备注（可选）"); if (note === null) return; void runAction(`hide-${report.id}`, () => resolveReportAndHidePost(report.id, note)); }} className="rounded-xl border border-slate-900 border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">处理并隐藏</button>}
                <button type="button" disabled={busyKey === `reject-${report.id}`} onClick={() => { const note = askNote("填写驳回备注（可选）"); if (note === null) return; void runAction(`reject-${report.id}`, () => rejectReport(report.id, note)); }} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold disabled:opacity-50">驳回</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

export function PostsSection({ posts, postTypes, busyKey, runAction, askNote }: { posts: AdminPostRecord[]; postTypes: AdminPostTypeOptionRecord[]; busyKey: string; runAction: RunAdminAction; askNote: AskAdminNote; }) {
  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div><h2 className="text-2xl font-bold">帖子</h2><p className="mt-1 text-sm text-slate-500">内容审核操作。</p></div>
      {posts.map((post) => (
        <div key={post.id} className="rounded-2xl border border-slate-200 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2"><span className={`rounded-full border px-2 py-1 text-xs font-semibold ${badgeClass(post.status)}`}>{post.status}</span><span className="text-xs text-slate-500">/{post.board.slug}</span><span className="text-xs text-slate-500">{formatDate(post.createdAt)}</span></div>
              <div className="mt-2 text-lg font-bold">{post.title}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500"><span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold">类型 {post.type}</span></div>
              <div className="mt-2 text-sm text-slate-600">{post.excerpt}</div>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500"><span>点赞 {post.likeCount}</span><span>评论 {post.commentCount}</span><span>浏览 {post.viewCount}</span></div>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">
                <span>帖子类型</span>
                <select
                  defaultValue={post.type}
                  disabled={busyKey === `post-type-${post.id}`}
                  onChange={(event) => {
                    const nextType = event.target.value;
                    if (!nextType || nextType === post.type) {
                      return;
                    }
                    void runAction(`post-type-${post.id}`, () => updateAdminPostType(post.id, nextType), true);
                  }}
                  className="min-w-[124px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[var(--primary-strong)] focus:bg-white focus:ring-2 focus:ring-[rgba(159,196,234,0.45)] disabled:opacity-50"
                >
                  {postTypes.filter((item) => item.isActive).map((item) => (
                    <option key={item.id} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>
              {post.status !== "HIDDEN" && <button type="button" disabled={busyKey === `post-hide-${post.id}`} onClick={() => { const note = askNote("填写隐藏帖子备注（可选）"); if (note === null) return; void runAction(`post-hide-${post.id}`, () => hidePost(post.id, note)); }} className="rounded-xl border border-slate-900 border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">隐藏</button>}
              {post.status !== "PUBLISHED" && <button type="button" disabled={busyKey === `post-publish-${post.id}`} onClick={() => { const note = askNote("填写发布帖子备注（可选）"); if (note === null) return; void runAction(`post-publish-${post.id}`, () => publishPost(post.id, note)); }} className="rounded-xl border border-[var(--border)] bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)] disabled:opacity-50">发布</button>}
              <button type="button" disabled={busyKey === `post-delete-${post.id}`} onClick={() => { const note = askNote("填写删除帖子备注（可选）"); if (note === null) return; void runAction(`post-delete-${post.id}`, () => removePost(post.id, note)); }} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold disabled:opacity-50">删除</button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export function UsersSection({ users, busyKey, runAction, askNote }: { users: AdminUserRecord[]; busyKey: string; runAction: RunAdminAction; askNote: AskAdminNote; }) {
  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div><h2 className="text-2xl font-bold">用户</h2><p className="mt-1 text-sm text-slate-500">账号审核与处理。</p></div>
      {users.map((user) => (
        <div key={user.id} className="rounded-2xl border border-slate-200 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2"><span className={`rounded-full border px-2 py-1 text-xs font-semibold ${badgeClass(user.status)}`}>{user.status}</span><span className="text-xs text-slate-500">{user.role}</span><span className="text-xs text-slate-500">{formatDate(user.createdAt)}</span></div>
              <div className="mt-2 text-lg font-bold">{user.profile?.displayName ?? user.username}</div>
              <div className="text-sm text-slate-500">@{user.username}</div>
              <div className="mt-2 text-sm text-slate-600">{user.profile?.bio || "暂无简介。"}</div>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500"><span>帖子 {user._count.posts}</span><span>评论 {user._count.comments}</span><span>举报 {user._count.reports}</span></div>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {user.status !== "BANNED" ? <button type="button" disabled={busyKey === `ban-${user.id}`} onClick={() => { const note = askNote("填写封禁备注（可选）"); if (note === null) return; void runAction(`ban-${user.id}`, () => banUser(user.id, note)); }} className="rounded-xl border border-slate-900 border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">封禁</button> : <button type="button" disabled={busyKey === `unban-${user.id}`} onClick={() => { const note = askNote("填写解封备注（可选）"); if (note === null) return; void runAction(`unban-${user.id}`, () => unbanUser(user.id, note)); }} className="rounded-xl border border-[var(--border)] bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)] disabled:opacity-50">解封</button>}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export function BoardsSection({ boards, boardForm, setBoardForm, busyKey, runAction }: { boards: AdminBoardRecord[]; boardForm: BoardFormState; setBoardForm: StateSetter<BoardFormState>; busyKey: string; runAction: RunAdminAction; }) {
  return (
    <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={(event) => { event.preventDefault(); const payload = { slug: boardForm.slug.trim(), name: boardForm.name.trim(), description: boardForm.description.trim(), color: boardForm.color.trim() }; void runAction(boardForm.id ? `board-update-${boardForm.id}` : "board-create", () => (boardForm.id ? updateBoard(boardForm.id, payload) : createBoard(payload))); }} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-bold">{boardForm.id ? "编辑板块" : "新建板块"}</h2>
        <div className="mt-4 space-y-4">
          <input value={boardForm.slug} onChange={(event) => setBoardForm((x) => ({ ...x, slug: event.target.value }))} placeholder="general" className={inputClass()} required />
          <input value={boardForm.name} onChange={(event) => setBoardForm((x) => ({ ...x, name: event.target.value }))} placeholder="板块名称" className={inputClass()} required />
          <textarea value={boardForm.description} onChange={(event) => setBoardForm((x) => ({ ...x, description: event.target.value }))} placeholder="板块简介" rows={4} className={areaClass()} required />
          <div className="flex gap-3"><input value={boardForm.color} onChange={(event) => setBoardForm((x) => ({ ...x, color: event.target.value }))} placeholder="#9FC4EA" className={inputClass()} required /><span className="h-11 w-11 rounded-xl border border-slate-200" style={{ backgroundColor: boardForm.color }} /></div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busyKey === "board-create" || busyKey === `board-update-${boardForm.id}`} className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{boardForm.id ? "保存板块" : "创建板块"}</button>
            {boardForm.id && <button type="button" onClick={() => setBoardForm({ id: "", slug: "", name: "", description: "", color: "#9FC4EA" })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold">取消</button>}
          </div>
        </div>
      </form>
      <div className="space-y-4">
        {boards.map((board) => (
          <div key={board.id} className="rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div>
                <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: board.color }} /><div className="text-lg font-bold">{board.name}</div><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">/{board.slug}</span></div>
                <p className="mt-2 text-sm text-slate-600">{board.description}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500"><span>帖子 {board._count.posts}</span><span>关注 {board._count.followers}</span><span>{formatDate(board.updatedAt)}</span></div>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button type="button" onClick={() => setBoardForm({ id: board.id, slug: board.slug, name: board.name, description: board.description, color: board.color })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold">编辑</button>
                <button type="button" disabled={board._count.posts > 0 || board._count.followers > 0 || busyKey === `board-delete-${board.id}`} onClick={() => void runAction(`board-delete-${board.id}`, () => deleteBoard(board.id))} className="rounded-xl border border-slate-900 border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40">删除空板块</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TagsSection({ tags, tagForm, setTagForm, busyKey, runAction }: { tags: AdminTagRecord[]; tagForm: TagFormState; setTagForm: StateSetter<TagFormState>; busyKey: string; runAction: RunAdminAction; }) {
  return (
    <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={(event) => { event.preventDefault(); const payload = { slug: tagForm.slug.trim(), name: tagForm.name.trim() }; void runAction(tagForm.id ? `tag-update-${tagForm.id}` : "tag-create", () => (tagForm.id ? updateTag(tagForm.id, payload) : createTag(payload))); }} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-bold">{tagForm.id ? "编辑标签" : "新建标签"}</h2>
        <div className="mt-4 space-y-4">
          <input value={tagForm.slug} onChange={(event) => setTagForm((x) => ({ ...x, slug: event.target.value }))} placeholder="cold-hobby" className={inputClass()} required />
          <input value={tagForm.name} onChange={(event) => setTagForm((x) => ({ ...x, name: event.target.value }))} placeholder="标签名称" className={inputClass()} required />
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busyKey === "tag-create" || busyKey === `tag-update-${tagForm.id}`} className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{tagForm.id ? "保存标签" : "创建标签"}</button>
            {tagForm.id && <button type="button" onClick={() => setTagForm({ id: "", slug: "", name: "" })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold">取消</button>}
          </div>
        </div>
      </form>
      <div className="space-y-4">
        {tags.map((tag) => (
          <div key={tag.id} className="rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div>
                <div className="flex items-center gap-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">#{tag.slug}</span><div className="text-lg font-bold">{tag.name}</div></div>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500"><span>帖子 {tag._count?.posts ?? 0}</span><span>{formatDate(tag.createdAt)}</span></div>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button type="button" onClick={() => setTagForm({ id: tag.id, slug: tag.slug, name: tag.name })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold">编辑</button>
                <button type="button" disabled={(tag._count?.posts ?? 0) > 0 || busyKey === `tag-delete-${tag.id}`} onClick={() => void runAction(`tag-delete-${tag.id}`, () => deleteTag(tag.id))} className="rounded-xl border border-slate-900 border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40">删除未使用标签</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function InviteCodesSection({ inviteCodes, inviteForm, setInviteForm, batchForm, setBatchForm, busyKey, runAction }: { inviteCodes: AdminInviteCodeSummary[]; inviteForm: InviteFormState; setInviteForm: StateSetter<InviteFormState>; batchForm: BatchFormState; setBatchForm: StateSetter<BatchFormState>; busyKey: string; runAction: RunAdminAction; }) {
  return (
    <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <form onSubmit={(event) => { event.preventDefault(); const payload = { ...(inviteForm.code.trim() ? { code: inviteForm.code.trim() } : {}), ...(inviteForm.note.trim() ? { note: inviteForm.note.trim() } : {}), maxUses: Number(inviteForm.maxUses), isActive: inviteForm.isActive }; void runAction(inviteForm.id ? `invite-update-${inviteForm.id}` : "invite-create", () => (inviteForm.id ? updateInviteCode(inviteForm.id, payload) : createInviteCode(payload))); }} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-xl font-bold">{inviteForm.id ? "编辑邀请码" : "新建邀请码"}</h2>
          <div className="mt-4 space-y-4">
            <input value={inviteForm.code} onChange={(event) => setInviteForm((x) => ({ ...x, code: event.target.value.toUpperCase() }))} placeholder="留空则自动生成" className={inputClass()} />
            <input value={inviteForm.note} onChange={(event) => setInviteForm((x) => ({ ...x, note: event.target.value }))} placeholder="内部备注" className={inputClass()} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="number" min={1} value={inviteForm.maxUses} onChange={(event) => setInviteForm((x) => ({ ...x, maxUses: Number(event.target.value) || 1 }))} className={inputClass()} />
              <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm"><input type="checkbox" checked={inviteForm.isActive} onChange={(event) => setInviteForm((x) => ({ ...x, isActive: event.target.checked }))} />立即启用</label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={busyKey === "invite-create" || busyKey === `invite-update-${inviteForm.id}`} className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{inviteForm.id ? "保存邀请码" : "创建邀请码"}</button>
              {inviteForm.id && <button type="button" onClick={() => setInviteForm({ id: "", code: "", note: "", maxUses: 1, isActive: true })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold">取消</button>}
            </div>
          </div>
        </form>

        <form onSubmit={(event) => { event.preventDefault(); void runAction("invite-batch", () => createInviteCodeBatch({ count: Number(batchForm.count), ...(batchForm.note.trim() ? { note: batchForm.note.trim() } : {}), maxUses: Number(batchForm.maxUses), isActive: batchForm.isActive })); }} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-xl font-bold">批量生成</h2>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="number" min={1} max={50} value={batchForm.count} onChange={(event) => setBatchForm((x) => ({ ...x, count: Number(event.target.value) || 1 }))} className={inputClass()} />
              <input type="number" min={1} value={batchForm.maxUses} onChange={(event) => setBatchForm((x) => ({ ...x, maxUses: Number(event.target.value) || 1 }))} className={inputClass()} />
            </div>
            <input value={batchForm.note} onChange={(event) => setBatchForm((x) => ({ ...x, note: event.target.value }))} placeholder="批量备注" className={inputClass()} />
            <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm"><input type="checkbox" checked={batchForm.isActive} onChange={(event) => setBatchForm((x) => ({ ...x, isActive: event.target.checked }))} />创建后启用</label>
            <button type="submit" disabled={busyKey === "invite-batch"} className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">生成一批</button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {inviteCodes.map((invite) => (
          <div key={invite.id} className="rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2"><span className="rounded-full bg-slate-900 px-2 py-1 font-mono text-xs font-semibold text-white">{invite.code}</span><span className={`rounded-full border px-2 py-1 text-xs font-semibold ${badgeClass(invite.isActive ? "ACTIVE" : "INACTIVE")}`}>{invite.isActive ? "启用中" : "已停用"}</span></div>
                <div className="mt-2 text-sm text-slate-700">{invite.note || "无备注"}</div>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500"><span>最大次数 {invite.maxUses}</span><span>已使用 {invite.useCount}</span><span>剩余次数 {invite.remainingUses}</span><span>{formatDate(invite.createdAt)}</span></div>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button type="button" onClick={() => setInviteForm({ id: invite.id, code: invite.code, note: invite.note ?? "", maxUses: invite.maxUses, isActive: invite.isActive })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold">编辑</button>
                <button type="button" disabled={invite.useCount > 0 || busyKey === `invite-delete-${invite.id}`} onClick={() => void runAction(`invite-delete-${invite.id}`, () => deleteInviteCode(invite.id))} className="rounded-xl border border-slate-900 border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40">删除未使用邀请码</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AnnouncementsSection({ announcements, announcementForm, setAnnouncementForm, busyKey, runAction }: { announcements: AdminAnnouncementRecord[]; announcementForm: AnnouncementFormState; setAnnouncementForm: StateSetter<AnnouncementFormState>; busyKey: string; runAction: RunAdminAction; }) {
  return (
    <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={(event) => { event.preventDefault(); const payload = { title: announcementForm.title.trim(), content: announcementForm.content.trim(), isActive: announcementForm.isActive, sortOrder: Number(announcementForm.sortOrder) || 0 }; void runAction(announcementForm.id ? `announcement-update-${announcementForm.id}` : "announcement-create", () => (announcementForm.id ? updateAnnouncement(announcementForm.id, payload) : createAnnouncement(payload))); }} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-bold">{announcementForm.id ? "编辑公告" : "创建公告"}</h2>
        <div className="mt-4 space-y-4">
          <input value={announcementForm.title} onChange={(event) => setAnnouncementForm((x) => ({ ...x, title: event.target.value }))} placeholder="公告标题" className={inputClass()} required />
          <textarea value={announcementForm.content} onChange={(event) => setAnnouncementForm((x) => ({ ...x, content: event.target.value }))} placeholder="公告内容" rows={5} className={areaClass()} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <input type="number" value={announcementForm.sortOrder} onChange={(event) => setAnnouncementForm((x) => ({ ...x, sortOrder: Number(event.target.value) || 0 }))} className={inputClass()} placeholder="排序值" />
            <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm"><input type="checkbox" checked={announcementForm.isActive} onChange={(event) => setAnnouncementForm((x) => ({ ...x, isActive: event.target.checked }))} />启用公告</label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busyKey === "announcement-create" || busyKey === `announcement-update-${announcementForm.id}`} className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{announcementForm.id ? "保存修改" : "发布公告"}</button>
            {announcementForm.id && <button type="button" onClick={() => setAnnouncementForm({ id: "", title: "", content: "", isActive: true, sortOrder: 0 })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold">取消编辑</button>}
          </div>
        </div>
      </form>
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">当前还没有公告，先创建第一条公告。</div>
        ) : announcements.map((announcement) => (
          <div key={announcement.id} className="rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2"><div className="text-lg font-bold">{announcement.title}</div><span className={`rounded-full border px-2 py-1 text-xs font-semibold ${badgeClass(announcement.isActive ? "ACTIVE" : "INACTIVE")}`}>{announcement.isActive ? "已启用" : "已停用"}</span></div>
                <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{announcement.content}</div>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500"><span>排序 {announcement.sortOrder}</span><span>{formatDate(announcement.updatedAt)}</span></div>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button type="button" onClick={() => setAnnouncementForm({ id: announcement.id, title: announcement.title, content: announcement.content, isActive: announcement.isActive, sortOrder: announcement.sortOrder })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold">编辑</button>
                <button type="button" disabled={busyKey === `announcement-delete-${announcement.id}`} onClick={() => void runAction(`announcement-delete-${announcement.id}`, () => deleteAnnouncement(announcement.id))} className="rounded-xl border border-slate-900 border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40">删除</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export function PostTypesSection({ postTypes, postTypeForm, setPostTypeForm, busyKey, runAction }: { postTypes: AdminPostTypeOptionRecord[]; postTypeForm: PostTypeFormState; setPostTypeForm: StateSetter<PostTypeFormState>; busyKey: string; runAction: RunAdminAction; }) {
  return (
    <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={(event) => { event.preventDefault(); const payload = { value: postTypeForm.value.trim().toUpperCase(), label: postTypeForm.label.trim(), description: postTypeForm.description.trim(), sortOrder: Number(postTypeForm.sortOrder) || 0, isActive: postTypeForm.isActive }; void runAction(postTypeForm.id ? `post-type-update-${postTypeForm.id}` : "post-type-create", () => (postTypeForm.id ? updatePostTypeOption(postTypeForm.id, { label: payload.label, description: payload.description, sortOrder: payload.sortOrder, isActive: payload.isActive }) : createPostTypeOption(payload))); }} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-bold">{postTypeForm.id ? "编辑帖子类型" : "新增帖子类型"}</h2>
        <div className="mt-4 space-y-4">
          <input value={postTypeForm.value} onChange={(event) => setPostTypeForm((x) => ({ ...x, value: event.target.value.toUpperCase() }))} placeholder="GUIDE" className={inputClass()} required disabled={Boolean(postTypeForm.id)} />
          <input value={postTypeForm.label} onChange={(event) => setPostTypeForm((x) => ({ ...x, label: event.target.value }))} placeholder="类型名称" className={inputClass()} required />
          <textarea value={postTypeForm.description} onChange={(event) => setPostTypeForm((x) => ({ ...x, description: event.target.value }))} placeholder="类型说明" rows={4} className={areaClass()} />
          <div className="grid gap-4 sm:grid-cols-2">
            <input type="number" value={postTypeForm.sortOrder} onChange={(event) => setPostTypeForm((x) => ({ ...x, sortOrder: Number(event.target.value) || 0 }))} className={inputClass()} />
            <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm"><input type="checkbox" checked={postTypeForm.isActive} onChange={(event) => setPostTypeForm((x) => ({ ...x, isActive: event.target.checked }))} />启用类型</label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busyKey === "post-type-create" || busyKey === `post-type-update-${postTypeForm.id}`} className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{postTypeForm.id ? "保存类型" : "创建类型"}</button>
            {postTypeForm.id && <button type="button" onClick={() => setPostTypeForm({ id: "", value: "", label: "", description: "", sortOrder: 0, isActive: true })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold">取消</button>}
          </div>
        </div>
      </form>
      <div className="space-y-4">
        {postTypes.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">{item.value}</span><div className="text-lg font-bold">{item.label}</div><span className={`rounded-full border px-2 py-1 text-xs font-semibold ${badgeClass(item.isActive ? "ACTIVE" : "INACTIVE")}`}>{item.isActive ? "启用中" : "已停用"}</span></div>
                <div className="mt-2 text-sm text-slate-600">{item.description || "暂无说明。"}</div>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500"><span>排序 {item.sortOrder}</span><span>{formatDate(item.updatedAt)}</span></div>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button type="button" onClick={() => setPostTypeForm({ id: item.id, value: item.value, label: item.label, description: item.description ?? "", sortOrder: item.sortOrder, isActive: item.isActive })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold">编辑</button>
                <button type="button" disabled={busyKey === `post-type-delete-${item.id}`} onClick={() => void runAction(`post-type-delete-${item.id}`, () => deletePostTypeOption(item.id))} className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40">删除</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}