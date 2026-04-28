import {
  AdminAnnouncementRecord,
  AdminBoardRecord,
  AdminHomepageContentRecord,
  AdminInviteCodeBatchResult,
  AdminInviteCodeSummary,
  AdminPostRecord,
  AdminPostTypeOptionRecord,
  AdminStats,
  AdminTagRecord,
  AdminUserRecord,
  AnnouncementRecord,
  BoardDetail,
  BoardSummary,
  Comment,
  HomepageContentRecord,
  MyActivity,
  PagedPosts,
  PostDetail,
  PostSummary,
  PostTypeOptionRecord,
  ReportSummary,
  TagSummary,
  UserProfile
} from "./types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
export const AUTH_TOKEN_KEY = "xinquankong.auth.token";

export interface AuthUser {
  id: string;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  profile?: {
    displayName: string;
    bio?: string | null;
    avatarUrl?: string | null;
    joinedLabel?: string | null;
  } | null;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getStoredAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredAuthToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function clearStoredAuthToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

function normalizeMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: string | string[] }).message;
    if (Array.isArray(message)) {
      return message.join(", ");
    }
    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
}

async function requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const authToken = getStoredAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(init.headers ?? {})
    }
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(response.status, normalizeMessage(payload, `Request failed: ${response.status}`));
  }

  return payload as T;
}

function postJson<T>(path: string, body?: unknown) {
  return requestJson<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined
  });
}

function patchJson<T>(path: string, body?: unknown) {
  return requestJson<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined
  });
}

function deleteJson<T>(path: string) {
  return requestJson<T>(path, {
    method: "DELETE"
  });
}

export async function getBoards(): Promise<BoardSummary[]> {
  return requestJson<BoardSummary[]>("/boards");
}

export async function getPosts(sort: "latest" | "hot" | "following" = "latest"): Promise<PagedPosts> {
  return requestJson<PagedPosts>(`/posts?sort=${sort}`);
}

export async function getBoard(slug: string): Promise<BoardDetail | null> {
  return requestJson<BoardDetail | null>(`/boards/${slug}`);
}

export async function getPost(id: string): Promise<PostDetail | null> {
  return requestJson<PostDetail | null>(`/posts/${id}`);
}

export async function getTags(): Promise<TagSummary[]> {
  return requestJson<TagSummary[]>("/tags");
}

export async function getAnnouncements(): Promise<AnnouncementRecord[]> {
  return requestJson<AnnouncementRecord[]>("/announcements");
}

export async function getHomepageContent(): Promise<HomepageContentRecord> {
  return requestJson<HomepageContentRecord>("/homepage-content");
}

export async function getMe(): Promise<UserProfile | null> {
  return requestJson<UserProfile | null>("/auth/me");
}

export async function updateMeProfile(payload: Partial<{
  displayName: string;
  bio: string;
  avatarUrl: string;
  joinedLabel: string;
}>) {
  return patchJson<UserProfile>("/auth/me", payload);
}

export async function getMyActivity(limit = 10): Promise<MyActivity> {
  return requestJson<MyActivity>(`/me/activity?limit=${limit}`);
}

export async function getMyPosts(): Promise<PostSummary[]> {
  return requestJson<PostSummary[]>("/me/posts");
}

export async function loginUser(payload: { username: string; password: string }) {
  return postJson<AuthResult>("/auth/login", payload);
}

export async function registerUser(payload: {
  username: string;
  password: string;
  inviteCode: string;
  displayName?: string;
}) {
  return postJson<AuthResult>("/auth/register", payload);
}

export async function logoutUser() {
  return postJson<{ ok: true }>("/auth/logout");
}

export async function createForumPost(payload: {
  title: string;
  excerpt: string;
  content: string;
  boardSlug: string;
  type: string;
  coverImageUrl?: string;
  tagSlugs: string[];
  imageUrls?: string[];
}) {
  return postJson<{ id: string }>("/posts", payload);
}

