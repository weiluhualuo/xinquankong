"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, clearStoredAuthToken, loginUser, registerUser, setStoredAuthToken } from "../lib/api";

function extractMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "请求失败，请稍后重试";
}

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(e.currentTarget);
      const username = String(formData.get("username") ?? "").trim();
      const password = String(formData.get("password") ?? "");
      const confirmPassword = String(formData.get("confirmPassword") ?? "");
      const inviteCode = String(formData.get("inviteCode") ?? "").trim();
      const displayName = String(formData.get("displayName") ?? "").trim();

      if (mode === "register") {
        if (password !== confirmPassword) {
          throw new Error("两次输入的密码不一致");
        }

        const result = await registerUser({
          username,
          password,
          inviteCode,
          ...(displayName ? { displayName } : {})
        });

        setStoredAuthToken(result.token);
        setSuccess("注册成功，正在跳转...");
        setTimeout(() => {
          router.push(result.user.role === "ADMIN" ? "/admin" : "/");
          router.refresh();
        }, 600);
        return;
      }

      const result = await loginUser({ username, password });
      setStoredAuthToken(result.token);
      setSuccess("登录成功，正在跳转...");
      setTimeout(() => {
        router.push(result.user.role === "ADMIN" ? "/admin" : "/");
        router.refresh();
      }, 500);
    } catch (submitError) {
      clearStoredAuthToken();
      setError(extractMessage(submitError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative mb-8 flex rounded-xl bg-slate-100 p-1">
        <div
          className={`absolute bottom-1 top-1 w-1/2 rounded-lg bg-white shadow-md transition-all duration-300 ${
            mode === "login" ? "left-1" : "left-1/2"
          }`}
        />
        <button
          type="button"
          className={`z-10 flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            mode === "login" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => {
            setMode("login");
            setError("");
            setSuccess("");
          }}
        >
          登录
        </button>
        <button
          type="button"
          className={`z-10 flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            mode === "register" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => {
            setMode("register");
            setError("");
            setSuccess("");
          }}
        >
          注册
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="animate-shake rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">{error}</div>}
        {success && <div className="animate-fade-in rounded-lg border border-green-100 bg-green-50 p-3 text-sm font-medium text-green-600">{success}</div>}

        <div className="space-y-4">
          <div className="group relative">
            <label className="mb-1.5 block text-sm font-semibold text-slate-700 transition-colors group-focus-within:text-blue-600">用户名</label>
            <input type="text" name="username" required minLength={3} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="设置你的用户名" />
          </div>

          {mode === "register" && (
            <div className="group relative">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 transition-colors group-focus-within:text-blue-600">显示昵称</label>
              <input type="text" name="displayName" maxLength={30} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="可选，不填则默认使用用户名" />
            </div>
          )}

          <div className="group relative">
            <label className="mb-1.5 block text-sm font-semibold text-slate-700 transition-colors group-focus-within:text-blue-600">密码</label>
            <input type="password" name="password" required minLength={6} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder={mode === "login" ? "输入你的密码" : "设置登录密码"} />
          </div>

          {mode === "register" && (
            <>
              <div className="group relative">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 transition-colors group-focus-within:text-blue-600">确认密码</label>
                <input type="password" name="confirmPassword" required minLength={6} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="再次输入密码" />
              </div>

              <div className="group relative">
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition-colors group-focus-within:text-blue-600">邀请码</label>
                <div className="relative">
                  <input type="text" name="inviteCode" required className="w-full rounded-xl border border-blue-200/50 bg-gradient-to-r from-blue-50/50 to-cyan-50/30 px-4 py-3 font-mono text-sm uppercase tracking-wider transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="输入邀请码" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-pulse text-xs font-medium text-blue-400">必填</span>
                </div>
                <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">V1 阶段需要邀请码注册，联系管理员获取</p>
              </div>
            </>
          )}
        </div>

        {mode === "login" && <div className="text-right"><span className="text-xs text-slate-400">管理员登录后可进入完整后台</span></div>}

        <button type="submit" disabled={isLoading} className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-8 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/50 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-blue-500/30">
          {isLoading ? "处理中..." : mode === "login" ? "登录" : "注册"}
        </button>
      </form>
    </div>
  );
}
