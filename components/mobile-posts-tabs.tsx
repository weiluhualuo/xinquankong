"use client";

import { useState } from "react";

export function MobilePostsTabs({
  latestContent,
  hotContent,
}: {
  latestContent: React.ReactNode;
  hotContent: React.ReactNode;
}) {
  const [active, setActive] = useState<"latest" | "hot">("latest");

  return (
    <>
      <div className="mb-4 flex gap-2 lg:hidden">
        <button
          onClick={() => setActive("latest")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
            active === "latest"
              ? "bg-slate-900 text-white shadow-md"
              : "border border-slate-200 bg-white text-slate-600 hover:shadow-sm"
          }`}
        >
          最新
        </button>
        <button
          onClick={() => setActive("hot")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
            active === "hot"
              ? "bg-slate-900 text-white shadow-md"
              : "border border-slate-200 bg-white text-slate-600 hover:shadow-sm"
          }`}
        >
          热门
        </button>
      </div>
      <div className={`mobile-latest lg:hidden transition-opacity duration-300 ${active === "latest" ? "opacity-100" : "opacity-0 hidden"}`}>
        {latestContent}
      </div>
      <div className={`mobile-hot lg:hidden transition-opacity duration-300 ${active === "hot" ? "opacity-100" : "opacity-0 hidden"}`}>
        {hotContent}
      </div>
    </>
  );
}
