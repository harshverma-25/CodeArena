import { dark } from "@clerk/themes";

export const clerkTheme = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#ffffff", // Monochrome Primary
    colorBackground: "#181818", // Surface Card Background
    colorText: "#ffffff", // Primary Text
    colorTextSecondary: "#a1a1aa", // Secondary Muted Text
    colorInputBackground: "#111111", // Deep Main Background
    colorInputText: "#ffffff",
    colorBorder: "#303030", // Border color
    borderRadius: "0.375rem", // 6px Moderate Corner Radius
  },
  elements: {
    card: "border border-border bg-card font-sans",
    headerTitle: "text-foreground font-sans font-bold text-2xl tracking-tight",
    headerSubtitle: "text-muted-foreground font-sans",
    socialButtonsBlockButton: "border border-border bg-background hover:bg-secondary/40 text-foreground transition-colors",
    formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-colors",
    footerActionText: "text-muted-foreground font-sans",
    footerActionLink: "text-foreground hover:underline font-medium transition-colors",
    formFieldLabel: "text-muted-foreground font-medium text-xs font-sans",
    formFieldInput: "border border-border bg-background text-foreground focus:ring-1 focus:ring-ring transition-colors",
  },
};
export default clerkTheme;
