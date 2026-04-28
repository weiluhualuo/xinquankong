import type { Dispatch, SetStateAction } from "react";
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

export type SectionKey = "overview" | "homepage" | "reports" | "posts" | "post-types" | "users" | "boards" | "tags" | "invite-codes" | "announcements";

export type DashboardBundle = {
  stats: AdminStats;
  homepageContent: AdminHomepageContentRecord;
  reports: ReportSummary[];
  posts: AdminPostRecord[];
  postTypes: AdminPostTypeOptionRecord[];
  users: AdminUserRecord[];
  boards: AdminBoardRecord[];
  announcements: AdminAnnouncementRecord[];
  tags: AdminTagRecord[];
  inviteCodes: AdminInviteCodeSummary[];
};

export type BoardFormState = {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
};

export type TagFormState = {
  id: string;
  slug: string;
  name: string;
};

export type InviteFormState = {
  id: string;
  code: string;
  note: string;
  maxUses: number;
  isActive: boolean;
};

export type BatchFormState = {
  count: number;
  note: string;
  maxUses: number;
  isActive: boolean;
};

export type HomepageContentFormState = {
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
};

export type PostTypeFormState = {
  id: string;
  value: string;
  label: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

export type StateSetter<T> = Dispatch<SetStateAction<T>>;

export type RunAdminAction = (key: string, action: () => Promise<unknown>, keepForms?: boolean) => Promise<void>;
export type AskAdminNote = (title: string) => string | undefined | null;

export type AnnouncementFormState = {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  sortOrder: number;
};