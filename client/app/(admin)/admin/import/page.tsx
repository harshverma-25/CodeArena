"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  ArrowRight,
  RefreshCw,
  FolderTree,
  BookOpen,
  Info,
  ShieldCheck,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { useApiClient } from "@/hooks/useApiClient";
import { AdminCategoryTreeItem, ImportPreviewResponse, ImportExecuteResponse } from "@/types";

export default function AdminImportPage() {
  const api = useApiClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories & Subjects
  const [categories, setCategories] = useState<AdminCategoryTreeItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  // File & Parsed Questions
  const [file, setFile] = useState<File | null>(null);
  const [fileJson, setFileJson] = useState<any | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Dry-run preview
  const [validating, setValidating] = useState(false);
  const [previewData, setPreviewData] = useState<ImportPreviewResponse | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Duplicate strategy
  const [duplicateStrategy, setDuplicateStrategy] = useState<"skip" | "update">("skip");

  // Execution
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ImportExecuteResponse | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  // Fetch Category Tree on Mount
  useEffect(() => {
    const fetchTree = async () => {
      try {
        setLoadingCategories(true);
        const res = await api.get<{ data: AdminCategoryTreeItem[] }>("/admin/categories");
        setCategories(res.data);
        if (res.data.length > 0) {
          setSelectedCategoryId(res.data[0].id);
          if (res.data[0].subjects.length > 0) {
            setSelectedSubjectId(res.data[0].subjects[0].id);
          }
        }
      } catch (err: any) {
        setFileError(err?.message || "Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchTree();
  }, []);

  // Update selected subject when category changes
  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat && cat.subjects.length > 0) {
      setSelectedSubjectId(cat.subjects[0].id);
    } else {
      setSelectedSubjectId("");
    }
    // Reset preview if destination changes
    setPreviewData(null);
    setExecutionResult(null);
  };

  const handleSubjectChange = (subjId: string) => {
    setSelectedSubjectId(subjId);
    setPreviewData(null);
    setExecutionResult(null);
  };

  // Handle File Input or Drop
  const handleFileProcess = (uploadedFile: File) => {
    setFileError(null);
    setPreviewData(null);
    setExecutionResult(null);

    if (!uploadedFile.name.endsWith(".json")) {
      setFileError("Please upload a valid .json file");
      return;
    }

    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        // Normalize format: questions can be at root or under a `questions` key
        let questionsArray: any[] = [];
        if (Array.isArray(parsed)) {
          questionsArray = parsed;
        } else if (Array.isArray(parsed.questions)) {
          questionsArray = parsed.questions;
        } else {
          setFileError('Invalid JSON structure: Expected an array of questions or an object with a "questions" array.');
          return;
        }

        if (questionsArray.length === 0) {
          setFileError("The uploaded JSON file contains 0 questions.");
          return;
        }

        setFileJson(questionsArray);
      } catch (err) {
        setFileError("Failed to parse JSON file. Please ensure it is valid JSON syntax.");
      }
    };
    reader.readAsText(uploadedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Download Sample JSON Template
  const handleDownloadSample = async () => {
    try {
      const res = await api.get<{ data: any }>("/admin/import/sample");
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quizzy-sample-questions.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download sample JSON template");
    }
  };

  // Run Backend Validation / Preview
  const handleValidatePreview = async () => {
    if (!selectedCategoryId || !selectedSubjectId || !fileJson || !file) {
      alert("Please select a destination category & subject and upload a valid JSON file first.");
      return;
    }

    try {
      setValidating(true);
      setPreviewError(null);
      const res = await api.post<{ data: ImportPreviewResponse }>("/admin/import/preview", {
        categoryId: selectedCategoryId,
        subjectId: selectedSubjectId,
        fileName: file.name,
        fileSize: file.size,
        questions: fileJson,
      });
      setPreviewData(res.data);
    } catch (err: any) {
      setPreviewError(err?.message || "Validation failed");
    } finally {
      setValidating(false);
    }
  };

  // Execute Import
  const handleExecuteImport = async () => {
    if (!selectedCategoryId || !selectedSubjectId || !fileJson || !file) return;

    try {
      setExecuting(true);
      setExecutionError(null);
      const res = await api.post<{ data: ImportExecuteResponse }>("/admin/import/execute", {
        categoryId: selectedCategoryId,
        subjectId: selectedSubjectId,
        fileName: file.name,
        fileSize: file.size,
        duplicateStrategy,
        questions: fileJson,
      });
      setExecutionResult(res.data);
    } catch (err: any) {
      setExecutionError(err?.message || "Execution failed");
    } finally {
      setExecuting(false);
    }
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const subjectsForCategory = selectedCategory?.subjects || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE600] border-2 border-black text-[11px] font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#000]">
            <UploadCloud className="w-3.5 h-3.5" />
            Bulk Ingestion Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">Import Question Bank</h1>
          <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
            Safely ingest hundreds of MCQs into any category and subject with row validation and duplicate prevention.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadSample}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          Download Sample JSON
        </button>
      </div>

      {/* 5-STEP WORKFLOW CONTAINER */}
      <div className="space-y-6">
        {/* STEP 1: Destination Selection */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-7 h-7 rounded-xl bg-[#FFE600] border-2 border-black flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000]">
              1
            </span>
            <h2 className="text-base font-black text-black">Select Destination Category & Subject</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5">
                Target Category *
              </label>
              <select
                disabled={loadingCategories}
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black text-xs font-black bg-stone-50 focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.questionCount} questions)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5">
                Target Subject *
              </label>
              <select
                disabled={loadingCategories || subjectsForCategory.length === 0}
                value={selectedSubjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black text-xs font-black bg-stone-50 focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
              >
                {subjectsForCategory.length === 0 ? (
                  <option value="">No subjects available</option>
                ) : (
                  subjectsForCategory.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.questionCount} questions)
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {/* STEP 2: File Upload */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-7 h-7 rounded-xl bg-[#2DD4BF] border-2 border-black flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000]">
              2
            </span>
            <h2 className="text-base font-black text-black">Upload Question JSON File</h2>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-black rounded-2xl p-8 text-center bg-[#FAF7EE] hover:bg-stone-100 transition-colors cursor-pointer group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
            />
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-black flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-6 h-6 text-black" />
            </div>
            <p className="text-xs font-black text-black mb-1">
              {file ? file.name : "Click to select or drag and drop your .JSON question bank"}
            </p>
            <p className="text-[11px] text-stone-500 font-bold">
              {file
                ? `${(file.size / 1024).toFixed(1)} KB — ${fileJson?.length ?? 0} questions parsed`
                : "Standard JSON format with questions, options, correctAnswer (0-3 or A-D), and explanation"}
            </p>
          </div>

          {fileError && (
            <div className="mt-3 p-3 bg-red-50 border-2 border-black rounded-xl text-red-800 text-xs font-bold shadow-[2px_2px_0px_#000]">
              {fileError}
            </div>
          )}

          {fileJson && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleValidatePreview}
                disabled={validating}
                className="px-5 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#ebd400] text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${validating ? "animate-spin" : ""}`} />
                {validating ? "Running Dry-Run Validation..." : "Validate & Preview Questions"}
              </button>
            </div>
          )}
        </div>

        {/* STEP 3 & 4: Validation Preview & Duplicate Options */}
        {previewError && (
          <div className="p-4 bg-red-50 border-2 border-black rounded-2xl text-red-800 text-xs font-bold shadow-[3px_3px_0px_#000]">
            {previewError}
          </div>
        )}

        {previewData && (
          <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000] space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[#FF6B6B] text-white border-2 border-black flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000]">
                3
              </span>
              <div>
                <h2 className="text-base font-black text-black">Dry-Run Validation Report</h2>
                <p className="text-xs text-stone-500 font-bold">
                  Destination: {previewData.destination.categoryName} / {previewData.destination.subjectName}
                </p>
              </div>
            </div>

            {/* Validation Breakdown Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border-2 border-black bg-stone-50 shadow-[2px_2px_0px_#000]">
                <div className="text-[10px] font-black uppercase tracking-wider text-stone-500">Total in File</div>
                <div className="text-2xl font-black text-black">
                  {previewData.fileSummary.totalQuestionsInFile}
                </div>
              </div>

              <div className="p-3 rounded-xl border-2 border-black bg-emerald-50 shadow-[2px_2px_0px_#000]">
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Valid Questions</div>
                <div className="text-2xl font-black text-emerald-900">
                  {previewData.fileSummary.validCount}
                </div>
              </div>

              <div className="p-3 rounded-xl border-2 border-black bg-red-50 shadow-[2px_2px_0px_#000]">
                <div className="text-[10px] font-black uppercase tracking-wider text-red-800">Invalid Rows</div>
                <div className="text-2xl font-black text-red-900">
                  {previewData.fileSummary.invalidCount}
                </div>
              </div>

              <div className="p-3 rounded-xl border-2 border-black bg-amber-50 shadow-[2px_2px_0px_#000]">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">Existing in DB</div>
                <div className="text-2xl font-black text-amber-900">
                  {previewData.fileSummary.existingDuplicatesCount}
                </div>
              </div>
            </div>

            {/* Difficulty breakdown */}
            <div className="p-3 rounded-xl border-2 border-black bg-[#FAF7EE] flex items-center gap-4 text-xs font-black">
              <span className="text-stone-600">Difficulty Distribution:</span>
              <span className="text-emerald-700">Easy: {previewData.fileSummary.difficultyCounts.easy}</span>
              <span className="text-amber-700">Medium: {previewData.fileSummary.difficultyCounts.medium}</span>
              <span className="text-red-700">Hard: {previewData.fileSummary.difficultyCounts.hard}</span>
            </div>

            {/* Row Errors Table (if any) */}
            {previewData.errors.length > 0 && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-red-800 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Row Validation Errors ({previewData.errors.length})
                </h3>
                <div className="max-h-48 overflow-y-auto border-2 border-black rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-red-100 border-b border-black">
                      <tr>
                        <th className="p-2 font-black">Row</th>
                        <th className="p-2 font-black">ID</th>
                        <th className="p-2 font-black">Question Snippet</th>
                        <th className="p-2 font-black">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 bg-white">
                      {previewData.errors.map((err, i) => (
                        <tr key={i} className="hover:bg-red-50/50">
                          <td className="p-2 font-black">{err.row}</td>
                          <td className="p-2 font-mono text-[11px]">{err.externalId || "-"}</td>
                          <td className="p-2 truncate max-w-xs">{err.question || "(missing)"}</td>
                          <td className="p-2 text-red-700 font-bold">{err.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sample Preview Rows */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-black mb-2">
                Sample Questions Preview (First {previewData.previewRows.length})
              </h3>
              <div className="max-h-64 overflow-y-auto border-2 border-black rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 border-b-2 border-black">
                    <tr>
                      <th className="p-2 font-black">Row</th>
                      <th className="p-2 font-black">Question ID</th>
                      <th className="p-2 font-black">Question Text</th>
                      <th className="p-2 font-black">Difficulty</th>
                      <th className="p-2 font-black">Correct Answer</th>
                      <th className="p-2 font-black">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-b border-black bg-white">
                    {previewData.previewRows.map((q) => (
                      <tr key={q.row} className="hover:bg-stone-50">
                        <td className="p-2 font-bold">{q.row}</td>
                        <td className="p-2 font-mono text-[11px]">{q.questionId}</td>
                        <td className="p-2 max-w-md font-semibold truncate">{q.question}</td>
                        <td className="p-2 capitalize font-bold">{q.difficulty}</td>
                        <td className="p-2 font-mono font-bold text-emerald-700">
                          Option {q.correctAnswer + 1}: {q.options[q.correctAnswer]}
                        </td>
                        <td className="p-2">
                          {q.isExistingDuplicate ? (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-black/30">
                              Duplicate ID
                            </span>
                          ) : (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-black/30">
                              New
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* STEP 4: Duplicate Strategy */}
            <div className="pt-4 border-t-2 border-black">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-7 h-7 rounded-xl bg-[#A78BFA] border-2 border-black flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000]">
                  4
                </span>
                <h3 className="text-base font-black text-black">Duplicate Question Strategy</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-4 rounded-xl border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] flex items-start gap-3 transition-colors ${
                    duplicateStrategy === "skip" ? "bg-[#FFE600]/30 border-black" : "bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="strategy"
                    checked={duplicateStrategy === "skip"}
                    onChange={() => setDuplicateStrategy("skip")}
                    className="mt-0.5 accent-black"
                  />
                  <div>
                    <div className="text-xs font-black text-black">Skip Duplicates (Default & Safe)</div>
                    <div className="text-[11px] text-stone-600 font-semibold mt-0.5">
                      Existing questions in the database with the same ID will be preserved and untouched.
                    </div>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-xl border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] flex items-start gap-3 transition-colors ${
                    duplicateStrategy === "update" ? "bg-[#FFE600]/30 border-black" : "bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="strategy"
                    checked={duplicateStrategy === "update"}
                    onChange={() => setDuplicateStrategy("update")}
                    className="mt-0.5 accent-black"
                  />
                  <div>
                    <div className="text-xs font-black text-black">Update Existing Questions</div>
                    <div className="text-[11px] text-stone-600 font-semibold mt-0.5">
                      Overwrites existing question text, options, difficulty, and explanations with new data.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* STEP 5: Execute Import */}
            <div className="pt-4 border-t-2 border-black flex items-center justify-between">
              <div className="text-xs font-bold text-stone-600">
                Ready to import {previewData.fileSummary.validCount} valid questions.
              </div>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={executing || previewData.fileSummary.validCount === 0}
                className="px-6 py-3 rounded-xl bg-[#4ADE80] hover:bg-[#3ec772] text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                {executing ? "Importing Questions in Batches..." : "Execute Import"}
              </button>
            </div>
          </div>
        )}

        {/* Execution Error */}
        {executionError && (
          <div className="p-4 bg-red-50 border-2 border-black rounded-2xl text-red-800 text-xs font-bold shadow-[3px_3px_0px_#000]">
            {executionError}
          </div>
        )}

        {/* Execution Success Card */}
        {executionResult && (
          <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[5px_5px_0px_#000] space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border-2 border-black text-emerald-800 flex items-center justify-center shadow-[2px_2px_0px_#000]">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-black">Import Completed Successfully!</h2>
                <p className="text-xs text-stone-600 font-bold">
                  Batch audit identifier: <code className="font-mono">{executionResult.importId}</code>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-emerald-50 border-2 border-black rounded-xl">
                <div className="text-[10px] font-black uppercase text-emerald-800">Imported New</div>
                <div className="text-2xl font-black text-emerald-900">
                  +{executionResult.summary.importedCount}
                </div>
              </div>
              <div className="p-3 bg-blue-50 border-2 border-black rounded-xl">
                <div className="text-[10px] font-black uppercase text-blue-800">Updated</div>
                <div className="text-2xl font-black text-blue-900">
                  {executionResult.summary.updatedCount}
                </div>
              </div>
              <div className="p-3 bg-stone-50 border-2 border-black rounded-xl">
                <div className="text-[10px] font-black uppercase text-stone-700">Skipped</div>
                <div className="text-2xl font-black text-stone-900">
                  {executionResult.summary.skippedCount}
                </div>
              </div>
              <div className="p-3 bg-red-50 border-2 border-black rounded-xl">
                <div className="text-[10px] font-black uppercase text-red-800">Failed / Errors</div>
                <div className="text-2xl font-black text-red-900">
                  {executionResult.summary.failedCount}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t-2 border-black">
              <Link
                href="/admin/history"
                className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000]"
              >
                View in Import History
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl bg-[#FFE600] hover:bg-[#ebd400] border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000]"
              >
                Return to Overview
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
