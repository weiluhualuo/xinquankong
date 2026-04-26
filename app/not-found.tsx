import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-8xl font-black text-black">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            内容不存在或已被下架
          </h2>
          <p className="text-neutral-500">
            你寻找的页面已经消失在信息流中。
          </p>
        </div>
        <div className="pt-8">
          <Link 
            href="/" 
            className="inline-flex h-11 items-center justify-center rounded-md bg-black px-8 font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
