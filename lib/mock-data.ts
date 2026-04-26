import {
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
  {
    id: "board-general",
    slug: "general",
    name: "综合讨论",
    description: "聊最近关注的话题、观察与观点。",
    color: "#d86f30",
    postCount: 28,
    followerCount: 1320,
    isFollowing: true
  },
  {
    id: "board-share",
    slug: "share",
    name: "兴趣分享",
    description: "分享书影音、装备、经验与灵感。",
    color: "#2e6f40",
    postCount: 44,
    followerCount: 1854
  },
  {
    id: "board-help",
    slug: "help",
    name: "求助问答",
    description: "提问、求推荐、找解决方案。",
    color: "#1d5c8d",
    postCount: 31,
    followerCount: 964
  },
  {
    id: "board-resources",
    slug: "resources",
    name: "资源交流",
    description: "整理资料、工具和实用入口。",
    color: "#8a5b28",
    postCount: 19,
    followerCount: 703
  }
];

const tags: TagSummary[] = [
  { id: "tag-a", slug: "cold-hobby", name: "冷门爱好" },
  { id: "tag-b", slug: "starter-kit", name: "新手指南" },
  { id: "tag-c", slug: "gear", name: "装备" },
  { id: "tag-d", slug: "watchlist", name: "片单" }
];

