"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearStoredAuthToken, getMe, getStoredAuthToken } from "../lib/api";

const publicNavItems = [
  { href: "/", label: "首页" },
  { href: "/boards", label: "板块" },
  { href: "/notifications", label: "通知" },
  { href: "/publish", label: "发布" }
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = getStoredAuthToken();
    setIsLoggedIn(!!token);
    if (!token) {
      setIsAdmin(false);
      return;
    }

    let active = true;
    void getMe()
      .then((user) => {
        if (!active) {
          return;
        }

        if (!user) {
          clearStoredAuthToken();
          setIsLoggedIn(false);
          setIsAdmin(false);
          return;
        }

        setIsLoggedIn(true);
        setIsAdmin(user.role === "ADMIN");
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setIsAdmin(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const logout = () => {
    clearStoredAuthToken();
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = "/";
  };

  // Author: 花落 | MIT License. Only surface the admin entry to confirmed admins.
  const navItems = isAdmin ? [...publicNavItems, { href: "/admin", label: "后台" }] : publicNavItems;

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 font-semibold text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#06b6d4,#0ea5e9)] text-xs font-bold text-white shadow-sm shadow-cyan-500/20 transition-transform hover:scale-110">XQK</span>
            <span className="hidden sm:inline">新权空</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-cyan-50 hover:text-cyan-700 hover:tracking-wide">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/me" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-700">我的</Link>
              <button onClick={logout} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700">退出登录</button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-700">登录</Link>
              <Link href="/publish" className="rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:from-cyan-600 hover:to-sky-600 shadow-sm shadow-cyan-500/20">发帖</Link>
            </>
          )}
        </div>

        <button type="button" onClick={() => setMobileOpen((v) => !v)} className="md:hidden rounded-lg p-2 text-slate-700" aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}>
          <svg className="h-6 w-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 top-14 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 border-t border-white/20 glass-strong px-4 py-4 shadow-lg md:hidden animate-slide-down">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-cyan-50">
                  {item.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  <Link href="/me" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-cyan-50">我的</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50">退出登录</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-cyan-50">登录</Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}