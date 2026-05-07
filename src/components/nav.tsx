"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Upload, ClipboardList, LogOut, User } from "lucide-react";
import { getSession } from "@/lib/auth";

export default async function Nav() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-blue-900">
          <FileText className="w-5 h-5" />
          EduPlan 学术文档助手
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink href="/" icon={<FileText className="w-4 h-4" />}>
            首页
          </NavLink>
          {session ? (
            <>
              <NavLink href="/upload" icon={<Upload className="w-4 h-4" />}>
                上传文档
              </NavLink>
              <NavLink href="/orders" icon={<ClipboardList className="w-4 h-4" />}>
                我的订单
              </NavLink>
              <span className="flex items-center gap-1 text-sm text-slate-500 px-3">
                <User className="w-4 h-4" />
                {session.email}
              </span>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="btn-ghost flex items-center gap-1">
                  <LogOut className="w-4 h-4" />
                  退出
                </button>
              </form>
            </>
          ) : (
            <NavLink href="/login" icon={<User className="w-4 h-4" />}>
              登录
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
