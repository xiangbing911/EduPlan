import Link from "next/link";
import Nav from "@/components/nav";
import { FileText, PenTool, FileCheck, ArrowRight, Upload, Shield, Clock, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
              学术文档智能润色与排版
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              一键完成论文润色、格式排版，让学术写作更专业。
              支持 .docx 和 PDF 格式，智能识别学术规范。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/upload"
                className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-blue-800 transition-colors shadow-sm"
              >
                <Upload className="w-5 h-5" />
                开始上传
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-300 px-8 py-3 rounded-xl text-base font-semibold hover:bg-slate-50 transition-colors"
              >
                查看订单
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">核心功能</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              <FeatureCard
                icon={<PenTool className="w-6 h-6" />}
                title="AI 论文润色"
                description="智能识别学术语境，优化语言表达，提升论文的专业性和可读性"
              />
              <FeatureCard
                icon={<FileCheck className="w-6 h-6" />}
                title="格式排版"
                description="按目标期刊或学位论文的学术规范，自动调整字体、间距、引用格式"
              />
              <FeatureCard
                icon={<FileText className="w-6 h-6" />}
                title="双格式支持"
                description="同时支持 .docx 和 PDF 文件上传与处理，保留原始排版结构"
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-6 bg-blue-50">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              <Stat icon={<Shield className="w-5 h-5" />} label="数据安全" value="100%" />
              <Stat icon={<Clock className="w-5 h-5" />} label="处理速度" value="24h" desc="内完成" />
              <Stat icon={<Users className="w-5 h-5" />} label="服务用户" value="500+" />
              <Stat icon={<FileText className="w-5 h-5" />} label="处理文档" value="2000+" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              准备好了吗？
            </h2>
            <p className="text-slate-600 mb-8">
              上传您的学术文档，体验专业的智能润色与排版服务
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-blue-700 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-blue-800 transition-colors"
            >
              立即开始
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} EduPlan 学术文档助手. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  desc,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  desc?: string;
}) {
  return (
    <div>
      <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-white text-blue-700 flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div className="text-2xl font-bold text-blue-900">{value}</div>
      {desc && <div className="text-sm text-blue-700">{desc}</div>}
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}
