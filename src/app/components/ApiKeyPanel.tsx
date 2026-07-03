import React, { useState, useEffect } from "react";
import { Key, Eye, EyeOff, ShieldAlert, CheckCircle2, Trash2, X } from "lucide-react";
import { cn } from "./Status";
import { ApiProviderId, ApiProviderInfo, API_PROVIDERS } from "../hooks/useApiKey";

interface ApiKeyPanelProps {
  apiKey: string;
  maskedKey: string;
  hasKey: boolean;
  onSave: (key: string) => void;
  onClear: () => void;
  provider?: ApiProviderInfo;
  providerId?: ApiProviderId;
  onProviderChange?: (id: ApiProviderId) => void;
}

export function ApiKeyPanel({
  apiKey,
  maskedKey,
  hasKey,
  onSave,
  onClear,
  provider = API_PROVIDERS.gemini,
  providerId = "gemini",
  onProviderChange,
}: ApiKeyPanelProps) {
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(!hasKey);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEditing(!hasKey);
    setInput("");
    setShow(false);
  }, [providerId, hasKey]);

  const handleSave = () => {
    if (!input.trim()) return;
    onSave(input.trim());
    setInput("");
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClear = () => {
    onClear();
    setEditing(true);
    setInput("");
  };

  return (
    <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
      {/* Input Area */}
      <div className="px-3.5 py-3 flex flex-col gap-2.5">
        {/* Provider Selector Dropdown */}
        {onProviderChange && (
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Key className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                AI Provider
              </span>
            </div>
            <select
              value={providerId}
              onChange={(e) => onProviderChange(e.target.value as ApiProviderId)}
              className="bg-secondary hover:bg-secondary/80 border border-border text-foreground text-[11px] font-medium rounded-md px-2 py-1 outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="gemini">Google Gemini</option>
              <option value="claude">Anthropic Claude</option>
              <option value="openai">OpenAI GPT-4</option>
              <option value="deepseek">DeepSeek AI</option>
            </select>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-[11px] font-semibold text-foreground truncate">
            {provider.name} Key
          </span>
          {hasKey && !editing && (
            <span className="flex items-center gap-1 text-[10.5px] text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Active
            </span>
          )}
        </div>

        {hasKey && !editing ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary border border-border font-mono text-[11px] text-muted-foreground overflow-hidden">
              <span className="truncate">{show ? apiKey : maskedKey}</span>
              <button
                onClick={() => setShow((v) => !v)}
                className="p-1 rounded hover:text-foreground transition-colors flex-shrink-0"
                title={show ? "Hide key" : "Show key"}
              >
                {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setEditing(true)}
                className="flex-1 h-7 rounded-lg bg-secondary border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Change Key
              </button>
              <button
                onClick={handleClear}
                className="h-7 px-2.5 flex items-center justify-center rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-colors text-[11px]"
                title="Remove key"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={show ? "text" : "password"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder={provider.placeholder}
                className="w-full h-8 pl-3 pr-8 rounded-lg bg-secondary border border-border text-xs font-mono focus:border-primary outline-none transition-colors"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                onClick={() => setShow((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {show ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
            <button
              onClick={handleSave}
              disabled={!input.trim()}
              className={cn(
                "h-8 px-4 rounded-lg text-xs font-medium transition-colors",
                saved
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
              )}
            >
              {saved ? "Saved!" : "Save"}
            </button>
            {hasKey && editing && (
              <button
                onClick={() => setEditing(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
          Dapatkan API key di{" "}
          <a
            href={provider.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {provider.urlLabel}
          </a>
          . Key disimpan hanya di browser Anda.
        </p>
      </div>
    </div>
  );
}
