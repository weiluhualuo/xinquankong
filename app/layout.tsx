import type { Metadata } from "next";
import { SiteHeader } from "../components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "新泉空 | 泛兴趣论坛",
  description: "一个以公开发帖讨论为核心的泛兴趣论坛。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
