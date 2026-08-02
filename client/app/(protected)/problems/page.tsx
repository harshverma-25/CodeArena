"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, RefreshCw, Terminal } from "lucide-react";
import { useProblems, ProblemFilters, ProblemTable, EmptyState, ProblemsSkeleton } from "@/features/problems";
import { Button } from "@/components/ui/button";

function ProblemsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL query params
  const initialPage = parseInt(searchParams.get("page") || "1") || 1;
  const initialSearch = searchParams.get("search") || "";
  const initialDifficulty = searchParams.get("difficulty") || "all";
  const initialTopic = searchParams.get("topic") || "all";

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [topic, setTopic] = useState(initialTopic);
  const [page, setPage] = useState(initialPage);
  const limit = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page to 1 on search change
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync state changes with URL query string
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.append("page", page.toString());
    if (debouncedSearch) params.append("search", debouncedSearch);
    if (difficulty !== "all") params.append("difficulty", difficulty);
    if (topic !== "all") params.append("topic", topic);

    const queryString = params.toString();
    const targetUrl = `/problems${queryString ? `?${queryString}` : ""}`;
    router.push(targetUrl);
  }, [debouncedSearch, difficulty, topic, page, router]);

  // Handle filter resets
  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setDifficulty("all");
    setTopic("all");
    setPage(1);
  };

  // Fetch problems
  const { data, isLoading, isError, error, refetch } = useProblems({
    page,
    limit,
    search: debouncedSearch,
    topic,
    difficulty,
  });

  const problems = data?.problems || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Terminal className="h-8 w-8 text-primary" />
            Problem Arena
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Pick a challenge, practice your algorithm skills, or host a real-time battle code room.
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="ghost"
          className="border border-border hover:bg-secondary/40 text-foreground transition-colors self-start sm:self-auto gap-1.5"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters Grid */}
      <ProblemFilters
        search={search}
        setSearch={setSearch}
        difficulty={difficulty}
        setDifficulty={(val) => {
          setDifficulty(val);
          setPage(1); // Reset page
        }}
        topic={topic}
        setTopic={(val) => {
          setTopic(val);
          setPage(1); // Reset page
        }}
      />

      {/* Main problems data table */}
      {isLoading ? (
        <ProblemsSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-8 border border-destructive/20 bg-destructive/5 rounded-2xl text-center">
          <p className="text-sm font-semibold text-destructive font-mono mb-4">
            Connection Error: {error?.message || "Failed to load Arena problems."}
          </p>
          <Button onClick={() => refetch()} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Try Reconnecting
          </Button>
        </div>
      ) : problems.length === 0 ? (
        <EmptyState onReset={handleResetFilters} />
      ) : (
        <div className="space-y-4">
          <ProblemTable problems={problems} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/40 pt-4 font-mono text-xs text-muted-foreground">
              <span>
                Page <strong className="text-foreground">{page}</strong> of{" "}
                <strong className="text-foreground">{totalPages}</strong> (Total: {data?.total || 0})
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="ghost"
                  size="sm"
                  className="border border-border bg-card hover:bg-secondary/45 disabled:opacity-50 text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="ghost"
                  size="sm"
                  className="border border-border bg-card hover:bg-secondary/45 disabled:opacity-50 text-foreground"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProblemsPage() {
  return (
    <Suspense fallback={<ProblemsSkeleton />}>
      <ProblemsPageContent />
    </Suspense>
  );
}
