import React from "react";
import { SearchCode, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function EmptyState({
  title = "No problems found",
  description = "No challenges match your current search queries or filters. Try adjusting your parameters.",
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl border border-dashed border-border bg-card/20 min-h-[300px]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/50 text-muted-foreground border border-border mb-4">
        <SearchCode className="h-7 w-7 text-muted-foreground/80" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {onReset && (
        <Button
          onClick={onReset}
          variant="secondary"
          className="gap-2 border border-border bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Filters
        </Button>
      )}
    </div>
  );
}
export default EmptyState;
