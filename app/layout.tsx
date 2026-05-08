import type { Metadata } from "next";
import { SiteHeader } from "../components/site-header";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "新权空 | 论坛",
  description: "一个以公开讨论为核心的轻量论坛。",
  openGraph: {
    title: "新权空 | 论坛",
    description: "一个以公开讨论为核心的轻量论坛。",
    siteName: "新权空",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "新权空 | 论坛",
    description: "一个以公开讨论为核心的轻量论坛。",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}