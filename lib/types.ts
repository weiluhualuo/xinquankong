export interface BoardSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  postCount: number;
  followerCount: number;
  isFollowing?: boolean;
}

export interface BoardDetail extends BoardSummary {
  posts: PostSummary[];
  isFollowing?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  profile: {
    displayName: string;
    bio: string;
    avatarUrl: string | null;
    joinedLabel?: string | null;
  };
}

export interface TagSummary {
  id: string;
  slug: string;
  name: string;
}

export interface PostMetrics {
  likes: number;
  comments: number;
  views: number;
}

export interface Comment {
  id: string;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  replies?: Comment[];
}

export interface PostSummary {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  type: string;
  status?: string;
  coverImageUrl: string | null;
  createdAt: string;
  board: BoardSummary;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  tags: TagSummary[];
  metrics: PostMetrics;
  isLiked?: boolean;
  isFavorited?: boolean;
}

export interface PostDetail extends PostSummary {
  images: {
    id: string;
    imageUrl: string;
    sortOrder: number;
  }[];
  comments: Comment[];
}

export interface PagedPosts {
  items: PostSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface MyActivity {
  summary: {
    posts: number;
    comments: number;
    favorites: number;
    follows: number;
  };
  recentPosts: PostSummary[];
  recentComments: {
    id: string;
    content: string;
    isDeleted: boolean;
    createdAt: string;
    post: {
      id: string;
      title: string;
      board: {
        id: string;
        slug: string;
        name: string;
        color: string;
      };
    };
  }[];
  favoritePosts: {
    createdAt: string;
    post: PostSummary;
  }[];
  followedBoards: {
    id: string;
    slug: string;
    name: string;
    color: string;
    description: string;
    followedAt: string;
    postCount: number;
    followerCount: number;
  }[];
}

export interface ReportSummary {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  details: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  reporterId?: string;
  handledById?: string | null;
  reporter?: {
    id: string;
    username: string;
    profile?: {
      displayName: string;
      bio?: string | null;
      avatarUrl?: string | null;
      joinedLabel?: string | null;
    };
  };
}

export interface AdminActionEntry {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  note?: string | null;
  createdAt: string;
  actor: {
    id: string;
    username: string;
    displayName: string;
  };
}

export interface AdminStats {
  overview: {
    users: number;
    activeUsers: number;
    bannedUsers: number;
    posts: number;
    comments: number;
    boards: number;
    tags: number;
    inviteCodes: number;
    activeInviteCodes: number;
    usedInviteCodes: number;
  };
  reports: {
    pending: number;
    resolved: number;
    rejected: number;
  };
  postsByStatus: {
    published: number;
    hidden: number;
    deleted: number;
  };
  today: {
    newUsers: number;
    newPosts: number;
    newComments: number;
  };
  topBoards: {
    id: string;
    slug: string;
    name: string;
    color: string;
    postCount: number;
    followerCount: number;
  }[];
  recentActions: AdminActionEntry[];
}

export interface AdminPostRecord {
  id: string;
  boardId: string;
  authorId: string;
  title: string;
  excerpt: string;
  content: string;
  type: string;
  status: string;
  coverImageUrl: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  board: {
    id: string;
    slug: string;
    name: string;
    description: string;
    color: string;
  };
  author: {
    id: string;
    username: string;
    role: string;
    status: string;
    profile?: {
      displayName: string;
      bio?: string | null;
      avatarUrl?: string | null;
      joinedLabel?: string | null;
    } | null;
  };
  _count?: {
    comments: number;
    likes: number;
    favorites: number;
  };
}

export interface AdminUserRecord {
  id: string;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    displayName: string;
    bio?: string | null;
    avatarUrl?: string | null;
    joinedLabel?: string | null;
  } | null;
  _count: {
    posts: number;
    comments: number;
    reports: number;
  };
}

export interface AdminBoardRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    posts: number;
    followers: number;
  };
}

export interface AdminInviteCodeSummary {
  id: string;
  code: string;
  note: string | null;
  isActive: boolean;
  maxUses: number;
  useCount: number;
  remainingUses: number;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    username: string;
    displayName: string;
  } | null;
  redemptionCount: number;
}

export interface AdminInviteCodeBatchResult {
  count: number;
  items: AdminInviteCodeSummary[];
}
