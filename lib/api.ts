import {
  getMockBoard,
  getMockBoards,
  getMockMe,
  getMockPost,
  getMockPosts,
  getMockTags
} from "./mock-data";
import {
  AdminBoardRecord,
  AdminInviteCodeBatchResult,
  AdminInviteCodeSummary,
  AdminPostRecord,
  AdminStats,
  AdminUserRecord,
  AuthUser,
  BoardDetail,
  BoardSummary,
  Comment,
  PagedPosts,
  PostDetail,
  PostSummary,
  ReportSummary,
  TagSummary,
  UserProfile
} from "./types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function normalizeMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: string | string[] }).message;
    if (Array.isArray(message)) {
      return message.join("；");
    }
    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
}

async function requestJson<T>(
  path: string,
  init: RequestInit = {},
  fallback?: () => T | Promise<T>
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      cache: "no-store",
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {})
      }
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new ApiError(response.status, normalizeMessage(payload, `Request failed: ${response.status}`));
    }

    return payload as T;
  } catch (error) {
    if (fallback) {
      return fallback();
    }

    throw error;
  }
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
  return requestJson<BoardSummary[]>("/boards", {}, () => getMockBoards());
}

export async function getPosts(sort: "latest" | "hot" | "following" = "latest"): Promise<PagedPosts> {
  return requestJson<PagedPosts>(`/posts?sort=${sort}`, {}, () => getMockPosts(sort));
}

export async function getBoard(slug: string): Promise<BoardDetail | null> {
  return requestJson<BoardDetail | null>(`/boards/${slug}`, {}, () => getMockBoard(slug));
}

export async function getPost(id: string): Promise<PostDetail | null> {
  return requestJson<PostDetail | null>(`/posts/${id}`, {}, () => getMockPost(id));
}

export async function getTags(): Promise<TagSummary[]> {
  return requestJson<TagSummary[]>("/tags", {}, () => getMockTags());
}

export async function getMe(): Promise<UserProfile | null> {
  return requestJson<UserProfile>("/auth/me", {}, () => getMockMe());
}

export async function loginUser(payload: { username: string; password: string }) {
  return postJson<AuthUser>("/auth/login", payload);
}

export async function registerUser(payload: { username: string; password: string; inviteCode: string; displayName?: string }) {
  return postJson<AuthUser>("/auth/register", payload);
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
    content: raw.isDeleted ? "该评论已删除" : raw.content,
    isDeleted: raw.isDeleted,
    createdAt: raw.createdAt,
    author: {
      id: raw.author.id,
      username: raw.author.username,
      displayName: raw.author.profile?.displayName ?? raw.author.username,
      avatarUrl: raw.author.profile?.avatarUrl ?? null
    },
    replies: []
  };
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

export async function updateBoard(
  boardId: string,
  payload: Partial<{ slug: string; name: string; description: string; color: string }>
) {
  return patchJson<AdminBoardRecord>(`/admin/boards/${boardId}`, payload);
}

export async function deleteBoard(boardId: string) {
  return deleteJson<{ ok: true; id: string }>(`/admin/boards/${boardId}`);
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