export async function updateForumPost(
  postId: string,
  payload: Partial<{
    title: string;
    excerpt: string;
    content: string;
  }>
) {
  return patchJson<PostSummary>(`/posts/${postId}`, payload);
}

export async function deleteForumPost(postId: string) {
  return deleteJson<{ ok: true; id: string; status: string }>(`/posts/${postId}`);
}

export async function toggleBoardFollow(slug: string) {
  return postJson<{ following: boolean }>(`/boards/${slug}/follow`);
}

export async function togglePostLike(postId: string) {
  return postJson<{ liked: boolean }>(`/posts/${postId}/like`);
}

export async function togglePostFavorite(postId: string) {
  return postJson<{ favorited: boolean }>(`/posts/${postId}/favorite`);
}

export async function createPostComment(postId: string, content: string) {
  const raw = await postJson<{
    id: string;
    content: string;
    isDeleted: boolean;
    createdAt: string;
    author: {
      id: string;
      username: string;
      profile?: {
        displayName?: string | null;
        avatarUrl?: string | null;
      } | null;
    };
  }>(`/posts/${postId}/comments`, { content });

  return {
    id: raw.id,
    content: raw.isDeleted ? "Comment deleted" : raw.content,
    isDeleted: raw.isDeleted,
    createdAt: raw.createdAt,
    author: {
      id: raw.author.id,
      username: raw.author.username,
      displayName: raw.author.profile?.displayName ?? raw.author.username,
      avatarUrl: raw.author.profile?.avatarUrl ?? null
    },
    replies: []
  } as Comment;
}

export async function getAdminStats() {
  return requestJson<AdminStats>("/admin/stats");
}

export async function getAdminReports() {
  return requestJson<ReportSummary[]>("/admin/reports");
}

export async function getAdminPosts() {
  return requestJson<AdminPostRecord[]>("/admin/posts");
}

export async function getAdminUsers() {
  return requestJson<AdminUserRecord[]>("/admin/users");
}

export async function getAdminBoards() {
  return requestJson<AdminBoardRecord[]>("/admin/boards");
}

export async function getAdminAnnouncements() {
  return requestJson<AdminAnnouncementRecord[]>("/admin/announcements");
}

export async function getAdminHomepageContent(): Promise<AdminHomepageContentRecord> {
  return requestJson<AdminHomepageContentRecord>("/admin/homepage-content");
}

export async function getAdminTags() {
  return requestJson<AdminTagRecord[]>("/admin/tags");
}

export async function getAdminInviteCodes() {
  return requestJson<AdminInviteCodeSummary[]>("/admin/invite-codes");
}

export async function resolveReport(reportId: string, note?: string) {
  return postJson<ReportSummary>(`/admin/reports/${reportId}/resolve`, note ? { note } : {});
}

export async function rejectReport(reportId: string, note?: string) {
  return postJson<ReportSummary>(`/admin/reports/${reportId}/reject`, note ? { note } : {});
}

export async function resolveReportAndHidePost(reportId: string, note?: string) {
  return postJson<{ report: ReportSummary; post: AdminPostRecord }>(
    `/admin/reports/${reportId}/resolve-and-hide-post`,
    note ? { note } : {}
  );
}

export async function hidePost(postId: string, note?: string) {
  return postJson<AdminPostRecord>(`/admin/posts/${postId}/hide`, note ? { note } : {});
}

export async function publishPost(postId: string, note?: string) {
  return postJson<AdminPostRecord>(`/admin/posts/${postId}/publish`, note ? { note } : {});
}

export async function updateAdminPostType(postId: string, type: string) {
  return patchJson<AdminPostRecord>(`/admin/posts/${postId}/type`, { type });
}

export async function removePost(postId: string, note?: string) {
  return postJson<AdminPostRecord>(`/admin/posts/${postId}/delete`, note ? { note } : {});
}

export async function banUser(userId: string, note?: string) {
  return postJson<AdminUserRecord>(`/admin/users/${userId}/ban`, note ? { note } : {});
}

