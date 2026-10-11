"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface UseQuizExitGuardOptions {
  /**
   * Whether the battle is actively ongoing.
   * When false, all exit guards are bypassed.
   */
  isQuizActive: boolean;
  /**
   * Authoritative async function executed when the user confirms exit.
   */
  onExitQuiz: () => Promise<void>;
  /**
   * Default fallback destination when leaving without a specific target link.
   * Defaults to "/".
   */
  defaultExitPath?: string;
}

export function useQuizExitGuard({
  isQuizActive,
  onExitQuiz,
  defaultExitPath = "/",
}: UseQuizExitGuardOptions) {
  const router = useRouter();
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const pendingUrlRef = useRef<string | null>(null);
  const hasExitedRef = useRef<boolean>(false);
  const isExitingRef = useRef<boolean>(false);
  const onExitQuizRef = useRef(onExitQuiz);

  useEffect(() => {
    onExitQuizRef.current = onExitQuiz;
  }, [onExitQuiz]);

  // 1. Intercept in-app link clicks using capture-phase event listener
  useEffect(() => {
    if (!isQuizActive) return;

    const handleDocumentClick = (e: MouseEvent) => {
      if (!isQuizActive || hasExitedRef.current) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore anchor hashes, javascript links, tel/mailto, or empty links
      if (
        href.startsWith("#") ||
        href.startsWith("javascript:") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      // Check if the link points to the current active battle route
      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);
        if (
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search
        ) {
          return;
        }
      } catch {
        // In case of invalid URL string, skip URL parsing check
      }

      // Intercept the navigation attempt and show exit confirmation modal
      e.preventDefault();
      e.stopPropagation();

      pendingUrlRef.current = href;
      setIsExitModalOpen(true);
    };

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isQuizActive]);

  // 2. Intercept browser Back / Forward history navigation using popstate trap
  useEffect(() => {
    if (!isQuizActive) return;

    // Push dummy history entry so back button pops this state instead of immediately unloading
    window.history.pushState({ quizzyGuard: true }, "", window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      if (hasExitedRef.current) return;

      // Trap navigation and keep the user on current URL
      window.history.pushState({ quizzyGuard: true }, "", window.location.href);

      pendingUrlRef.current = defaultExitPath;
      setIsExitModalOpen(true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isQuizActive, defaultExitPath]);

  // 3. Native browser beforeunload warning for page refresh, tab close, or window close
  useEffect(() => {
    if (!isQuizActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isQuizActive || hasExitedRef.current) return;

      e.preventDefault();
      // Standard return value assignment triggers native browser prompt
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isQuizActive]);

  // Handler: "Stay in Quiz"
  const closeExitModal = useCallback(() => {
    if (isExitingRef.current) return;
    pendingUrlRef.current = null;
    setIsExitModalOpen(false);
  }, []);

  // Handler: Open modal explicitly (from in-page leave button)
  const openExitModal = useCallback((targetUrl?: string) => {
    if (hasExitedRef.current) return;
    pendingUrlRef.current = targetUrl || null;
    setIsExitModalOpen(true);
  }, []);

  // Handler: "Exit Quiz" (Confirms forfeit and navigates away)
  const confirmExit = useCallback(async () => {
    if (isExitingRef.current || hasExitedRef.current) return;
    isExitingRef.current = true;
    setIsExiting(true);

    try {
      await onExitQuizRef.current();
    } catch (error) {
      console.error("Failed to process quiz forfeit:", error);
    } finally {
      hasExitedRef.current = true;
      setIsExitModalOpen(false);
      setIsExiting(false);

      const destination = pendingUrlRef.current || defaultExitPath;
      router.push(destination);
    }
  }, [defaultExitPath, router]);

  return {
    isExitModalOpen,
    isExiting,
    openExitModal,
    closeExitModal,
    confirmExit,
  };
}

export default useQuizExitGuard;
