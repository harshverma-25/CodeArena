"use client";

import React, { useState, useEffect } from "react";
import {
  FolderTree,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
  Layers,
  ArrowRight,
  AlertTriangle,
  Loader2,
  Upload,
  Image as ImageIcon,
  Wand2,
} from "lucide-react";
import { useApiClient } from "@/hooks/useApiClient";
import { AdminCategoryTreeItem, AdminSubjectItem, AdminQuestionItem } from "@/types";

export default function AdminCategoriesPage() {
  const api = useApiClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<AdminCategoryTreeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryTreeItem | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", description: "", icon: "" });

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<{ subject: AdminSubjectItem; categoryId: string } | null>(null);
  const [subjectForm, setSubjectForm] = useState({
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    icon: "",
    thumbnailUrl: "",
    autoGenerateThumbnail: false,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

  // Delete Confirmation Modals state
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<AdminCategoryTreeItem | null>(null);
  const [deleteSubjectTarget, setDeleteSubjectTarget] = useState<{ subject: AdminSubjectItem; categoryName: string } | null>(null);

  // Questions Viewer Modal state
  const [managingQuestionsSubject, setManagingQuestionsSubject] = useState<{ subject: AdminSubjectItem; categoryName: string } | null>(null);
  const [subjectQuestions, setSubjectQuestions] = useState<AdminQuestionItem[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [deleteQuestionTarget, setDeleteQuestionTarget] = useState<AdminQuestionItem | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<{ data: AdminCategoryTreeItem[] }>("/admin/categories");
      setCategories(res.data);
      // Auto-expand all categories by default
      const initialExpand: Record<string, boolean> = {};
      res.data.forEach((c) => {
        initialExpand[c.id] = true;
      });
      setExpandedCategories(initialExpand);
    } catch (err: any) {
      setError(err?.message || "Failed to load categories tree");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Open Create Category Modal
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", slug: "", description: "", icon: "" });
    setIsCategoryModalOpen(true);
  };

  // Open Edit Category Modal
  const handleOpenEditCategory = (cat: AdminCategoryTreeItem) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      icon: cat.icon || "",
    });
    setIsCategoryModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingCategory) {
        await api.patch(`/admin/categories/${editingCategory.id}`, {
          name: categoryForm.name,
          description: categoryForm.description,
          icon: categoryForm.icon,
        });
        setActionMessage(`Updated category "${categoryForm.name}" successfully.`);
      } else {
        await api.post("/admin/categories", {
          name: categoryForm.name,
          slug: categoryForm.slug || undefined,
          description: categoryForm.description,
          icon: categoryForm.icon,
        });
        setActionMessage(`Created category "${categoryForm.name}" successfully.`);
      }
      setIsCategoryModalOpen(false);
      await fetchCategories();
    } catch (err: any) {
      alert(err?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  // Toggle Category Active Status
  const handleToggleCategoryActive = async (cat: AdminCategoryTreeItem) => {
    try {
      await api.patch(`/admin/categories/${cat.id}`, { isActive: !cat.isActive });
      setActionMessage(`Category "${cat.name}" is now ${!cat.isActive ? "Active" : "Inactive"}.`);
      await fetchCategories();
    } catch (err: any) {
      alert(err?.message || "Failed to toggle category status");
    }
  };

  // Open Create Subject Modal
  const handleOpenCreateSubject = (categoryId: string) => {
    setEditingSubject(null);
    setSubjectForm({
      categoryId,
      name: "",
      slug: "",
      description: "",
      icon: "",
      thumbnailUrl: "",
      autoGenerateThumbnail: false,
    });
    setIsSubjectModalOpen(true);
  };

  // Open Edit Subject Modal
  const handleOpenEditSubject = (subject: AdminSubjectItem, categoryId: string) => {
    setEditingSubject({ subject, categoryId });
    setSubjectForm({
      categoryId,
      name: subject.name,
      slug: subject.slug,
      description: subject.description || "",
      icon: subject.icon || "",
      thumbnailUrl: subject.thumbnailUrl || "",
      autoGenerateThumbnail: false,
    });
    setIsSubjectModalOpen(true);
  };

  // Handle manual file upload to Cloudinary via backend
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploadingImage(true);
        const base64Data = reader.result as string;
        const res = await api.post<{ success: boolean; data: { url: string } }>("/admin/media/upload", {
          base64Data,
        });
        if (res.data?.url) {
          setSubjectForm((prev) => ({ ...prev, thumbnailUrl: res.data.url }));
          setActionMessage("Image uploaded to Cloudinary successfully!");
        }
      } catch (err: any) {
        alert(err?.message || "Failed to upload image to Cloudinary");
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle on-demand AI generation via Cloudflare Workers AI + Cloudinary
  const handleGenerateAiImage = async () => {
    if (!subjectForm.name.trim()) {
      alert("Please enter a subject name first so the AI knows what image to generate!");
      return;
    }
    const cat = categories.find((c) => c.id === subjectForm.categoryId);
    try {
      setGeneratingImage(true);
      const res = await api.post<{ success: boolean; data: { url: string } }>("/admin/media/generate", {
        subjectName: subjectForm.name.trim(),
        categoryName: cat?.name,
        categorySlug: cat?.slug,
        description: subjectForm.description?.trim() || undefined,
      });
      if (res.data?.url) {
        setSubjectForm((prev) => ({ ...prev, thumbnailUrl: res.data.url }));
        setActionMessage("Image generated with Cloudflare Workers AI and saved to Cloudinary!");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to generate AI image. Please verify CLOUDFLARE_ACCOUNT_ID and CLOUDINARY credentials in server .env.");
    } finally {
      setGeneratingImage(false);
    }
  };

  // Save Subject
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingSubject) {
        await api.patch(`/admin/subjects/${editingSubject.subject.id}`, {
          name: subjectForm.name,
          description: subjectForm.description,
          icon: subjectForm.icon,
          thumbnailUrl: subjectForm.thumbnailUrl,
          autoGenerateThumbnail: subjectForm.autoGenerateThumbnail,
        });
        setActionMessage(`Updated subject "${subjectForm.name}" successfully.`);
      } else {
        await api.post("/admin/subjects", {
          categoryId: subjectForm.categoryId,
          name: subjectForm.name,
          slug: subjectForm.slug || undefined,
          description: subjectForm.description,
          icon: subjectForm.icon,
          thumbnailUrl: subjectForm.thumbnailUrl,
          autoGenerateThumbnail: subjectForm.autoGenerateThumbnail,
        });
        setActionMessage(`Created subject "${subjectForm.name}" successfully.`);
      }
      setIsSubjectModalOpen(false);
      await fetchCategories();
    } catch (err: any) {
      alert(err?.message || "Failed to save subject");
    } finally {
      setSaving(false);
    }
  };

  // Toggle Subject Active Status
  const handleToggleSubjectActive = async (subject: AdminSubjectItem) => {
    try {
      await api.patch(`/admin/subjects/${subject.id}`, { isActive: !subject.isActive });
      setActionMessage(`Subject "${subject.name}" is now ${!subject.isActive ? "Active" : "Inactive"}.`);
      await fetchCategories();
    } catch (err: any) {
      alert(err?.message || "Failed to toggle subject status");
    }
  };

  // Delete Category
  const handleDeleteCategory = async () => {
    if (!deleteCategoryTarget) return;
    try {
      setDeleting(true);
      const res = await api.delete<{ data: { deletedSubjectsCount: number; deletedQuestionsCount: number } }>(
        `/admin/categories/${deleteCategoryTarget.id}`
      );
      setActionMessage(
        `Deleted category "${deleteCategoryTarget.name}" (${res.data?.deletedSubjectsCount || 0} quizzes, ${res.data?.deletedQuestionsCount || 0} questions removed).`
      );
      setDeleteCategoryTarget(null);
      await fetchCategories();
    } catch (err: any) {
      alert(err?.message || "Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  // Delete Subject / Quiz
  const handleDeleteSubject = async () => {
    if (!deleteSubjectTarget) return;
    try {
      setDeleting(true);
      const res = await api.delete<{ data: { deletedQuestionsCount: number } }>(
        `/admin/subjects/${deleteSubjectTarget.subject.id}`
      );
      setActionMessage(
        `Deleted quiz "${deleteSubjectTarget.subject.name}" and its ${res.data?.deletedQuestionsCount || 0} questions.`
      );
      setDeleteSubjectTarget(null);
      await fetchCategories();
    } catch (err: any) {
      alert(err?.message || "Failed to delete quiz");
    } finally {
      setDeleting(false);
    }
  };

  // Fetch Questions for a Subject / Quiz
  const fetchSubjectQuestions = async (subjectId: string) => {
    try {
      setQuestionsLoading(true);
      const res = await api.get<{ data: { questions: AdminQuestionItem[] } }>(
        `/admin/subjects/${subjectId}/questions?limit=100`
      );
      setSubjectQuestions(res.data?.questions || []);
    } catch (err: any) {
      alert(err?.message || "Failed to load questions");
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Delete an Individual Question
  const handleDeleteQuestion = async () => {
    if (!deleteQuestionTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/admin/questions/${deleteQuestionTarget.id}`);
      setSubjectQuestions((prev) => prev.filter((q) => q.id !== deleteQuestionTarget.id));
      setActionMessage(`Question "${deleteQuestionTarget.questionId}" deleted successfully.`);
      setDeleteQuestionTarget(null);
      await fetchCategories();
    } catch (err: any) {
      alert(err?.message || "Failed to delete question");
    } finally {
      setDeleting(false);
    }
  };

  // Clear All Questions of a Subject / Quiz
  const handleClearSubjectQuestions = async (subjectId: string, subjectName: string) => {
    if (!confirm(`Are you sure you want to clear all questions for quiz "${subjectName}"? The quiz itself will remain.`)) {
      return;
    }
    try {
      setDeleting(true);
      const res = await api.delete<{ data: { deletedQuestionsCount: number } }>(
        `/admin/subjects/${subjectId}/questions`
      );
      setActionMessage(`Cleared ${res.data?.deletedQuestionsCount || 0} questions from "${subjectName}".`);
      setSubjectQuestions([]);
      await fetchCategories();
    } catch (err: any) {
      alert(err?.message || "Failed to clear questions");
    } finally {
      setDeleting(false);
    }
  };

  // Filter Categories
  const filteredCategories = categories
    .filter((cat) => {
      if (showActiveOnly && !cat.isActive) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const matchCat = cat.name.toLowerCase().includes(q) || cat.slug.toLowerCase().includes(q);
      const matchSub = cat.subjects.some(
        (s) => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q)
      );
      return matchCat || matchSub;
    })
    .map((cat) => {
      if (!searchQuery) return cat;
      const q = searchQuery.toLowerCase();
      const filteredSubjects = cat.subjects.filter(
        (s) => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q)
      );
      return {
        ...cat,
        subjects: filteredSubjects.length > 0 ? filteredSubjects : cat.subjects,
      };
    });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE600] border-2 border-black text-[11px] font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#000]">
            <FolderTree className="w-3.5 h-3.5" />
            Curriculum Structure
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">Categories & Subjects</h1>
          <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
            Organize quiz topics, monitor question allocations, and safely control active matchmaking status.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateCategory}
          className="px-4 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#ebd400] text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          New Category
        </button>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-50 border-2 border-black rounded-2xl text-emerald-900 text-xs font-bold shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="font-black text-black hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search categories or subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-black bg-stone-50 text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
              className="w-4 h-4 rounded border-2 border-black accent-[#FFE600] cursor-pointer"
            />
            Show Active Only
          </label>
        </div>
      </div>

      {/* Categories Tree Accordion */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
            <div className="w-10 h-10 border-4 border-black border-t-[#FFE600] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-black text-stone-700">Loading Categories & Subjects...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
            <p className="text-xs font-bold text-stone-500">No categories found matching your query.</p>
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const isExpanded = !!expandedCategories[cat.id];

            return (
              <div
                key={cat.id}
                className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] overflow-hidden"
              >
                {/* Category Header */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-stone-50 to-white border-b-2 border-black">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleCategoryExpand(cat.id)}
                      className="p-1.5 rounded-lg border-2 border-black bg-stone-100 hover:bg-stone-200 mt-0.5 shadow-[1px_1px_0px_#000]"
                      aria-label="Toggle subjects"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-black" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-black" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-base sm:text-lg font-black text-black">{cat.name}</h2>
                        <span className="font-mono text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-black/30">
                          {cat.slug}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black border border-black ${
                            cat.isActive ? "bg-emerald-200 text-emerald-900" : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 font-semibold mt-1">
                        {cat.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <span className="px-3 py-1 rounded-xl bg-amber-100 border-2 border-black text-amber-900 text-xs font-black shadow-[2px_2px_0px_#000]">
                      {cat.questionCount} Questions ({cat.subjects.length} Subjects)
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenCreateSubject(cat.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#2DD4BF] text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#20b8a5] transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Subject
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditCategory(cat)}
                      className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border-2 border-black shadow-[2px_2px_0px_#000]"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleCategoryActive(cat)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] transition-colors ${
                        cat.isActive
                          ? "bg-stone-100 text-stone-700 hover:bg-stone-200"
                          : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      }`}
                    >
                      {cat.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteCategoryTarget(cat)}
                      className="p-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                      title={`Delete Category "${cat.name}"`}
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Subjects List (Expandable) */}
                {isExpanded && (
                  <div className="p-4 bg-[#FAF7EE] space-y-2">
                    {cat.subjects.length === 0 ? (
                      <p className="text-xs text-stone-500 font-bold p-3 text-center">
                        No subjects added to this category yet.
                      </p>
                    ) : (
                      cat.subjects.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-white border-2 border-black rounded-xl p-3.5 shadow-[2px_2px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-stone-100 border-2 border-black flex items-center justify-center font-black text-xs shadow-[1px_1px_0px_#000]">
                              <BookOpen className="w-4 h-4 text-stone-700" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-black">{sub.name}</span>
                                <span className="font-mono text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded border border-black/20">
                                  {sub.slug}
                                </span>
                                <span
                                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-black border border-black ${
                                    sub.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"
                                  }`}
                                >
                                  {sub.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-500 font-semibold mt-0.5 line-clamp-1">
                                {sub.description || "Standard subject curriculum"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setManagingQuestionsSubject({ subject: sub, categoryName: cat.name });
                                fetchSubjectQuestions(sub.id);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-black text-[11px] font-black text-amber-950 shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                              title="View & manage questions"
                            >
                              <Layers className="w-3 h-3 stroke-[2.5]" />
                              <span>{sub.questionCount} Questions</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditSubject(sub, cat.id)}
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border-2 border-black shadow-[1px_1px_0px_#000]"
                              title="Edit Subject"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleSubjectActive(sub)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-black border-2 border-black shadow-[1px_1px_0px_#000] transition-colors ${
                                sub.isActive
                                  ? "bg-stone-100 text-stone-700 hover:bg-stone-200"
                                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                              }`}
                            >
                              {sub.isActive ? "Deactivate" : "Activate"}
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteSubjectTarget({ subject: sub, categoryName: cat.name })}
                              className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 border-2 border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                              title={`Delete Quiz "${sub.name}"`}
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-md w-full p-6 shadow-[6px_6px_0px_#000] animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <h2 className="text-base font-black text-black">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h2>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-black text-xs font-bold focus:outline-none focus:bg-yellow-50/20"
                />
              </div>

              {!editingCategory && (
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">
                    Slug (Optional, auto-generated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. science"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value.toLowerCase() })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-black text-xs font-mono font-bold focus:outline-none focus:bg-yellow-50/20"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of topics under this category..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-black text-xs font-semibold focus:outline-none focus:bg-yellow-50/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border-2 border-black text-xs font-black bg-stone-100 hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl border-2 border-black text-xs font-black bg-[#FFE600] hover:bg-[#ebd400] shadow-[2px_2px_0px_#000]"
                >
                  {saving ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT SUBJECT MODAL */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-md w-full p-6 shadow-[6px_6px_0px_#000] animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <h2 className="text-base font-black text-black">
                {editingSubject ? "Edit Subject" : "Create New Subject"}
              </h2>
              <button
                type="button"
                onClick={() => setIsSubjectModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">
                  Parent Category *
                </label>
                <select
                  disabled={!!editingSubject}
                  value={subjectForm.categoryId}
                  onChange={(e) => setSubjectForm({ ...subjectForm, categoryId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-black text-xs font-black bg-stone-50 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-black text-xs font-bold focus:outline-none focus:bg-yellow-50/20"
                />
              </div>

              {!editingSubject && (
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">
                    Slug (Optional, auto-generated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. physics"
                    value={subjectForm.slug}
                    onChange={(e) => setSubjectForm({ ...subjectForm, slug: e.target.value.toLowerCase() })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-black text-xs font-mono font-bold focus:outline-none focus:bg-yellow-50/20"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief curriculum description..."
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-black text-xs font-semibold focus:outline-none focus:bg-yellow-50/20"
                />
              </div>

              {/* QUIZ THUMBNAIL IMAGE CONFIGURATION */}
              <div className="p-3 rounded-xl border-2 border-black bg-stone-50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-black text-black uppercase tracking-wider">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Quiz Thumbnail Image</span>
                  </label>
                  <span className="text-[10px] font-bold text-stone-500">Cloudinary CDN</span>
                </div>

                {/* Option 1: Direct Image URL */}
                <div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={subjectForm.thumbnailUrl}
                      onChange={(e) => setSubjectForm({ ...subjectForm, thumbnailUrl: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-lg border-2 border-black text-xs font-medium bg-white focus:outline-none"
                    />
                    {subjectForm.thumbnailUrl && (
                      <button
                        type="button"
                        onClick={() => setSubjectForm({ ...subjectForm, thumbnailUrl: "" })}
                        className="p-1.5 rounded-lg border-2 border-black bg-stone-200 hover:bg-stone-300 text-black text-xs"
                        title="Clear image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Option 2 & 3: Upload from file OR Generate with Cloudflare AI */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* File Upload Button */}
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black bg-white hover:bg-stone-100 text-xs font-black cursor-pointer shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all">
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleUploadFile}
                      className="hidden"
                    />
                  </label>

                  {/* AI Generate Button (Cloudflare Workers AI) */}
                  <button
                    type="button"
                    disabled={generatingImage}
                    onClick={handleGenerateAiImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black bg-[#FFE600] hover:bg-[#ebd400] text-black text-xs font-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    {generatingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5 text-purple-700" />
                    )}
                    <span>{generatingImage ? "Generating AI..." : "Generate with Cloudflare AI"}</span>
                  </button>
                </div>

                {/* Auto-generate checkbox if creating new quiz and leaving image blank */}
                <label className="flex items-center gap-2 pt-1 text-[11px] font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectForm.autoGenerateThumbnail}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, autoGenerateThumbnail: e.target.checked })
                    }
                    className="w-3.5 h-3.5 rounded border-2 border-black text-black"
                  />
                  <span>Auto-generate with AI on save if no image is uploaded</span>
                </label>

                {/* Image Preview Box */}
                {subjectForm.thumbnailUrl && (
                  <div className="pt-2 flex items-center gap-3 bg-white p-2 rounded-xl border border-black/30">
                    <div className="w-14 h-14 rounded-lg border-2 border-black overflow-hidden relative bg-stone-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={subjectForm.thumbnailUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-emerald-700">Image attached</p>
                      <p className="text-[10px] text-stone-500 truncate">{subjectForm.thumbnailUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border-2 border-black text-xs font-black bg-stone-100 hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl border-2 border-black text-xs font-black bg-[#FFE600] hover:bg-[#ebd400] shadow-[2px_2px_0px_#000]"
                >
                  {saving ? "Saving..." : editingSubject ? "Save Changes" : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CATEGORY CONFIRMATION MODAL */}
      {deleteCategoryTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7EE] border-[3px] border-black rounded-[28px] max-w-md w-full p-6 sm:p-7 shadow-[8px_8px_0px_#000] space-y-4 animate-in fade-in duration-150 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] border-2 border-black text-red-600 flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000]">
              <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                Delete Category?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-stone-600 mt-2 leading-relaxed">
                Are you sure you want to delete <span className="text-black font-black">"{deleteCategoryTarget.name}"</span>?
                This will permanently delete the category, its{" "}
                <span className="text-red-600 font-black">{deleteCategoryTarget.subjects.length} quizzes</span>, and all{" "}
                <span className="text-red-600 font-black">{deleteCategoryTarget.questionCount} questions</span>.
              </p>
            </div>

            <div className="p-3 bg-red-50 border-2 border-black rounded-xl text-[11px] font-black text-red-800 text-left">
              ⚠️ Warning: This action is permanent and cannot be undone.
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCategoryTarget(null)}
                disabled={deleting}
                className="w-full sm:flex-1 py-3 px-4 rounded-full bg-white hover:bg-stone-100 text-black border-2 border-black font-black text-xs shadow-[3px_3px_0px_#000] cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                disabled={deleting}
                className="w-full sm:flex-1 py-3 px-4 rounded-full bg-[#EF4444] hover:bg-red-600 text-white border-2 border-black font-black text-xs shadow-[3px_3px_0px_#000] cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Category</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE QUIZ (SUBJECT) CONFIRMATION MODAL */}
      {deleteSubjectTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7EE] border-[3px] border-black rounded-[28px] max-w-md w-full p-6 sm:p-7 shadow-[8px_8px_0px_#000] space-y-4 animate-in fade-in duration-150 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] border-2 border-black text-red-600 flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000]">
              <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                Delete Quiz?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-stone-600 mt-2 leading-relaxed">
                Are you sure you want to delete the quiz{" "}
                <span className="text-black font-black">"{deleteSubjectTarget.subject.name}"</span> under{" "}
                <span className="text-black font-black">{deleteSubjectTarget.categoryName}</span>?
                This will permanently delete this quiz and its{" "}
                <span className="text-red-600 font-black">{deleteSubjectTarget.subject.questionCount} questions</span>.
              </p>
            </div>

            <div className="p-3 bg-red-50 border-2 border-black rounded-xl text-[11px] font-black text-red-800 text-left">
              ⚠️ Warning: This will remove the quiz from matchmaking and delete all its questions.
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteSubjectTarget(null)}
                disabled={deleting}
                className="w-full sm:flex-1 py-3 px-4 rounded-full bg-white hover:bg-stone-100 text-black border-2 border-black font-black text-xs shadow-[3px_3px_0px_#000] cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubject}
                disabled={deleting}
                className="w-full sm:flex-1 py-3 px-4 rounded-full bg-[#EF4444] hover:bg-red-600 text-white border-2 border-black font-black text-xs shadow-[3px_3px_0px_#000] cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE QUESTIONS MODAL FOR A SUBJECT / QUIZ */}
      {managingQuestionsSubject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7EE] border-[3px] border-black rounded-[28px] max-w-3xl w-full max-h-[88vh] flex flex-col shadow-[8px_8px_0px_#000] animate-in fade-in duration-150 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 bg-white border-b-2 border-black flex items-center justify-between gap-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#DDD6FE] border border-black uppercase">
                    {managingQuestionsSubject.categoryName}
                  </span>
                  <h2 className="text-lg font-black text-black">
                    {managingQuestionsSubject.subject.name} — Questions ({subjectQuestions.length})
                  </h2>
                </div>
                <p className="text-xs text-stone-500 font-bold mt-0.5">
                  Browse questions in this quiz or delete individual questions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {subjectQuestions.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      handleClearSubjectQuestions(
                        managingQuestionsSubject.subject.id,
                        managingQuestionsSubject.subject.name
                      )
                    }
                    disabled={deleting}
                    className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Clear all questions in this quiz"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setManagingQuestionsSubject(null);
                    setSubjectQuestions([]);
                  }}
                  className="p-1.5 rounded-xl border-2 border-black bg-stone-100 hover:bg-stone-200 shadow-[1px_1px_0px_#000] cursor-pointer"
                >
                  <X className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>

            {/* Questions Body List */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1 bg-[#FAF7EE]">
              {questionsLoading ? (
                <div className="p-12 text-center bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000]">
                  <div className="w-8 h-8 border-4 border-black border-t-[#FFE600] rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs font-black text-stone-700">Loading quiz questions...</p>
                </div>
              ) : subjectQuestions.length === 0 ? (
                <div className="p-12 text-center bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000] space-y-2">
                  <p className="text-xs font-bold text-stone-500">
                    No questions found for this quiz.
                  </p>
                  <p className="text-[11px] font-bold text-stone-400">
                    Use the "Import Questions" page to upload questions into this quiz.
                  </p>
                </div>
              ) : (
                subjectQuestions.map((q, idx) => (
                  <div
                    key={q.id || q.questionId}
                    className="bg-white border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_#000] space-y-2.5 relative"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black bg-stone-100 border border-black/30 px-2 py-0.5 rounded">
                          #{idx + 1} • {q.questionId}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black border border-black uppercase ${
                            q.difficulty === "easy"
                              ? "bg-emerald-100 text-emerald-800"
                              : q.difficulty === "hard"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDeleteQuestionTarget(q)}
                        className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 border-2 border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                        title="Delete this question"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm font-black text-black leading-snug">
                      {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctAnswer;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-xl text-xs font-bold border ${
                              isCorrect
                                ? "bg-emerald-100 border-emerald-600 text-emerald-950 font-black"
                                : "bg-stone-50 border-black/20 text-stone-700"
                            } flex items-center justify-between gap-1`}
                          >
                            <span className="truncate">
                              <span className="font-mono mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                              {opt}
                            </span>
                            {isCorrect && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <p className="text-[11px] font-semibold text-stone-600 bg-stone-50 p-2 rounded-xl border border-black/10">
                        <span className="font-bold text-black">Explanation: </span>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-white border-t-2 border-black flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setManagingQuestionsSubject(null);
                  setSubjectQuestions([]);
                }}
                className="px-5 py-2 rounded-full border-2 border-black text-xs font-black bg-stone-100 hover:bg-stone-200 shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE SINGLE QUESTION CONFIRMATION MODAL */}
      {deleteQuestionTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7EE] border-[3px] border-black rounded-[28px] max-w-sm w-full p-6 shadow-[8px_8px_0px_#000] space-y-4 animate-in fade-in duration-150 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] border-2 border-black text-red-600 flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-xl font-black text-black">
                Delete Question?
              </h3>
              <p className="text-xs font-bold text-stone-600 mt-1 line-clamp-3 leading-relaxed">
                "{deleteQuestionTarget.question}"
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteQuestionTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 px-3 rounded-full bg-white hover:bg-stone-100 text-black border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteQuestion}
                disabled={deleting}
                className="flex-1 py-2.5 px-3 rounded-full bg-[#EF4444] hover:bg-red-600 text-white border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