const posts: PostDetail[] = [
  {
    id: "seed-welcome-post",
    title: "欢迎来到新泉空：先从你最近的兴趣坑开始聊",
    excerpt: "这里先不卷关系链，先把能让人停下来阅读和回复的帖子做好。",
    type: "SHARE",
    status: "PUBLISHED",
    coverImageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-04-20T09:30:00.000Z",
    board: boards[0],
    author: {
      id: "admin",
      username: "admin",
      displayName: "站务组",
      avatarUrl: null
    },
    tags: [tags[0], tags[1]],
    metrics: {
      likes: 86,
      comments: 14,
      views: 1940
    },
    content:
      "论坛 v1 聚焦公开讨论。你可以在不同板块发图文帖、评论、收藏，管理员会根据举报和敏感词队列做治理。第一批内容建议从经历、推荐、问题和资源四类切入。首页先做最新、热门、关注板块优先三条路径，把内容密度做上去，再考虑推荐算法。",
    images: [
      {
        id: "img-1",
        imageUrl:
          "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
        sortOrder: 0
      }
    ],
    isLiked: false,
    isFavorited: true,
    comments: [
      {
        id: "comment-1",
        content: "建议把每周精选做成固定栏目，这样冷启动更稳。",
        isDeleted: false,
        createdAt: "2026-04-20T11:00:00.000Z",
        author: {
          id: "wanderer",
          username: "wanderer",
          displayName: "闲逛的人",
          avatarUrl: null
        },
        replies: [
          {
            id: "reply-1",
            content: "已经安排，后面会加到首页运营位。",
            isDeleted: false,
            createdAt: "2026-04-20T11:26:00.000Z",
            author: {
              id: "admin",
              username: "admin",
              displayName: "站务组",
              avatarUrl: null
            },
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: "post-2",
    title: "有没有适合下班后 30 分钟沉浸进去的冷门兴趣",
    excerpt: "不想再刷短视频，想找一个成本不高、能长期投入的方向。",
    type: "HELP",
    status: "FLAGGED",
    coverImageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-04-22T12:10:00.000Z",
    board: boards[2],
    author: {
      id: "u2",
      username: "noon",
      displayName: "正午以后",
      avatarUrl: null
    },
    tags: [tags[0]],
    metrics: { likes: 44, comments: 26, views: 980 },
    content:
      "目前想到的是胶片、观鸟、桌游规则研究，但都不太确定能否长期坚持。希望大家推荐的是那种能连续玩半年以上、还能自然积累内容的兴趣。",
    images: [],
    isLiked: false,
    isFavorited: false,
    comments: []
  },
  {
    id: "post-3",
    title: "我把自己的书影音记录模板整理成了一套可复用表格",
    excerpt: "适合想持续做兴趣归档的人，结构尽量简单，不依赖复杂工具。",
    type: "RESOURCE",
    status: "PUBLISHED",
    coverImageUrl:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-04-21T03:15:00.000Z",
    board: boards[3],
    author: {
      id: "u3",
      username: "coda",
      displayName: "Coda",
      avatarUrl: null
    },
    tags: [tags[1], tags[3]],
    metrics: { likes: 72, comments: 18, views: 1630 },
    content:
      "模板拆成了输入区、索引区和复盘区。重点不是功能多，而是每周能稳定回看一次，看到自己的兴趣轨迹。",
    images: [],
    isLiked: true,
    isFavorited: false,
    comments: []
  },
  {
    id: "post-4",
    title: "最近入坑随身录音设备，分享一套适合城市采样的轻量组合",
    excerpt: "预算不高，重点是便携和后期整理不痛苦。",
    type: "SHARE",
    status: "HIDDEN",
    coverImageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-04-23T08:00:00.000Z",
    board: boards[1],
    author: {
      id: "u4",
      username: "fieldtone",
      displayName: "Field Tone",
      avatarUrl: null
    },
    tags: [tags[2]],
    metrics: { likes: 31, comments: 8, views: 620 },
    content:
      "录音笔、海绵防风罩、简单标签规范，再配一个每周整理的时间窗口，城市采样这件事就很容易持续下去。",
    images: [],
    isLiked: false,
    isFavorited: false,
    comments: []
  }
];

const me: UserProfile = {
  id: "wanderer",
  username: "wanderer",
  role: "USER",
  status: "ACTIVE",
  createdAt: "2026-04-18T04:00:00.000Z",
  profile: {
    displayName: "闲逛的人",
    bio: "喜欢把冷门兴趣写成长帖。",
    avatarUrl: null,
    joinedLabel: "内测用户"
  }
};

const reports: ReportSummary[] = [
  {
    id: "report-1",
    targetType: "POST",
    targetId: "post-2",
    reason: "标题过于宽泛，疑似灌水",
    details: "正文信息量偏低，建议补充约束条件。",
    status: "PENDING",
    createdAt: "2026-04-23T10:30:00.000Z",
    updatedAt: "2026-04-23T10:30:00.000Z",
    reporterId: "wanderer",
    handledById: null,
    reporter: {
      id: "wanderer",
      username: "wanderer",
      profile: {
        displayName: "闲逛的人",
        bio: "喜欢把冷门兴趣写成长帖。",
        avatarUrl: null,
        joinedLabel: "内测用户"
      }
    }
  },
  {
    id: "report-2",
    targetType: "COMMENT",
    targetId: "comment-1",
    reason: "轻微引战",
    details: "表达比较冲，建议提醒。",
    status: "RESOLVED",
    createdAt: "2026-04-22T06:00:00.000Z",
    updatedAt: "2026-04-22T08:00:00.000Z"
  }
];

const adminUsers: AdminUserRecord[] = [
  {
    id: "admin",
    username: "admin",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2026-04-18T03:00:00.000Z",
    updatedAt: "2026-04-26T09:00:00.000Z",
    profile: {
      displayName: "站务组",
      bio: "负责首批社区治理与板块维护。",
      avatarUrl: null,
      joinedLabel: "创始成员"
    },
    _count: {
      posts: 1,
      comments: 4,
      reports: 0
    }
  },
  {
    id: "wanderer",
    username: "wanderer",
    role: "USER",
    status: "ACTIVE",
    createdAt: "2026-04-18T04:00:00.000Z",
    updatedAt: "2026-04-26T09:00:00.000Z",
    profile: {
      displayName: "闲逛的人",
      bio: "喜欢把冷门兴趣写成长帖。",
      avatarUrl: null,
      joinedLabel: "内测用户"
    },
    _count: {
      posts: 3,
      comments: 8,
      reports: 1
    }
  },
  {
    id: "u2",
    username: "noon",
    role: "USER",
    status: "BANNED",
    createdAt: "2026-04-19T07:40:00.000Z",
    updatedAt: "2026-04-26T09:10:00.000Z",
    profile: {
      displayName: "正午以后",
      bio: "间歇性发长帖，偶尔灌水。",
      avatarUrl: null,
      joinedLabel: null
    },
    _count: {
      posts: 1,
      comments: 3,
      reports: 2
    }
  }
];

const adminBoards: AdminBoardRecord[] = boards.map((board) => ({
  id: board.id,
  slug: board.slug,
  name: board.name,
  description: board.description,
  color: board.color,
  createdAt: "2026-04-18T02:00:00.000Z",
  updatedAt: "2026-04-26T09:00:00.000Z",
  _count: {
    posts: board.postCount,
    followers: board.followerCount
  }
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
  board: {
    id: post.board.id,
    slug: post.board.slug,
    name: post.board.name,
    description: post.board.description,
    color: post.board.color
  },
  author: {
    id: post.author.id,
    username: post.author.username,
    role: post.author.id === "admin" ? "ADMIN" : "USER",
    status: post.author.id === "u2" ? "BANNED" : "ACTIVE",
    profile: {
      displayName: post.author.displayName,
      bio: null,
      avatarUrl: post.author.avatarUrl,
      joinedLabel: null
    }
  },
  _count: {
    comments: post.metrics.comments,
    likes: post.metrics.likes,
    favorites: post.isFavorited ? 1 : 0
  }
}));

const inviteCodes: AdminInviteCodeSummary[] = [
  {
    id: "invite-1",
    code: "LOCAL-TEST-2026",
    note: "本地默认邀请码",
    isActive: true,
    maxUses: 1,
    useCount: 0,
    remainingUses: 1,
    createdAt: "2026-04-26T09:00:00.000Z",
    updatedAt: "2026-04-26T09:00:00.000Z",
    createdBy: {
      id: "admin",
      username: "admin",
      displayName: "站务组"
    },
    redemptionCount: 0
  },
  {
    id: "invite-2",
    code: "ALPHA-USER",
    note: "首批内测用户",
    isActive: false,
    maxUses: 3,
    useCount: 2,
    remainingUses: 1,
    createdAt: "2026-04-25T09:00:00.000Z",
    updatedAt: "2026-04-26T08:00:00.000Z",
    createdBy: {
      id: "admin",
      username: "admin",
      displayName: "站务组"
    },
    redemptionCount: 2
  }
];

const adminStats: AdminStats = {
  overview: {
    users: adminUsers.length,
    activeUsers: adminUsers.filter((user) => user.status === "ACTIVE").length,
    bannedUsers: adminUsers.filter((user) => user.status === "BANNED").length,
    posts: adminPosts.length,
    comments: posts.reduce((count, post) => count + post.comments.length, 0),
    boards: adminBoards.length,
    tags: tags.length,
    inviteCodes: inviteCodes.length,
    activeInviteCodes: inviteCodes.filter((invite) => invite.isActive).length,
    usedInviteCodes: inviteCodes.filter((invite) => invite.useCount > 0).length
  },
  reports: {
    pending: reports.filter((report) => report.status === "PENDING").length,
    resolved: reports.filter((report) => report.status === "RESOLVED").length,
    rejected: reports.filter((report) => report.status === "REJECTED").length
  },
  postsByStatus: {
    published: adminPosts.filter((post) => post.status === "PUBLISHED").length,
    hidden: adminPosts.filter((post) => post.status === "HIDDEN").length,
    deleted: adminPosts.filter((post) => post.status === "DELETED").length
  },
  today: {
    newUsers: 2,
    newPosts: 3,
    newComments: 6
  },
  topBoards: adminBoards
    .slice()
    .sort((a, b) => b._count.posts - a._count.posts)
    .slice(0, 4)
    .map((board) => ({
      id: board.id,
      slug: board.slug,
      name: board.name,
      color: board.color,
      postCount: board._count.posts,
      followerCount: board._count.followers
    })),
  recentActions: [
    {
      id: "action-1",
      action: "UPDATE_INVITE_CODE",
      targetType: "invite-code",
      targetId: "invite-2",
      note: "暂停外发",
      createdAt: "2026-04-26T11:00:00.000Z",
      actor: {
        id: "admin",
        username: "admin",
        displayName: "站务组"
      }
    },
    {
      id: "action-2",
      action: "RESOLVE_REPORT",
      targetType: "report",
      targetId: "report-2",
      note: "已核实并提醒",
      createdAt: "2026-04-26T09:30:00.000Z",
      actor: {
        id: "admin",
        username: "admin",
        displayName: "站务组"
      }
    }
  ]
};

export function getMockBoards() {
  return boards;
}

export function getMockTags() {
  return tags;
}

export function getMockPosts(sort: string = "latest"): PagedPosts {
  const list = [...posts];
  if (sort === "hot") {
    list.sort((a, b) => b.metrics.likes + b.metrics.comments * 2 - (a.metrics.likes + a.metrics.comments * 2));
  } else {
    list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }

  return {
    items: list,
    total: list.length,
    page: 1,
    pageSize: 12
  };
}

export function getMockBoard(slug: string): BoardDetail | null {
  const board = boards.find((entry) => entry.slug === slug);
  if (!board) {
    return null;
  }

  return {
    ...board,
    posts: posts.filter((post) => post.board.slug === slug)
  };
}

export function getMockPost(id: string): PostDetail | null {
  return posts.find((post) => post.id === id) ?? null;
}

export function getMockMe() {
  return me;
}

export function getMockReports() {
  return reports;
}

export function getMockAdminStats() {
  return adminStats;
}

export function getMockAdminPosts() {
  return adminPosts;
}

export function getMockAdminUsers() {
  return adminUsers;
}

export function getMockAdminBoards() {
  return adminBoards;
}

export function getMockAdminInviteCodes() {
  return inviteCodes;
}
