"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, loginUser, registerUser } from "../lib/api";

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

        const user = await registerUser({
          username,
          password,
          inviteCode,
          ...(displayName ? { displayName } : {})
        });

        setSuccess("注册成功，正在跳转...");
        setTimeout(() => {
          router.push(user.role === "ADMIN" ? "/admin" : "/");
          router.refresh();
        }, 600);
        return;
      }

      const user = await loginUser({ username, password });
      setSuccess("登录成功，正在跳转...");
      setTimeout(() => {
        router.push(user.role === "ADMIN" ? "/admin" : "/");
        router.refresh();
      }, 500);
    } catch (submitError) {
      setError(extractMessage(submitError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex p-1 mb-8 bg-slate-100 rounded-xl relative">
        <div
          className={`absolute top-1 bottom-1 w-1/2 rounded-lg bg-white shadow-md transition-all duration-300 ${
            mode === "login" ? "left-1" : "left-1/2"
          }`}
        />
        <button
          type="button"
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all z-10 ${
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
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all z-10 ${
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
        {error && (
          <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg animate-shake">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-sm font-medium text-green-600 bg-green-50 border border-green-100 rounded-lg animate-fade-in">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative group">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 group-focus-within:text-blue-600 transition-colors">
              用户名
            </label>
            <input
              type="text"
              name="username"
              required
              minLength={3}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400"
              placeholder="设置你的用户名"
            />
          </div>

          {mode === "register" && (
            <div className="relative group">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 group-focus-within:text-blue-600 transition-colors">
                显示昵称
              </label>
              <input
                type="text"
                name="displayName"
                maxLength={30}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400"
                placeholder="可选，不填则默认使用用户名"
              />
            </div>
          )}

          <div className="relative group">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 group-focus-within:text-blue-600 transition-colors">
              密码
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400"
              placeholder={mode === "login" ? "输入你的密码" : "设置登录密码"}
            />
          </div>

          {mode === "register" && (
            <>
              <div className="relative group">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 group-focus-within:text-blue-600 transition-colors">
                  确认密码
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400"
                  placeholder="再次输入密码"
                />
              </div>

              <div className="relative group">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5 group-focus-within:text-blue-600 transition-colors">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  邀请码
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="inviteCode"
                    required
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-50/50 to-cyan-50/30 border border-blue-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400 font-mono tracking-wider uppercase"
                    placeholder="输入邀请码"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-400 font-medium animate-pulse">
                    必填
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  V1 阶段需要邀请码注册，联系管理员获取
                </p>
              </div>
            </>
          )}
        </div>

        {mode === "login" && (
          <div className="text-right">
            <span className="text-xs text-slate-400">管理员登录后可进入完整后台</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 h-12 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-8 font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-blue-500/30"
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : mode === "login" ? (
            "登录"
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              注册
            </>
          )}
        </button>
      </form>
    </div>
  );
}
