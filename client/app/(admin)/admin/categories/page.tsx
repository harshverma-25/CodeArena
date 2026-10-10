"use client";

import React, { useState, useEffect } from "react";
import {
  FolderTree,
  BookOpen,
  Plus,
  Edit2,
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
} from "lucide-react";
import { useApiClient } from "@/hooks/useApiClient";
import { AdminCategoryTreeItem, AdminSubjectItem } from "@/types";

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
  const [subjectForm, setSubjectForm] = useState({ categoryId: "", name: "", slug: "", description: "", icon: "" });

  const [saving, setSaving] = useState(false);
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
    setSubjectForm({ categoryId, name: "", slug: "", description: "", icon: "" });
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
    });
    setIsSubjectModalOpen(true);
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
        });
        setActionMessage(`Updated subject "${subjectForm.name}" successfully.`);
      } else {
        await api.post("/admin/subjects", {
          categoryId: subjectForm.categoryId,
          name: subjectForm.name,
          slug: subjectForm.slug || undefined,
          description: subjectForm.description,
          icon: subjectForm.icon,
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
                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                          : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      }`}
                    >
                      {cat.isActive ? "Deactivate" : "Activate"}
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
                            <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-black text-[11px] font-black text-black">
                              {sub.questionCount} Questions
                            </span>
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
                                  ? "bg-red-50 text-red-800 hover:bg-red-100"
                                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                              }`}
                            >
                              {sub.isActive ? "Deactivate" : "Activate"}
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
    </div>
  );
}