export async function unbanUser(userId: string, note?: string) {
  return postJson<AdminUserRecord>(`/admin/users/${userId}/unban`, note ? { note } : {});
}

export async function createBoard(payload: { slug: string; name: string; description: string; color: string }) {
  return postJson<AdminBoardRecord>("/admin/boards", payload);
}

export async function createAnnouncement(payload: { title: string; content: string; isActive?: boolean; sortOrder?: number }) {
  return postJson<AdminAnnouncementRecord>("/admin/announcements", payload);
}

export async function updateAnnouncement(announcementId: string, payload: Partial<{ title: string; content: string; isActive: boolean; sortOrder: number }>) {
  return patchJson<AdminAnnouncementRecord>(`/admin/announcements/${announcementId}`, payload);
}

export async function deleteAnnouncement(announcementId: string) {
  return deleteJson<{ ok: true; id: string }>(`/admin/announcements/${announcementId}`);
}

export async function updateHomepageContent(payload: Partial<{ heroBadge: string; heroTitle: string; heroDescription: string }>) {
  return patchJson<AdminHomepageContentRecord>("/admin/homepage-content", payload);
}

export async function updateBoard(
  boardId: string,
  payload: Partial<{ slug: string; name: string; description: string; color: string }>
) {
  return patchJson<AdminBoardRecord>(`/admin/boards/${boardId}`, payload);
}

export async function deleteBoard(boardId: string) {
  return deleteJson<{ ok: true; id: string }>(`/admin/boards/${boardId}`);
}

export async function createTag(payload: { slug: string; name: string }) {
  return postJson<AdminTagRecord>("/admin/tags", payload);
}

export async function updateTag(tagId: string, payload: Partial<{ slug: string; name: string }>) {
  return patchJson<AdminTagRecord>(`/admin/tags/${tagId}`, payload);
}

export async function deleteTag(tagId: string) {
  return deleteJson<{ ok: true; id: string }>(`/admin/tags/${tagId}`);
}

export async function createInviteCode(payload: {
  code?: string;
  note?: string;
  maxUses?: number;
  isActive?: boolean;
}) {
  return postJson<AdminInviteCodeSummary>("/admin/invite-codes", payload);
}

export async function createInviteCodeBatch(payload: {
  count: number;
  note?: string;
  maxUses?: number;
  isActive?: boolean;
}) {
  return postJson<AdminInviteCodeBatchResult>("/admin/invite-codes/batch", payload);
}

export async function updateInviteCode(
  inviteCodeId: string,
  payload: Partial<{ code: string; note: string; maxUses: number; isActive: boolean }>
) {
  return patchJson<AdminInviteCodeSummary>(`/admin/invite-codes/${inviteCodeId}`, payload);
}

export async function deleteInviteCode(inviteCodeId: string) {
  return deleteJson<{ ok: true; id: string }>(`/admin/invite-codes/${inviteCodeId}`);
}

export async function getPostsByTag(tag: string): Promise<PagedPosts> {
  return requestJson<PagedPosts>(`/posts?tag=${tag}`);
}
export async function createPostTypeOption(payload: {
  value: string;
  label: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}) {
  return postJson<AdminPostTypeOptionRecord>("/admin/post-types", payload);
}

export async function updatePostTypeOption(
  postTypeId: string,
  payload: Partial<{ label: string; description: string; sortOrder: number; isActive: boolean }>
) {
  return patchJson<AdminPostTypeOptionRecord>(`/admin/post-types/${postTypeId}`, payload);
}

export async function deletePostTypeOption(postTypeId: string) {
  return deleteJson<{ ok: true; id: string }>(`/admin/post-types/${postTypeId}`);
}
export async function getPostTypes(): Promise<PostTypeOptionRecord[]> {
  return requestJson<PostTypeOptionRecord[]>("/post-types");
}

export async function getAdminPostTypes(): Promise<AdminPostTypeOptionRecord[]> {
  return requestJson<AdminPostTypeOptionRecord[]>("/admin/post-types");
}

