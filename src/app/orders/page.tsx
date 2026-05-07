"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/nav";
import {
  ClipboardList,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Search,
} from "lucide-react";

type Status = "pending" | "processing" | "completed" | "failed";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search && !o.originalFileName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusConfig: Record<Status, { label: string; color: string; icon: any }> = {
    pending: { label: "待处理", color: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
    processing: { label: "处理中", color: "text-blue-700 bg-blue-50 border-blue-200", icon: Loader2 },
    completed: { label: "已完成", color: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle },
    failed: { label: "已失败", color: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Nav />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">我的订单</h1>
              <p className="text-slate-600 mt-1">查看和管理您的文档处理订单</p>
            </div>
            <Link href="/upload" className="btn-primary flex items-center gap-2">
              <FileText className="w-4 h-4" />
              新建订单
            </Link>
          </div>

          {/* Filters */}
          <div className="card p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索文件名..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <div className="flex gap-1">
                {[
                  { key: "all", label: "全部" },
                  { key: "pending", label: "待处理" },
                  { key: "processing", label: "处理中" },
                  { key: "completed", label: "已完成" },
                  { key: "failed", label: "已失败" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFilter(item.key)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === item.key
                        ? "bg-blue-100 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Orders list */}
          {loading ? (
            <div className="text-center py-16 text-slate-400">
              <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" />
              加载中...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-500 mb-2">暂无订单</h3>
              <p className="text-slate-400 mb-4">上传文档开始使用学术文档服务</p>
              <Link href="/upload" className="btn-primary">
                去上传
              </Link>
            </div>
          ) : (
            <div className="card divide-y divide-slate-100">
              {filtered.map((order) => {
                const status = statusConfig[order.status as Status] || statusConfig.pending;
                const Icon = status.icon;
                return (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${status.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900 truncate">
                          {order.originalFileName}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {order.serviceType === "paraphrase" && "论文润色"}
                        {order.serviceType === "format" && "格式排版"}
                        {order.serviceType === "both" && "润色 + 排版"}
                        {" · "}
                        {order.status === "completed"
                          ? `¥${order.price}`
                          : "待报价"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {order.status === "processing" && (
                        <div className="text-right">
                          <div className="text-xs text-slate-400 mb-1">进度</div>
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${order.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
