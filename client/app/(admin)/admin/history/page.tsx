"use client";

import React, { useState, useEffect } from "react";
import {
  History as HistoryIcon,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Eye,
  X,
  RefreshCw,
  FolderTree,
  Calendar,
  Layers,
} from "lucide-react";
import { useApiClient } from "@/hooks/useApiClient";
import { ImportHistoryItem } from "@/types";

export default function AdminHistoryPage() {
  const api = useApiClient();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<ImportHistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<ImportHistoryItem | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "10");
      if (statusFilter) params.set("status", statusFilter);
      if (searchQuery) params.set("search", searchQuery);

      const res = await api.get<{
        data: {
          history: ImportHistoryItem[];
          pagination: { page: number; limit: number; total: number; totalPages: number };
        };
      }>(`/admin/history?${params.toString()}`);

      setHistory(res.data.history);
      setTotal(res.data.pagination.total);
      setTotalPages(res.data.pagination.totalPages);
    } catch {
      // Handle error gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE600] border-2 border-black text-[11px] font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#000]">
            <HistoryIcon className="w-3.5 h-3.5" />
            Audit Logging
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">Question Import History</h1>
          <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
            Historical logs of all bulk question additions, file integrity checks, and error reports.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchHistory}
          disabled={loading}
          className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border-2 border-black text-black font-black text-xs shadow-[2px_2px_0px_#000] self-start md:self-auto"
          title="Refresh History"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by filename, category, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-black bg-stone-50 text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border-2 border-black text-xs font-black bg-stone-50 focus:outline-none shadow-[2px_2px_0px_#000]"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="partial">Partial</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-black bg-stone-50">
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">Import ID</th>
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">File Name</th>
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">Destination</th>
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">Results</th>
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">Strategy</th>
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">Status</th>
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">Admin</th>
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider">Date</th>
                <th className="p-3 font-black text-stone-700 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y border-b-2 border-black">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-stone-500 font-bold">
                    Loading history logs...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-stone-500 font-bold">
                    No import records found matching your filters.
                  </td>
                </tr>
              ) : (
                history.map((record) => {
                  let statusBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black border border-black bg-emerald-200 text-emerald-900 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  );
                  if (record.status === "partial") {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black border border-black bg-amber-200 text-amber-900 inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Partial
                      </span>
                    );
                  } else if (record.status === "failed") {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black border border-black bg-red-200 text-red-900 inline-flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Failed
                      </span>
                    );
                  }

                  return (
                    <tr key={record._id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono font-bold text-stone-700 text-[11px]">{record.importId}</td>
                      <td className="p-3 font-bold text-black max-w-[160px] truncate">{record.fileName}</td>
                      <td className="p-3 font-semibold text-stone-700">
                        {record.categoryName} <span className="text-stone-400">/</span> {record.subjectName}
                      </td>
                      <td className="p-3">
                        <span className="font-black text-emerald-700">+{record.importedCount}</span>
                        {record.updatedCount > 0 && (
                          <span className="text-blue-600 font-bold ml-1">({record.updatedCount} upd)</span>
                        )}
                        {record.skippedCount > 0 && (
                          <span className="text-stone-500 font-bold ml-1">({record.skippedCount} skip)</span>
                        )}
                        {record.failedCount > 0 && (
                          <span className="text-red-500 font-bold ml-1">({record.failedCount} err)</span>
                        )}
                      </td>
                      <td className="p-3 uppercase font-mono text-[10px] text-stone-600 font-bold">
                        {record.duplicateStrategy}
                      </td>
                      <td className="p-3">{statusBadge}</td>
                      <td className="p-3 font-semibold text-stone-700">{record.adminUsername}</td>
                      <td className="p-3 font-mono text-[11px] text-stone-500">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(record)}
                          className="p-1.5 rounded-lg border-2 border-black bg-stone-100 hover:bg-stone-200 shadow-[1px_1px_0px_#000]"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-black" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-2">
            <span className="text-xs font-bold text-stone-600">
              Showing page {page} of {totalPages} ({total} total imports)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-xl border-2 border-black bg-white disabled:opacity-50 text-xs font-black shadow-[2px_2px_0px_#000]"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-xl border-2 border-black bg-white disabled:opacity-50 text-xs font-black shadow-[2px_2px_0px_#000]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-2xl w-full p-6 shadow-[6px_6px_0px_#000] max-h-[85vh] flex flex-col animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <div>
                <h2 className="text-base font-black text-black">Import Record Details</h2>
                <p className="text-xs font-mono text-stone-500">{selectedRecord.importId}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-stone-50 border-2 border-black rounded-xl">
                  <div className="text-[10px] font-black uppercase text-stone-500">File Name</div>
                  <div className="text-xs font-black truncate">{selectedRecord.fileName}</div>
                </div>
                <div className="p-3 bg-stone-50 border-2 border-black rounded-xl">
                  <div className="text-[10px] font-black uppercase text-stone-500">Destination</div>
                  <div className="text-xs font-black truncate">
                    {selectedRecord.categoryName} / {selectedRecord.subjectName}
                  </div>
                </div>
                <div className="p-3 bg-stone-50 border-2 border-black rounded-xl">
                  <div className="text-[10px] font-black uppercase text-stone-500">Strategy</div>
                  <div className="text-xs font-black capitalize">{selectedRecord.duplicateStrategy}</div>
                </div>
                <div className="p-3 bg-stone-50 border-2 border-black rounded-xl">
                  <div className="text-[10px] font-black uppercase text-stone-500">Executed At</div>
                  <div className="text-xs font-black">{new Date(selectedRecord.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Counts Breakdown */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className="p-3 bg-emerald-50 border-2 border-black rounded-xl text-center">
                  <div className="text-[10px] font-black uppercase text-emerald-800">Imported</div>
                  <div className="text-xl font-black text-emerald-950">+{selectedRecord.importedCount}</div>
                </div>
                <div className="p-3 bg-blue-50 border-2 border-black rounded-xl text-center">
                  <div className="text-[10px] font-black uppercase text-blue-800">Updated</div>
                  <div className="text-xl font-black text-blue-950">{selectedRecord.updatedCount}</div>
                </div>
                <div className="p-3 bg-stone-50 border-2 border-black rounded-xl text-center">
                  <div className="text-[10px] font-black uppercase text-stone-700">Skipped</div>
                  <div className="text-xl font-black text-stone-900">{selectedRecord.skippedCount}</div>
                </div>
                <div className="p-3 bg-red-50 border-2 border-black rounded-xl text-center">
                  <div className="text-[10px] font-black uppercase text-red-800">Errors</div>
                  <div className="text-xl font-black text-red-950">{selectedRecord.failedCount}</div>
                </div>
              </div>

              {/* Row Errors */}
              {selectedRecord.validationErrors && selectedRecord.validationErrors.length > 0 && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-red-800 mb-2">
                    Validation Row Errors ({selectedRecord.validationErrors.length})
                  </h3>
                  <div className="max-h-48 overflow-y-auto border-2 border-black rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-red-100 border-b border-black">
                        <tr>
                          <th className="p-2 font-black">Row</th>
                          <th className="p-2 font-black">ID</th>
                          <th className="p-2 font-black">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/10 bg-white">
                        {selectedRecord.validationErrors.map((err, i) => (
                          <tr key={i}>
                            <td className="p-2 font-black">{err.row}</td>
                            <td className="p-2 font-mono text-[11px]">{err.externalId || "-"}</td>
                            <td className="p-2 text-red-700 font-bold">{err.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t-2 border-black flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
