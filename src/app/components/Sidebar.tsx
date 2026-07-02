import React from "react";
import {
  Wand2, LayoutGrid, Key, Users, Settings,
  Plus, ChevronDown, Zap, Terminal
} from "lucide-react";
import { cn } from "./Status";
import { AppView } from "../App";

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: "builder" as AppView, label: "God Mode Builder", icon: Wand2 },
    { id: "dashboard" as AppView, label: "Dashboard", icon: LayoutGrid },
    { id: "playground" as AppView, label: "Playground", icon: Terminal },
  ];

  const validViews: AppView[] = ["builder", "dashboard", "playground"];

  return (
    <div className="w-60 h-full bg-sidebar border-r border-sidebar-border flex flex-col flex-shrink-0">
      {/* Org header */}
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border cursor-pointer hover:bg-sidebar-accent/50 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-sidebar-foreground leading-tight truncate">PromptOps</p>
          <p className="text-[11px] text-muted-foreground">God Mode · Pro Plan</p>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </div>

      {/* New project btn */}
      <div className="px-3 pt-3 pb-1">
        <button className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-primary py-2 px-3 rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors">
          <Plus className="w-3.5 h-3.5" /> New Project
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const isClickable = validViews.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => isClickable && onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : isClickable
                  ? "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                  : "text-sidebar-foreground/30 cursor-default"
              )}
            >
              <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-primary" : "")} />
              {item.label}
              {item.id === "builder" && (
                <span className="ml-auto text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  9500
                </span>
              )}
            </button>
          );
        })}

      </nav>
    </div>
  );
}
