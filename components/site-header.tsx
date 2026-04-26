"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/boards", label: "板块" },
  { href: "/publish", label: "发帖" },
  { href: "/admin", label: "管理台" }
];

export function SiteHeader() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/80">
      {/* 顶部渐变光效线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>

      <div className="mx-auto max-w-5xl px-4 flex h-14 items-center justify-between relative">
        {/* 左侧 Logo + 导航（桌面） */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/40 transition-all duration-300 animate-pulse">
              <span className="relative z-10">XQK</span>
            </span>
            <span className="hidden font-bold sm:inline-block">
              <span className="text-white">新权空</span>
              <span className="text-xs text-slate-400 font-normal ml-1.5">泛兴趣论坛</span>
            </span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  hoveredItem === item.href
                    ? "text-white bg-slate-700"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
                {hoveredItem === item.href && (
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30"></span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* 右侧按钮（桌面） */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800"
          >
            登录
          </Link>
          <Link
            href="/publish"
            className="group relative inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0 h-9 px-5"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              发帖
            </span>
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
        </div>

        {/* 移动端汉堡菜单按钮 */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden items-center justify-center w-10 h-10 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="菜单"
        >
          <div className="relative w-5 h-5">
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 top-1/2" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 top-1/2" : "translate-y-1.5"
              }`}
            />
          </div>
        </button>
      </div>

      {/* 移动端下拉菜单 */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-2 border-t border-slate-700/50 bg-slate-900/98">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-700/50 space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
            >
              登录
            </Link>
            <Link
              href="/publish"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-lg shadow-blue-500/30 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              发帖
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

