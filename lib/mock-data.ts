import type {
  AdminBoardRecord,
  AdminInviteCodeSummary,
  AdminPostRecord,
  AdminStats,
  AdminUserRecord,
  BoardDetail,
  BoardSummary,
  PagedPosts,
  PostDetail,
  ReportSummary,
  TagSummary,
  UserProfile
} from "./types";

const boards: BoardSummary[] = [
  { id: "board-general", slug: "general", name: "General", description: "General discussion.", color: "#0EA5E9", postCount: 2, followerCount: 12, isFollowing: true },
  { id: "board-share", slug: "share", name: "Share", description: "Share interests and findings.", color: "#10B981", postCount: 1, followerCount: 8 }
];

const tags: TagSummary[] = [
  { id: "tag-1", slug: "cold-hobby", name: "Cold Hobby" },
  { id: "tag-2", slug: "starter-kit", name: "Starter Kit" }
];

const posts: PostDetail[] = [
  {
    id: "post-1",
    title: "Welcome to Xinquankong",
    excerpt: "Start with a thoughtful introduction.",
    content: "This is a sample post for local mock data.",
    type: "SHARE",
    status: "PUBLISHED",
    coverImageUrl: null,
    createdAt: "2026-04-26T09:00:00.000Z",
    board: boards[0],
    author: { id: "admin", username: "admin", displayName: "Admin", avatarUrl: null },
    tags: [tags[0]],
    metrics: { likes: 3, comments: 1, views: 20 },
    isLiked: false,
    isFavorited: false,
    images: [],
    comments: []
  }
];

const me: UserProfile = {
  id: "me",
  username: "me",
  role: "USER",
  status: "ACTIVE",
  createdAt: "2026-04-26T09:00:00.000Z",
  profile: { displayName: "Me", bio: "Local mock profile.", avatarUrl: null, joinedLabel: "Local" }
};

const reports: ReportSummary[] = [
  { id: "report-1", targetType: "POST", targetId: "post-1", reason: "Sample report", details: "Mock report detail.", status: "PENDING", createdAt: "2026-04-26T10:00:00.000Z" }
];

const adminBoards: AdminBoardRecord[] = boards.map((board) => ({
  id: board.id,
  slug: board.slug,
  name: board.name,
  description: board.description,
  color: board.color,
  createdAt: "2026-04-26T09:00:00.000Z",
  updatedAt: "2026-04-26T09:00:00.000Z",
  _count: { posts: board.postCount, followers: board.followerCount }
}));

const adminPosts: AdminPostRecord[] = posts.map((post) => ({
  id: post.id,
  boardId: post.board.id,
  authorId: post.author.id,
  title: post.title,
  excerpt: post.excerpt ?? "",
  content: post.content,
  type: post.type,
  status: post.status ?? "PUBLISHED",
  coverImageUrl: post.coverImageUrl,
  viewCount: post.metrics.views,
  likeCount: post.metrics.likes,
  commentCount: post.metrics.comments,
  createdAt: post.createdAt,
  updatedAt: post.createdAt,
  board: { id: post.board.id, slug: post.board.slug, name: post.board.name, description: post.board.description, color: post.board.color },
  author: { id: post.author.id, username: post.author.username, role: "ADMIN", status: "ACTIVE", profile: { displayName: post.author.displayName, bio: null, avatarUrl: post.author.avatarUrl, joinedLabel: null } },
  _count: { comments: post.metrics.comments, likes: post.metrics.likes, favorites: 0 }
}));

const adminUsers: AdminUserRecord[] = [
  { id: "admin", username: "admin", role: "ADMIN", status: "ACTIVE", createdAt: "2026-04-26T09:00:00.000Z", updatedAt: "2026-04-26T09:00:00.000Z", profile: { displayName: "Admin", bio: "Mock admin.", avatarUrl: null, joinedLabel: "Local" }, _count: { posts: 1, comments: 1, reports: 0 } }
];

const inviteCodes: AdminInviteCodeSummary[] = [
  { id: "invite-1", code: "LOCAL-TEST", note: "Mock invite code", isActive: true, maxUses: 1, useCount: 0, remainingUses: 1, createdAt: "2026-04-26T09:00:00.000Z", updatedAt: "2026-04-26T09:00:00.000Z", createdBy: { id: "admin", username: "admin", displayName: "Admin" }, redemptionCount: 0 }
];

const adminStats: AdminStats = {
  overview: { users: 1, activeUsers: 1, bannedUsers: 0, posts: 1, comments: 0, boards: boards.length, tags: tags.length, inviteCodes: 1, activeInviteCodes: 1, usedInviteCodes: 0 },
  reports: { pending: 1, resolved: 0, rejected: 0 },
  postsByStatus: { published: 1, hidden: 0, deleted: 0 },
  today: { newUsers: 1, newPosts: 1, newComments: 0 },
  topBoards: adminBoards.map((board) => ({ id: board.id, slug: board.slug, name: board.name, color: board.color, postCount: board._count.posts, followerCount: board._count.followers })),
  recentActions: [{ id: "action-1", action: "CREATE_POST", targetType: "post", targetId: "post-1", note: "Mock action", createdAt: "2026-04-26T09:30:00.000Z", actor: { id: "admin", username: "admin", displayName: "Admin" } }]
};

export function getMockBoards() { return boards; }
export function getMockTags() { return tags; }
export function getMockPosts(sort = "latest"): PagedPosts { const items = [...posts]; if (sort === "hot") items.sort((a, b) => (b.metrics.likes + b.metrics.comments) - (a.metrics.likes + a.metrics.comments)); return { items, total: items.length, page: 1, pageSize: 12 }; }
export function getMockBoard(slug: string): BoardDetail | null { const board = boards.find((entry) => entry.slug === slug); return board ? { ...board, posts: posts.filter((post) => post.board.slug === slug) } : null; }
export function getMockPost(id: string): PostDetail | null { return posts.find((post) => post.id === id) ?? null; }
export function getMockMe() { return me; }
export function getMockReports() { return reports; }
export function getMockAdminStats() { return adminStats; }
export function getMockAdminPosts() { return adminPosts; }
export function getMockAdminUsers() { return adminUsers; }
export function getMockAdminBoards() { return adminBoards; }
export function getMockAdminInviteCodes() { return inviteCodes; }