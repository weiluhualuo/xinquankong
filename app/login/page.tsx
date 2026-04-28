import { BackgroundEffect } from "../../components/background-effect";
import { LoginForm } from "../../components/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden px-4 py-12">
      <BackgroundEffect />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950" />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="absolute left-1/4 top-1/4 z-10 h-2 w-2 animate-float rounded-full bg-sky-300/40" style={{ animationDelay: "0.5s" }} />
      <div className="absolute right-1/4 top-1/3 z-10 h-3 w-3 animate-float rounded-full bg-sky-200/30" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-1/3 left-1/3 z-10 h-2 w-2 animate-float rounded-full bg-sky-100/30" style={{ animationDelay: "2s" }} />
      <div className="absolute right-1/3 top-1/2 z-10 h-1.5 w-1.5 animate-float rounded-full bg-sky-300/40" style={{ animationDelay: "2.5s" }} />

      <div className="relative z-20 w-full max-w-md animate-scale-in">
        <div className="mb-8 text-center">
          <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-200 opacity-60 blur-xl animate-pulse" />
            <div className="relative inline-flex h-16 w-16 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-200 shadow-lg shadow-sky-400/40">
              <span className="text-xl font-bold text-slate-950">XQK</span>
            </div>
          </div>

          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white">欢迎来到新泉空</h1>
          <p className="mx-auto max-w-sm text-sm text-slate-300">V1 阶段使用邀请码注册，请向管理员获取。</p>
        </div>

        <div className="relative rounded-2xl bg-gradient-to-r from-sky-400 via-sky-200 to-white p-[3px] shadow-xl shadow-sky-400/30">
          <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-sky-400/20 via-sky-200/20 to-white/20 blur-lg" />
          <div className="relative rounded-xl bg-white p-8 shadow-2xl">
            <LoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-300">
          登录即表示同意我们的
          <a href="#" className="mx-1 text-sky-300 hover:text-sky-200">服务条款</a>
          和
          <a href="#" className="mx-1 text-sky-300 hover:text-sky-200">隐私政策</a>
        </p>
      </div>
    </div>
  );
}