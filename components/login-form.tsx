"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, clearStoredAuthToken, loginUser, registerUser, setStoredAuthToken } from "../lib/api";

function extractMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "请求失败，请稍后再试。";
}

function getValidationMessage(name: string, value: string, minLength?: number) {
  const trimmed = value.trim();

  if (name === "username") {
    if (!trimmed) return "请输入用户名";
    if (minLength && trimmed.length < minLength) return "用户名至少 3 个字符";
    return "";
  }

  if (name === "password") {
    if (!value) return "请输入密码";
    if (minLength && value.length < minLength) return "密码至少 6 个字符";
    return "";
  }

  if (name === "confirmPassword") {
    if (!value) return "请再次输入密码";
    if (minLength && value.length < minLength) return "确认密码至少 6 个字符";
    return "";
  }

  if (name === "inviteCode") {
    if (!trimmed) return "请输入邀请码";
    return "";
  }

  return "";
}

function applyValidationMessage(event: React.InvalidEvent<HTMLInputElement>) {
  const target = event.currentTarget;
  const minLength = typeof target.minLength === "number" && target.minLength > 0 ? target.minLength : undefined;
  target.setCustomValidity(getValidationMessage(target.name, target.value, minLength));
}

function clearValidationMessage(event: React.FormEvent<HTMLInputElement>) {
  event.currentTarget.setCustomValidity("");
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
          className={`z-10 flex-1 rounded-lg py-2.5 text-sm font-semibold ${mode === "login" ? "text-slate-900" : "text-slate-500"}`}
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
          className={`z-10 flex-1 rounded-lg py-2.5 text-sm font-semibold ${mode === "register" ? "text-slate-900" : "text-slate-500"}`}
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
        {error && <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700">{error}</div>}
        {success && <div className="rounded-lg border border-[var(--border)] bg-[var(--accent)] p-3 text-sm font-medium text-[var(--accent-foreground)]">{success}</div>}

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">用户名</label>
            <input
              type="text"
              name="username"
              required
              minLength={3}
              onInvalid={applyValidationMessage}
              onInput={clearValidationMessage}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-[var(--primary-strong)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(159,196,234,0.45)]"
              placeholder="设置你的用户名"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">显示名称</label>
              <input
                type="text"
                name="displayName"
                maxLength={30}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-[var(--primary-strong)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(159,196,234,0.45)]"
                placeholder="可选，不填则默认使用用户名"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">密码</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              onInvalid={applyValidationMessage}
              onInput={clearValidationMessage}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-[var(--primary-strong)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(159,196,234,0.45)]"
              placeholder={mode === "login" ? "输入你的密码" : "设置登录密码"}
            />
          </div>

          {mode === "register" && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">确认密码</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  onInvalid={applyValidationMessage}
                  onInput={clearValidationMessage}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-[var(--primary-strong)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(159,196,234,0.45)]"
                  placeholder="再次输入密码"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">邀请码</label>
                <input
                  type="text"
                  name="inviteCode"
                  required
                  onInvalid={applyValidationMessage}
                  onInput={clearValidationMessage}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 font-mono text-sm uppercase tracking-wider focus:border-[var(--primary-strong)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(159,196,234,0.45)]"
                  placeholder="输入邀请码"
                />
                <p className="mt-1.5 text-xs text-slate-400">当前注册需要邀请码。</p>
              </div>
            </>
          )}
        </div>

        {mode === "login" && <div className="text-right text-xs text-slate-400">管理员登录后会自动跳转到后台。</div>}

        <button type="submit" disabled={isLoading} className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-slate-900 bg-slate-900 px-8 font-semibold text-white disabled:opacity-50">
          {isLoading ? "提交中..." : mode === "login" ? "登录" : "注册"}
        </button>
      </form>
    </div>
  );
}