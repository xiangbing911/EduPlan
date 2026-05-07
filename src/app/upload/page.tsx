"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/nav";
import {
  Upload,
  FileText,
  FileCheck,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [serviceType, setServiceType] = useState<"paraphrase" | "format" | "both">("paraphrase");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const valid = droppedFiles.filter(
      (f) => f.name.endsWith(".docx") || f.name.endsWith(".pdf") || f.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...valid]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("serviceType", serviceType);
      for (const file of files) {
        formData.append("files", file);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "上传失败");
        return;
      }

      setOrderId(data.orderId);
      setFiles([]);
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Nav />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">上传文档</h1>
          <p className="text-slate-600 mb-8">
            上传您的学术文档，选择服务类型，系统将自动处理
          </p>

          {/* Service type selector */}
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-slate-900 mb-4">选择服务类型</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "paraphrase" as const, label: "论文润色", desc: "语言优化与表达提升" },
                { value: "format" as const, label: "格式排版", desc: "学术规范排版" },
                { value: "both" as const, label: "润色 + 排版", desc: "完整处理服务" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setServiceType(item.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    serviceType === item.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="font-medium text-sm text-slate-900">{item.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              dragging
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 hover:border-blue-400 bg-white"
            }`}
          >
            <Upload className={`w-10 h-10 mx-auto mb-4 ${dragging ? "text-blue-500" : "text-slate-400"}`} />
            <p className="text-sm text-slate-700 mb-1">
              拖拽文件到此处，或 <span className="text-blue-700 underline">点击选择文件</span>
            </p>
            <p className="text-xs text-slate-400">支持 .docx 和 .pdf 格式</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.pdf"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="card p-4 mt-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">已选择 {files.length} 个文件</h3>
              <ul className="space-y-2">
                {files.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {file.name.endsWith(".docx") ? (
                        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <FileCheck className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <span className="text-sm text-slate-700 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                      className="text-slate-400 hover:text-red-500 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || loading}
            className="w-full btn-primary mt-6 text-base py-3"
          >
            {loading ? "提交中..." : `创建订单并上传 (${files.length} 个文件)`}
          </button>

          {error && (
            <div className="flex items-center gap-2 mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {orderId && (
            <div className="flex items-center gap-2 mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              订单创建成功！
              <a href={`/orders/${orderId}`} className="underline ml-1">
                查看详情
              </a>
            </div>
          )}

          {/* Price info */}
          <div className="mt-8 card p-6 bg-gradient-to-br from-blue-50 to-white">
            <h3 className="font-semibold text-blue-900 mb-3">费用说明</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>论文润色：<span className="font-medium">¥{files.length > 0 ? (files[0].size > 50000 ? "80" : "50") : "50"}</span> / 篇</li>
              <li>格式排版：<span className="font-medium">¥{files.length > 0 ? (files[0].size > 50000 ? "60" : "30") : "30"}</span> / 篇</li>
              <li>润色 + 排版：<span className="font-medium">优惠 ¥{files.length > 0 ? (files[0].size > 50000 ? "100" : "70") : "70"}</span> / 篇</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
