"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMe } from "../lib/api";

export function PostEditButton({ authorId, postId }: { authorId: string; postId: string }) {
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    getMe().then((user) => {
      if (user && user.id === authorId) {
        setIsAuthor(true);
      }
    }).catch(() => {});
  }, [authorId]);

  if (!isAuthor) return null;

  return (
    <Link
      href={`/post/${postId}/edit`}
      className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      编辑
    </Link>
  );
}
