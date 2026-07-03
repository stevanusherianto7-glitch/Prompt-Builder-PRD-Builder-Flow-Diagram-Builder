import React from "react";
import {
  Wand2, LayoutGrid, Key, Users, Settings,
  Plus, ChevronDown, Zap, Terminal
} from "lucide-react";
import { cn } from "./Status";
import { AppView } from "../App";
import { useApiKey } from "../hooks/useApiKey";
import { ApiKeyPanel } from "./ApiKeyPanel";

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { provider, providerId, setProviderId, apiKey, maskedKey, hasKey, setApiKey, clearApiKey } = useApiKey();

  const navItems = [
    { id: "builder" as AppView, label: "God Mode Builder", icon: Wand2 },
    { id: "dashboard" as AppView, label: "Dashboard", icon: LayoutGrid },
    { id: "playground" as AppView, label: "Playground", icon: Terminal },
  ];

  const validViews: AppView[] = ["builder", "dashboard", "playground"];
  const currentView = validViews.includes(activeView) ? activeView : "builder";

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col flex-shrink-0 h-full select-none overflow-hidden">
      {/* Brand Header */}
      <div className="p-5 border-b border-sidebar-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-foreground flex items-center gap-1.5">
            PromptOps
          </h1>
          <p className="text-[11px] text-muted-foreground">God Mode · Pro Plan</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm border border-sidebar-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span>{item.label}</span>
              {item.id === "builder" && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
                  9500
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto flex-1 overflow-y-auto p-3 flex flex-col justify-end gap-3 border-t border-sidebar-border/50">
        {/* API Key Panel */}
        <ApiKeyPanel
          apiKey={apiKey}
          maskedKey={maskedKey}
          hasKey={hasKey}
          onSave={setApiKey}
          onClear={clearApiKey}
          provider={provider}
          providerId={providerId}
          onProviderChange={setProviderId}
        />

        {/* God Mode info */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">God Mode Pipeline</span>
          </div>
          <div className="space-y-1.5 text-[10.5px] text-muted-foreground leading-snug">
            <div className="flex items-start gap-1.5">
              <span className="text-primary font-mono font-bold">01</span>
              <span>Generate using APEX system prompt (Level 9500)</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-accent font-mono font-bold">02</span>
              <span>Score output across 10 quality dimensions (0–10000)</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-chart-3 font-mono font-bold">03</span>
              <span>Auto-refine to reach Level 9500 if needed</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
