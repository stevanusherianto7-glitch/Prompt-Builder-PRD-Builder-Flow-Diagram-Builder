import React from "react";
import { ChevronRight, Zap } from "lucide-react";
import { AppView } from "../App";

interface HeaderProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const VIEW_LABELS: Record<AppView, string> = {
  builder: "God Mode Builder",
  dashboard: "Dashboard",
  playground: "Playground",
};

export function Header({ activeView, onViewChange }: HeaderProps) {
  return (
    <header className="h-12 flex items-center justify-between px-5 border-b border-border bg-background flex-shrink-0">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground/60 cursor-pointer hover:text-foreground transition-colors">
          PromptOps
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
        <span className="font-medium text-foreground">{VIEW_LABELS[activeView]}</span>
        {activeView === "builder" && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
            <span className="flex items-center gap-1 text-primary font-semibold text-[11px] bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
              <Zap className="w-3 h-3" /> God Mode 9500
            </span>
          </>
        )}
      </div>

    </header>
  );
}
