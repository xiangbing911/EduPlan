"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Nav from "@/components/nav";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Download,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

type Status = "pending" | "processing" | "completed" | "failed";

interface OrderDetail {
  id: string;
  originalFileName: string;
  serviceType: string;
  price: number;
  status: Status;
  progress: number;
  resultFilePath: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    async function fetchOrder() {
      const res = await fetch(`/api/orders/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
      setLoading(false);
    }
    fetchOrder();

    // Poll for updates if processing
    const interval = setInterval(async () => {
      if (order?.status !== "processing") return;
      const res = await fetch(`/api/orders/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        if (data.status === "completed" || data.status === "failed") {
          clearInterval(interval);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [params.id]);

  const handleProcess = async () => {
    if (!order) return;
    setProcessing(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${order.id}/process`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "处理失败");
        return;
      }
      setOrder((prev) => (prev ? { ...prev, status: "processing", progress: 0 } : prev));
    } catch {
      setError("网络错误");
    } finally {
      setProcessing(false);
    }
  };

  const statusConfig: Record<Status, { label: string; color: string; icon: any }> = {
    pending: { label: "待处理", color: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
    processing: { label: "处理中", color: "text-blue-700 bg-blue-50 border-blue-200", icon: Loader2 },
    completed: { label: "已完成", color: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle },
    failed: { label: "已失败", color: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h2 className="text-lg font-medium text-slate-500 mb-2">订单不存在</h2>
            <button onClick={() => router.push("/orders")} className="btn-primary">
              返回订单列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Nav />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="btn-ghost flex items-center gap-2 mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            返回订单列表
          </button>

          <div className="card p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{order.originalFileName}</h1>
                  <p className="text-sm text-slate-500 mt-0.5">订单号：{order.id}</p>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${status.color}`}>
                {status.label}
              </span>
            </div>

            {/* Progress bar */}
            {order.status === "processing" && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>处理进度</span>
                  <span>{order.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${order.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-xs text-slate-500 mb-1">服务类型</div>
                <div className="font-medium text-slate-900">
                  {order.serviceType === "paraphrase" && "论文润色"}
                  {order.serviceType === "format" && "格式排版"}
                  {order.serviceType === "both" && "润色 + 排版"}
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-xs text-slate-500 mb-1">费用</div>
                <div className="font-medium text-slate-900">¥{order.price}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-xs text-slate-500 mb-1">创建时间</div>
                <div className="font-medium text-slate-900 text-sm">
                  {new Date(order.createdAt).toLocaleString("zh-CN")}
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-xs text-slate-500 mb-1">更新时间</div>
                <div className="font-medium text-slate-900 text-sm">
                  {new Date(order.updatedAt).toLocaleString("zh-CN")}
                </div>
              </div>
            </div>

            {/* Error message */}
            {order.errorMessage && (
              <div className="flex items-start gap-3 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium mb-1">处理失败</div>
                  <div>{order.errorMessage}</div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {order.status === "pending" && (
                <button
                  onClick={handleProcess}
                  disabled={processing}
                  className="btn-primary flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${processing ? "animate-spin" : ""}`} />
                  {processing ? "处理中..." : "开始处理"}
                </button>
              )}
              {order.status === "completed" && order.resultFilePath && (
                <a
                  href={`/api/orders/${order.id}/download`}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  下载结果
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
