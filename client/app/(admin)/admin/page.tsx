"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderTree,
  BookOpen,
  HelpCircle,
  History as HistoryIcon,
  UploadCloud,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Layers,
  RefreshCw,
} from "lucide-react";
import { useApiClient } from "@/hooks/useApiClient";
import { AdminOverviewStats } from "@/types";

export default function AdminOverviewPage() {
  const api = useApiClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<{ data: AdminOverviewStats }>("/admin/overview");
      setStats(res.data);
    } catch (err: any) {
      setError(err?.message || "Failed to load admin overview statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE600] border-2 border-black text-[11px] font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#000]">
            <Sparkles className="w-3.5 h-3.5" />
            Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">Admin Overview</h1>
          <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
            Real-time management for categories, subjects, and multiplayer quiz question banks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchOverview}
            disabled={loading}
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border-2 border-black text-black font-black text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/import"
            className="px-4 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#ebd400] text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 stroke-[2.5]" />
            Import Questions
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-2 border-black rounded-2xl text-red-800 text-xs font-bold shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchOverview}
            className="underline font-black hover:text-black"
          >
            Retry
          </button>
        </div>
      )}

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Categories */}
        <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-stone-500">Categories</span>
            <div className="w-9 h-9 rounded-xl bg-[#FFE600] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-black tracking-tight">
              {loading ? "..." : stats?.metrics.totalCategories ?? 0}
            </div>
            <div className="text-[11px] font-bold text-stone-600 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{stats?.metrics.activeCategories ?? 0} active in matchmaking</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Subjects */}
        <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-stone-500">Subjects</span>
            <div className="w-9 h-9 rounded-xl bg-[#2DD4BF] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-black tracking-tight">
              {loading ? "..." : stats?.metrics.totalSubjects ?? 0}
            </div>
            <div className="text-[11px] font-bold text-stone-600 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{stats?.metrics.activeSubjects ?? 0} active subject pools</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Questions */}
        <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-stone-500">Question Bank</span>
            <div className="w-9 h-9 rounded-xl bg-[#FF6B6B] text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-black tracking-tight">
              {loading ? "..." : stats?.metrics.totalQuestions ?? 0}
            </div>
            <div className="text-[11px] font-bold text-stone-600 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{stats?.metrics.publishedQuestions ?? 0} verified questions</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Total Imports */}
        <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-stone-500">Import Batches</span>
            <div className="w-9 h-9 rounded-xl bg-[#A78BFA] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <HistoryIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-black tracking-tight">
              {loading ? "..." : stats?.metrics.totalImports ?? 0}
            </div>
            <div className="text-[11px] font-bold text-stone-600 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Audit logs recorded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Section */}
      <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black text-black">Category Breakdown</h2>
            <p className="text-xs text-stone-600 font-bold">Live question count and subject hierarchy distribution</p>
          </div>
          <Link
            href="/admin/categories"
            className="text-xs font-black text-black hover:text-amber-700 flex items-center gap-1.5 group"
          >
            Manage Tree
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-stone-100 border-2 border-black/20 animate-pulse" />
            ))
          ) : stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
            stats.categoryBreakdown.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-xl border-2 border-black bg-[#FAF7EE] shadow-[3px_3px_0px_#000] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-black truncate">
                      {cat.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black border border-black ${
                        cat.isActive ? "bg-emerald-200 text-emerald-900" : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 font-semibold">
                    Slug: <code className="font-mono">{cat.slug}</code>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>{cat.subjectCount} Subjects</span>
                  <span className="font-black text-black">{cat.questionCount} Questions</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-500 font-bold col-span-4 py-6 text-center">
              No categories found in the database.
            </p>
          )}
        </div>
      </div>

      {/* Recent Imports Table */}
      <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black text-black">Recent Question Imports</h2>
            <p className="text-xs text-stone-600 font-bold">Latest JSON file uploads and execution audit records</p>
          </div>
          <Link
            href="/admin/history"
            className="text-xs font-black text-black hover:text-amber-700 flex items-center gap-1.5 group"
          >
            View Full History
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-black bg-stone-50">
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">File Name</th>
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">Destination</th>
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">Status</th>
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">Questions</th>
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">Uploaded By</th>
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y border-b-2 border-black">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-stone-500 font-bold">
                    Loading recent import records...
                  </td>
                </tr>
              ) : stats?.recentImports && stats.recentImports.length > 0 ? (
                stats.recentImports.map((imp) => {
                  let statusBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black border border-black bg-emerald-200 text-emerald-900 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  );
                  if (imp.status === "partial") {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black border border-black bg-amber-200 text-amber-900 inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Partial
                      </span>
                    );
                  } else if (imp.status === "failed") {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black border border-black bg-red-200 text-red-900 inline-flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Failed
                      </span>
                    );
                  }

                  return (
                    <tr key={imp._id} className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-black">{imp.fileName}</td>
                      <td className="p-3 font-semibold text-stone-700">
                        {imp.categoryName} <span className="text-stone-400">/</span> {imp.subjectName}
                      </td>
                      <td className="p-3">{statusBadge}</td>
                      <td className="p-3 font-bold text-black">
                        +{imp.importedCount}{" "}
                        {imp.updatedCount > 0 && <span className="text-blue-600">({imp.updatedCount} updated)</span>}{" "}
                        {imp.failedCount > 0 && <span className="text-red-500">({imp.failedCount} errors)</span>}
                      </td>
                      <td className="p-3 font-semibold text-stone-600">{imp.adminUsername}</td>
                      <td className="p-3 font-mono text-[11px] text-stone-500">
                        {new Date(imp.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500 font-bold">
                    No import batches have been executed yet. Click{" "}
                    <Link href="/admin/import" className="text-black underline font-black">
                      Import Questions
                    </Link>{" "}
                    to seed your first question set.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
