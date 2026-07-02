import React, { useState } from "react";
import { Key, Eye, EyeOff, ShieldAlert, CheckCircle2, Trash2, X } from "lucide-react";
import { cn } from "./Status";

interface ApiKeyPanelProps {
  apiKey: string;
  maskedKey: string;
  hasKey: boolean;
  onSave: (key: string) => void;
  onClear: () => void;
}

export function ApiKeyPanel({ apiKey, maskedKey, hasKey, onSave, onClear }: ApiKeyPanelProps) {
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(!hasKey);
  const [saved, setSaved] = useState(false);

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
      <div className="px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Key className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Google Gemini API Key
          </span>
          {hasKey && !editing && (
            <span className="ml-auto flex items-center gap-1 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Active
            </span>
          )}
        </div>

        {hasKey && !editing ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 h-8 px-3 rounded-lg bg-secondary border border-border font-mono text-xs text-muted-foreground">
              {show ? apiKey : maskedKey}
            </div>
            <button
              onClick={() => setShow((v) => !v)}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors"
              title={show ? "Hide key" : "Show key"}
            >
              {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="h-8 px-3 rounded-lg bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Change
            </button>
            <button
              onClick={handleClear}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-colors"
              title="Remove key"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={show ? "text" : "password"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="AIzaSy..."
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

        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          Dapatkan API key <strong>gratis</strong> di{" "}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            aistudio.google.com/apikey
          </a>
          . Key disimpan hanya di browser Anda.
        </p>
      </div>
    </div>
  );
}
