import React from "react";
import { CheckCircle2, AlertCircle, Clock, Info } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StatusType = "success" | "error" | "warning" | "info" | "neutral";

interface StatusProps {
  type: StatusType;
  children: React.ReactNode;
  className?: string;
  icon?: boolean;
}

export function Status({ type, children, className, icon = true }: StatusProps) {
  const styles = {
    success: "bg-accent/10 text-accent border-accent/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    info: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    neutral: "bg-secondary text-secondary-foreground border-border",
  };

  const IconMap = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: Clock,
    info: Info,
    neutral: Info,
  };

  const Icon = IconMap[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        styles[type],
        className
      )}
    >
      {icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}
