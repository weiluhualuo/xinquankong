"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ApiError,
  getMyNotifications,
  getMyNotificationUnreadCount,
  getStoredAuthToken,
  markAllMyNotificationsAsRead,
  markMyNotificationAsRead
} from "../lib/api";
import type { NotificationListResult, NotificationRecord } from "../lib/types";

const PAGE_SIZE = 12;

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "通知加载失败，请稍后再试。";
}

function getNotificationHref(notification: NotificationRecord) {
  if (notification.target.type === "POST") {
    return `/post/${notification.target.id}`;
  }

  return "/me";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("zh-CN");
}

export function NotificationsPageClient() {
  const [data, setData] = useState<NotificationListResult | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyKey, setBusyKey] = useState("");
  const [loggedIn, setLoggedIn] = useState(true);

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.total / data.pageSize));
  }, [data]);

  const load = async (nextPage = page) => {
    setLoading(true);
    setError("");
    try {
      const token = getStoredAuthToken();
      if (!token) {
        setLoggedIn(false);
        setData(null);
        return;
      }

      setLoggedIn(true);
      const [list, unread] = await Promise.all([
        getMyNotifications(nextPage, PAGE_SIZE),
        getMyNotificationUnreadCount()
      ]);
      setData({ ...list, unreadCount: unread.unreadCount });
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(page);
  }, [page]);

  const handleMarkAsRead = async (notificationId: string) => {
    setBusyKey(`read-${notificationId}`);
    setError("");
    try {
      await markMyNotificationAsRead(notificationId);
      setData((current) => {
        if (!current) return current;
        return {
          ...current,
          unreadCount: Math.max(0, current.unreadCount - (current.items.find((item) => item.id === notificationId && !item.isRead) ? 1 : 0)),
          items: current.items.map((item) => item.id === notificationId ? { ...item, isRead: true, readAt: new Date().toISOString() } : item)
        };
      });
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    } finally {
      setBusyKey("");
    }
  };

  const handleMarkAllAsRead = async () => {
    setBusyKey("read-all");
    setError("");
    try {
      await markAllMyNotificationsAsRead();
      setData((current) => current ? {
        ...current,
        unreadCount: 0,
        items: current.items.map((item) => ({ ...item, isRead: true, readAt: item.readAt ?? new Date().toISOString() }))
      } : current);
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    } finally {
      setBusyKey("");
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">请先登录</h1>
          <p className="mt-3 text-sm text-slate-500">登录后才能查看与你相关的互动通知。</p>
          <div className="mt-6">
            <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white">前往登录</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 py-12 text-slate-900 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">通知中心</div>
              <h1 className="mt-4 text-3xl font-black tracking-tight">我的通知</h1>
              <p className="mt-2 text-sm text-slate-500">这里集中查看点赞、收藏、评论、回复与举报处理结果。</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                未读 {data?.unreadCount ?? 0}
              </div>
              <button
                type="button"
                onClick={() => void handleMarkAllAsRead()}
                disabled={busyKey === "read-all" || !data || data.unreadCount === 0}
                className="rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busyKey === "read-all" ? "处理中..." : "全部标为已读"}
              </button>
            </div>
          </div>

          {error && <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{error}</div>}

          {loading && !data ? (
            <div className="mt-8 space-y-4 animate-pulse">
              <div className="h-28 rounded-2xl bg-slate-100" />
              <div className="h-28 rounded-2xl bg-slate-100" />
              <div className="h-28 rounded-2xl bg-slate-100" />
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
              <h2 className="text-lg font-bold text-slate-900">还没有通知</h2>
              <p className="mt-2 text-sm text-slate-500">有人给你的帖子点赞、评论或回复后，会在这里出现。</p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {data.items.map((item) => (
                <div key={item.id} className={`rounded-2xl border p-5 transition ${item.isRead ? "border-slate-200 bg-white" : "border-sky-200 bg-sky-50/60"}`}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className={`rounded-full px-2.5 py-1 font-semibold ${item.isRead ? "border border-slate-200 bg-slate-50 text-slate-600" : "border border-sky-200 bg-white text-sky-700"}`}>
                          {item.isRead ? "已读" : "未读"}
                        </span>
                        <span>{item.type}</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
                        {item.actor && <span className="text-sm text-slate-500">来自 {item.actor.displayName}</span>}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.content}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Link href={getNotificationHref(item)} className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                        查看详情
                      </Link>
                      {!item.isRead && (
                        <button
                          type="button"
                          onClick={() => void handleMarkAsRead(item.id)}
                          disabled={busyKey === `read-${item.id}`}
                          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-900 bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-50"
                        >
                          {busyKey === `read-${item.id}` ? "处理中..." : "标为已读"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data && data.total > data.pageSize && (
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
              >
                上一页
              </button>
              <div className="text-sm text-slate-500">第 {page} / {totalPages} 页</div>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
