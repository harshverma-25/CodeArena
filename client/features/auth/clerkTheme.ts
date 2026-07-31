import { dark } from "@clerk/themes";

export const clerkTheme = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#f97316", // Competitive Orange
    colorBackground: "#0f0f12", // Card background
    colorText: "#fafafa", // Foreground text
    colorTextSecondary: "#a1a1aa", // Muted text
    colorInputBackground: "#09090b", // Deep input background
    colorInputText: "#fafafa",
    colorBorder: "#27272a", // Border colors
    borderRadius: "0.5rem",
  },
  elements: {
    card: "border border-border bg-card/60 backdrop-blur-md shadow-2xl font-sans",
    headerTitle: "text-foreground font-sans font-bold text-2xl tracking-tight",
    headerSubtitle: "text-muted-foreground font-sans",
    socialButtonsBlockButton: "border border-border bg-background hover:bg-secondary/40 text-foreground transition-all duration-200",
    formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md active:scale-95 transition-all duration-150",
    footerActionText: "text-muted-foreground font-sans",
    footerActionLink: "text-primary hover:text-primary/80 font-medium transition-colors",
    formFieldLabel: "text-muted-foreground font-medium text-xs font-sans",
    formFieldInput: "border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-150",
  },
};
export default clerkTheme;
