import { loader } from "@monaco-editor/react";

export const CODEARENA_THEME_NAME = "codearena-theme";

// Custom dark theme matching the CodeArena styling
export const codearenaThemeConfig = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "", foreground: "fafafa" },
    { token: "comment", foreground: "71717a", fontStyle: "italic" },
    { token: "keyword", foreground: "f97316", fontStyle: "bold" }, // Primary competitive orange
    { token: "number", foreground: "38bdf8" }, // light blue
    { token: "string", foreground: "4ade80" }, // green
    { token: "type", foreground: "a855f7" }, // purple
    { token: "class", foreground: "facc15" }, // yellow
    { token: "function", foreground: "60a5fa" }, // blue
    { token: "operator", foreground: "f97316" },
  ],
  colors: {
    "editor.background": "#09090b", // Matches HSL(240, 10%, 3.9%)
    "editor.foreground": "#fafafa",
    "editor.lineHighlightBackground": "#18181b", // Matches HSL(240, 5.9%, 10%)
    "editorCursor.foreground": "#f97316",
    "editorLineNumber.foreground": "52525b",
    "editorLineNumber.activeForeground": "#f97316",
    "editor.selectionBackground": "#27272a",
    "editor.inactiveSelectionBackground": "#27272a",
    "editorWidget.background": "#0f0f12",
    "editorWidget.border": "#27272a",
  },
};

// Default editor configuration options
export const DEFAULT_MONACO_OPTIONS = {
  minimap: { enabled: false },
  automaticLayout: true,
  tabSize: 4,
  scrollBeyondLastLine: false,
  cursorBlinking: "smooth" as const,
  cursorSmoothCaretAnimation: "on" as const,
  lineNumbersMinChars: 3,
  padding: { top: 12, bottom: 12 },
  wordWrap: "on" as const,
  renderLineHighlight: "all" as const,
  fontFamily: "var(--font-code), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontWeight: "400",
  letterSpacing: 0.5,
  lineHeight: 22,
  smoothScrolling: true,
  bracketPairColorization: { enabled: true },
};

/**
 * Registers the custom theme with a Monaco editor instance.
 */
export function registerCodeArenaTheme(monaco: any) {
  monaco.editor.defineTheme(CODEARENA_THEME_NAME, codearenaThemeConfig);
}

/**
 * Configure and initialize Monaco pre-emptively.
 */
export function configureMonacoLoader() {
  loader.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.43.0/min/vs",
    },
  });
  
  // Register theme immediately upon load
  loader.init().then((monaco) => {
    registerCodeArenaTheme(monaco);
  });
}
