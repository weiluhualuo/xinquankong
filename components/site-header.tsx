"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearStoredAuthToken, getMe, getStoredAuthToken } from "../lib/api";

const publicNavItems = [
  { href: "/", label: "首页" },
  { href: "/boards", label: "板块" },
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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 font-semibold text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-[linear-gradient(135deg,#111111,#2b2f35)] text-xs font-bold text-white shadow-sm">XQK</span>
            <span className="hidden sm:inline">新泉空</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/me" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-slate-900">我的</Link>
              <button onClick={logout} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-[var(--accent)]">退出登录</button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-slate-900">登录</Link>
              <Link href="/publish" className="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">发帖</Link>
            </>
          )}
        </div>

        <button type="button" onClick={() => setMobileOpen((v) => !v)} className="md:hidden rounded-lg p-2 text-sm font-medium text-slate-700">
          Menu
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                {item.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link href="/me" onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">我的</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-rose-600 hover:bg-rose-50">退出登录</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">登录</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}