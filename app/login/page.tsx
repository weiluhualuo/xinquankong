import { LoginForm } from "../../components/login-form";
import { BackgroundEffect } from "../../components/background-effect";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* 动态背景效果 - 鼠标跟踪 */}
      <BackgroundEffect />

      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pointer-events-none z-0"></div>

      {/* 装饰网格 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-10"></div>

      {/* 漂浮粒子 */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-blue-400/40 animate-float pointer-events-none z-10" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-cyan-400/30 animate-float pointer-events-none z-10" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-blue-300/30 animate-float pointer-events-none z-10" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-cyan-300/40 animate-float pointer-events-none z-10" style={{ animationDelay: '2.5s' }}></div>
      <div className="absolute bottom-1/4 right-1/3 w-2.5 h-2.5 rounded-full bg-purple-400/20 animate-float pointer-events-none z-10" style={{ animationDelay: '3s' }}></div>

      <div className="w-full max-w-md relative z-20 animate-scale-in">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6">
            {/* Logo 外发光 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 blur-xl opacity-60 animate-pulse"></div>
            {/* Logo 本体 */}
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50 animate-float">
              <span className="text-white font-bold text-xl">XQK</span>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">
            欢迎来到新权空
          </h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            V1 阶段使用邀请码注册，联系管理员获取
          </p>
        </div>

        {/* 表单卡片 - 高对比度设计 */}
        <div className="relative p-[3px] rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 shadow-xl shadow-blue-500/40">
          <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-500/20 blur-lg"></div>
          <div className="relative bg-white rounded-xl p-8 shadow-2xl">
            <LoginForm />
          </div>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-xs text-slate-400 mt-6">
          登录即表示同意我们的
          <a href="#" className="text-blue-400 hover:text-blue-300 mx-1">服务条款</a>
          和
          <a href="#" className="text-blue-400 hover:text-blue-300 mx-1">隐私政策</a>
        </p>
      </div>
    </div>
  );
}

