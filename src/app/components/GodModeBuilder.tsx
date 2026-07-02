import React, { useState, useRef, useEffect } from "react";
import {
  Wand2, FileText, Network, Sparkles, Copy, RefreshCw,
  CheckCircle2, Loader2, AlertTriangle, ChevronRight,
  Zap, Target, Shield, TrendingUp, Bot, X, RotateCcw
} from "lucide-react";
import mermaid from "mermaid";
import { cn } from "./Status";
import { useGodMode, PipelineStage } from "../hooks/useGodMode";
import { OutputMode } from "../godmode/godmodeEngine";
import { useApiKey } from "../hooks/useApiKey";
import { ApiKeyPanel } from "./ApiKeyPanel";

mermaid.initialize({ startOnLoad: false, theme: "dark", fontFamily: "Geist, sans-serif" });

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const pct = score / 10000;
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const color =
    score >= 9000 ? "#7c6ff7" : score >= 7000 ? "#00d47e" : score >= 5000 ? "#f5a623" : "#f04438";

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold" style={{ color }}>{score.toLocaleString()}</span>
        <span className="text-[10px] text-muted-foreground font-medium tracking-wider">/ 10000</span>
      </div>
    </div>
  );
}

function sanitizeMermaid(raw: string): string {
  let code = raw.trim();
  // Strip markdown code fences if AI wraps it
  code = code.replace(/^```mermaid\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");
  // Remove lone semicolons that break parsing
  const lines = code.split("\n").map((l) => l.replace(/;$/, ""));
  // Drop trailing incomplete lines (truncated mid-node by token limit)
  // A valid line ends with: ], }, ), "", a word char, or is blank/comment
  while (lines.length > 1) {
    const last = lines[lines.length - 1].trim();
    if (!last) { lines.pop(); continue; }
    // If line ends with a broken token (e.g. "BP_" with no closing bracket)
    const looksIncomplete = /^[A-Za-z_][A-Za-z0-9_]*$/.test(last) ||
      last.endsWith("_") ||
      last.endsWith("(") ||
      last.endsWith("[") ||
      last.endsWith("|") ||
      last.endsWith("-->") ||
      last.endsWith('"') === false && last.includes('"') && (last.match(/"/g) || []).length % 2 !== 0;
    if (looksIncomplete) { lines.pop(); continue; }
    break;
  }
  return lines.join("\n").trim();
}

function MermaidViewer({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current || !chart) return;
    setRenderError(null);
    const clean = sanitizeMermaid(chart);
    const id = "m" + Math.random().toString(36).slice(2, 9);
    mermaid.render(id, clean)
      .then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
          setRenderError(null);
        }
      })
      .catch((err) => {
        const msg = err?.message || "Mermaid syntax error";
        setRenderError(msg);
        if (ref.current) ref.current.innerHTML = "";
      });
  }, [chart]);

  return (
    <div className="w-full">
      {renderError ? (
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-destructive text-xs font-semibold">
            <span>⚠ Diagram render failed:</span>
            <span className="font-normal text-muted-foreground">{renderError}</span>
          </div>
          <pre className="text-[10px] text-muted-foreground bg-secondary/40 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap border border-border">
            {sanitizeMermaid(chart)}
          </pre>
        </div>
      ) : (
        <div ref={ref} className="w-full flex justify-center py-6 overflow-x-auto" />
      )}
    </div>
  );
}

// ─── Pipeline Stage Row ───────────────────────────────────────────────────────

function PipelineRow({ label, status, detail }: { label: string; status: string; detail?: string }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-secondary/30 border border-border">
      <div className="w-5 h-5 flex-shrink-0">
        {status === "running" && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
        {status === "done" && <CheckCircle2 className="w-4 h-4 text-accent" />}
        {status === "error" && <AlertTriangle className="w-4 h-4 text-destructive" />}
        {status === "pending" && <div className="w-4 h-4 rounded-full border-2 border-border" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground">{label}</p>
        {detail && <p className="text-[11px] text-muted-foreground truncate">{detail}</p>}
      </div>
    </div>
  );
}

// ─── Score Dimension Bar ─────────────────────────────────────────────────────

function DimBar({ label, score, max, critique }: { label: string; score: number; max: number; critique: string }) {
  const pct = (score / max) * 100;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
        <span className="text-[11px] font-mono text-foreground">{score}/{max}</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: pct >= 90 ? "#7c6ff7" : pct >= 70 ? "#00d47e" : pct >= 50 ? "#f5a623" : "#f04438"
          }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground/70 leading-snug">{critique}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GodModeBuilder() {
  const [mode, setMode] = useState<OutputMode>("prompt");
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [objective, setObjective] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [features, setFeatures] = useState("");
  const [copied, setCopied] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // Simpan hasil generate setiap tab di state & localStorage agar tahan refresh
  const [generatedPrompt, setGeneratedPrompt] = useState(() => localStorage.getItem("godmode_prior_prompt") || "");
  const [generatedPRD, setGeneratedPRD] = useState(() => localStorage.getItem("godmode_prior_prd") || "");
  const [showContextPanel, setShowContextPanel] = useState(true);

  const { apiKey, setApiKey, clearApiKey, hasKey, maskedKey } = useApiKey();
  const { stage, streamBuffer, finalOutput, scoreData, stages, error, isStreaming, callGeminiJSON, run, abort, reset } = useGodMode(apiKey);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const isIdle = stage === "idle";
  const isDone = stage === "done";
  const isError = stage === "error";
  const hasOutput = finalOutput.length > 0;
  const hasStream = streamBuffer.length > 0;
  const displayOutput = hasOutput ? finalOutput : streamBuffer;

  useEffect(() => {
    if (outputRef.current) {
      if (isStreaming) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      } else if (isDone) {
        outputRef.current.scrollTop = 0;
      }
    }
  }, [streamBuffer, isStreaming, isDone]);

  // Setelah selesai generate, simpan hasilnya ke state & localStorage yang sesuai
  useEffect(() => {
    if (isDone && finalOutput) {
      if (mode === "prompt") {
        setGeneratedPrompt(finalOutput);
        localStorage.setItem("godmode_prior_prompt", finalOutput);
      }
      if (mode === "prd") {
        setGeneratedPRD(finalOutput);
        localStorage.setItem("godmode_prior_prd", finalOutput);
      }
    }
  }, [isDone, finalOutput, mode]);

  const performAutoFill = async (): Promise<{ role?: string; tone?: string; audience?: string; objective?: string; features?: string } | null> => {
    if (!title.trim() || !hasKey) return null;
    setIsAutoFilling(true);
    try {
      const prompt = `Based on the following app idea: "${title}", infer and generate optimal professional values for a software specification builder. Return ONLY a JSON object with these exact string keys:
- "role": Agent Persona (e.g. "Senior Full-Stack Architect & Mobile UX Specialist")
- "tone": UI/UX Aesthetic (e.g. "Modern dark theme, vibrant neon accents, glassmorphic cards, responsive mobile-first UI")
- "audience": Target Audience (e.g. "Restaurant managers, HR directors, and frontline restaurant staff")
- "objective": Objective (e.g. "Streamline attendance tracking with secure QR verification and real-time GPS validation to eliminate buddy punching and simplify payroll reporting")
- "features": Features / Scope formatted as a bulleted string with "- Feature name: brief detail" (generate 4-5 core features)`;

      const resText = await callGeminiJSON(prompt, "You are a professional software architect AI. Return only valid JSON object without markdown code blocks.");
      const clean = resText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed.role) setRole(parsed.role);
      if (parsed.tone) setTone(parsed.tone);
      if (parsed.audience) setAudience(parsed.audience);
      if (parsed.objective) setObjective(parsed.objective);
      if (parsed.features) setFeatures(parsed.features);
      return parsed;
    } catch (err) {
      console.error("Auto-fill failed", err);
      return null;
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleGenerate = async () => {
    setShowScore(false);
    let currentRole = role;
    let currentTone = tone;
    let currentAudience = audience;
    let currentObjective = objective;
    let currentFeatures = features;

    if (title.trim() && !currentRole && !currentTone && !currentAudience && !currentObjective) {
      const res = await performAutoFill();
      if (res) {
        if (res.role) currentRole = res.role;
        if (res.tone) currentTone = res.tone;
        if (res.audience) currentAudience = res.audience;
        if (res.objective) currentObjective = res.objective;
        if (res.features) currentFeatures = res.features;
      }
    }

    const priorPrompt = mode === "prd" || mode === "diagram" ? generatedPrompt : undefined;
    const priorPRD = mode === "diagram" ? generatedPRD : undefined;
    run({ title, role: currentRole, objective: currentObjective, audience: currentAudience, tone: currentTone, features: currentFeatures, mode, priorPrompt, priorPRD });
  };

  const handleTabSwitch = (tabId: OutputMode) => {
    setMode(tabId);
    reset();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(displayOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: OutputMode; label: string; icon: React.ReactNode }[] = [
    { id: "prompt", label: "Prompt Builder", icon: <Wand2 className="w-4 h-4" /> },
    { id: "prd", label: "PRD Builder", icon: <FileText className="w-4 h-4" /> },
    { id: "diagram", label: "Flow Diagram", icon: <Network className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full">

      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg border border-border">
          {tabs.map((t) => {
            const hasContext =
              (t.id === "prd" && generatedPrompt) ||
              (t.id === "diagram" && (generatedPrompt || generatedPRD));
            return (
              <button
                key={t.id}
                onClick={() => handleTabSwitch(t.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition-all",
                  mode === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.icon} {t.label}
                {hasContext && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-accent absolute top-1 right-1"
                    title="Context dari Prompt/PRD sebelumnya tersedia — akan di-generate dengan alignment penuh"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* God Mode Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" /> GOD MODE 9500
          </div>

          {isStreaming ? (
            <button
              onClick={abort}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Stop
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!isIdle && !isDone && !isError}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isIdle || isDone || isError ? "Generate" : "Generating..."}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Inputs */}
        <div className="w-[42%] flex flex-col border-r border-border bg-background overflow-y-auto">
          <div className="p-6 flex flex-col gap-5 max-w-xl w-full mx-auto">

            {/* Main input */}
            <div>
              <div className="relative rounded-2xl bg-gradient-to-r from-primary/60 via-accent/40 to-chart-3/40 p-[1px] shadow-lg">
                <div className="bg-background rounded-[calc(1rem-1px)] p-4 flex flex-col">
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    rows={3}
                    className="w-full bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground/50 text-sm leading-relaxed"
                    placeholder="Describe your app or product..."
                  />
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                    <span className="text-[10px] text-muted-foreground font-medium">DESCRIBE YOUR IDEA</span>
                    <button
                      onClick={performAutoFill}
                      disabled={!title.trim() || !hasKey || isAutoFilling}
                      type="button"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/10 hover:bg-accent/20 border border-accent/20 text-[11px] font-semibold text-accent transition-all disabled:opacity-40"
                    >
                      {isAutoFilling ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" /> Auto-filling details...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" /> ✨ Auto-Fill Fields with AI
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Agent Persona</label>
                <textarea
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  rows={2}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring transition-all resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">UI/UX Aesthetic</label>
                <textarea
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  rows={2}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Objective</label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={3}
                className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring transition-all resize-none"
              />
            </div>

            {(mode === "prd" || mode === "diagram") && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Features / Scope</label>
                  <textarea
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    rows={5}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring transition-all resize-none font-mono"
                    placeholder="- Feature 1&#10;- Feature 2"
                  />
                </div>

                <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <span className="text-xs font-semibold text-accent">Linked Source Context (Auto-Aligned)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowContextPanel(!showContextPanel)}
                      className="text-[10px] text-muted-foreground hover:text-foreground underline"
                    >
                      {showContextPanel ? "Hide Details" : "Edit / Paste Context"}
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Hasil output dari proses sebelumnya disuntikkan ke prompt ini agar logika workflow dan arsitektur 100% konsisten.
                  </p>
                  {showContextPanel && (
                    <div className="flex flex-col gap-3 mt-1">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-semibold text-foreground">1. System Prompt Context (Level 9500)</label>
                          {generatedPrompt && (
                            <span className="text-[9px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">Active ({generatedPrompt.split(" ").length} words)</span>
                          )}
                        </div>
                        <textarea
                          value={generatedPrompt}
                          onChange={(e) => {
                            setGeneratedPrompt(e.target.value);
                            localStorage.setItem("godmode_prior_prompt", e.target.value);
                          }}
                          rows={4}
                          placeholder="Paste hasil generate Prompt Builder di sini jika kosong..."
                          className="w-full bg-background/80 border border-border rounded-lg p-2 text-[11px] font-mono outline-none focus:border-accent transition-all resize-y"
                        />
                      </div>
                      {mode === "diagram" && (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-semibold text-foreground">2. PRD Output Context</label>
                            {generatedPRD && (
                              <span className="text-[9px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">Active ({generatedPRD.split(" ").length} words)</span>
                            )}
                          </div>
                          <textarea
                            value={generatedPRD}
                            onChange={(e) => {
                              setGeneratedPRD(e.target.value);
                              localStorage.setItem("godmode_prior_prd", e.target.value);
                            }}
                            rows={4}
                            placeholder="Paste hasil generate PRD Builder di sini jika kosong..."
                            className="w-full bg-background/80 border border-border rounded-lg p-2 text-[11px] font-mono outline-none focus:border-accent transition-all resize-y"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* API Key Panel */}
            <ApiKeyPanel
              apiKey={apiKey}
              maskedKey={maskedKey}
              hasKey={hasKey}
              onSave={setApiKey}
              onClear={clearApiKey}
            />

            {/* God Mode info */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">God Mode Pipeline</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-mono mt-0.5">01</span>
                  <span>Generate using APEX system prompt (Level 9500)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent font-mono mt-0.5">02</span>
                  <span>Score output across 10 quality dimensions (0–10000)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-chart-3 font-mono mt-0.5">03</span>
                  <span>Auto-refine to reach Level 9500 if needed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Output + Score */}
        <div className="flex-1 flex flex-col bg-[#080910] overflow-hidden">

          {/* Output Actions Bar */}
          {(hasOutput || isStreaming) && (
            <div className="flex items-center justify-between px-6 py-2 border-b border-border bg-card/30 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center gap-2">
                {scoreData && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: scoreData.totalScore >= 9000 ? "#7c6ff7" : scoreData.totalScore >= 7000 ? "#00d47e" : "#f5a623" }} />
                      <span className="text-xs font-semibold" style={{ color: scoreData.totalScore >= 9000 ? "#7c6ff7" : "#00d47e" }}>
                        {scoreData.totalScore.toLocaleString()}/10000
                      </span>
                    </div>
                    <button
                      onClick={() => setShowScore((v) => !v)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showScore ? "Hide analysis" : "View analysis →"}
                    </button>
                  </>
                )}
                {mode === "prd" && generatedPrompt && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                    ✦ Aligned with Prompt
                  </span>
                )}
                {mode === "diagram" && (generatedPrompt || generatedPRD) && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                    ✦ Aligned with {generatedPrompt && generatedPRD ? "Prompt + PRD" : generatedPrompt ? "Prompt" : "PRD"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isDone && (
                  <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" /> New
                  </button>
                )}
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 text-xs rounded-md border transition-colors",
                    copied
                      ? "bg-accent/10 text-accent border-accent/20"
                      : "text-muted-foreground hover:text-foreground border-border hover:bg-secondary"
                  )}
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {/* Pipeline status (while running) */}
          {!isIdle && stages.length > 0 && !isDone && (
            <div className="px-6 py-3 border-b border-border bg-card/20 flex-shrink-0">
              <div className="flex flex-col gap-2">
                {stages.map((s, i) => (
                  <PipelineRow key={i} label={s.label} status={s.status} detail={s.detail} />
                ))}
              </div>
            </div>
          )}

          {/* Score analysis panel */}
          {showScore && scoreData && (
            <div className="px-6 py-4 border-b border-border bg-card/10 flex-shrink-0 overflow-y-auto max-h-[40%]">
              <div className="flex items-start gap-6">
                <ScoreRing score={scoreData.totalScore} />
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {Object.entries(scoreData.dimensions).map(([key, dim]) => (
                    <DimBar
                      key={key}
                      label={key.replace(/([A-Z])/g, " $1").trim()}
                      score={dim.score}
                      max={"noveltyIndex" === key || "godModeReadiness" === key ? 500 : 1000}
                      critique={dim.critique}
                    />
                  ))}
                </div>
              </div>
              {scoreData.topWeaknesses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Refinement Notes</p>
                  <ul className="space-y-1">
                    {scoreData.topWeaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Main output area */}
          <div ref={outputRef} className="flex-1 overflow-y-auto p-8">
            {isIdle && !hasOutput ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-primary/60" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">God Mode Ready</p>
                  <p className="text-xs mt-1 opacity-60">Configure your parameters and click Generate</p>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Target className="w-3.5 h-3.5 text-primary" />
                    <span>3-stage pipeline</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Shield className="w-3.5 h-3.5 text-accent" />
                    <span>Auto-scored & refined</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <TrendingUp className="w-3.5 h-3.5 text-chart-3" />
                    <span>Level 9500 target</span>
                  </div>
                </div>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <AlertTriangle className="w-12 h-12 text-destructive/60" />
                <div>
                  <p className="text-sm font-medium text-destructive">Generation failed</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">{error}</p>
                  <p className="text-xs text-muted-foreground mt-2 opacity-60">Make sure your Anthropic API key is valid in the request headers</p>
                </div>
                <button onClick={reset} className="px-4 py-2 text-xs rounded-md bg-secondary border border-border hover:bg-secondary/80 transition-colors">
                  Try again
                </button>
              </div>
            ) : mode === "diagram" && displayOutput && isDone ? (
              <div className="flex flex-col gap-6">
                <div className="rounded-xl border border-border bg-card/50 overflow-hidden shadow-lg">
                  <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <Network className="w-4 h-4 text-accent" /> Visual Flow Diagram Preview
                    </span>
                  </div>
                  <div className="p-4 bg-[#0a0c14]">
                    <MermaidViewer chart={displayOutput} />
                  </div>
                </div>
                <details className="rounded-xl border border-border bg-card/20 overflow-hidden group">
                  <summary className="px-4 py-2.5 text-xs text-muted-foreground font-medium cursor-pointer hover:text-foreground bg-secondary/20 list-none flex items-center justify-between">
                    <span>View Mermaid Source Code ({displayOutput.split("\n").length} lines)</span>
                    <span className="text-[10px] text-accent">Expand ↓</span>
                  </summary>
                  <pre className="p-4 text-xs font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap border-t border-border overflow-x-auto bg-background/50">
                    {displayOutput}
                  </pre>
                </details>
              </div>
            ) : (
              <div className="relative">
                {isStreaming && (
                  <div className="flex items-center gap-2 mb-4 text-xs text-primary">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {stage === "generating" ? "Generating at God Mode Level 9500..." : stage === "scoring" ? "Scoring output..." : "Refining to Level 9500..."}
                  </div>
                )}
                <pre className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {displayOutput}
                  {isStreaming && <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" />}
                </pre>
              </div>
            )}
          </div>

          {/* Done: pipeline summary */}
          {isDone && stages.length > 0 && (
            <div className="px-6 py-3 border-t border-border bg-card/20 flex-shrink-0">
              <div className="flex items-center gap-3">
                {stages.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    {i > 0 && <ChevronRight className="w-3 h-3 opacity-30" />}
                    <CheckCircle2 className={cn("w-3 h-3", s.status === "done" ? "text-accent" : "text-muted-foreground/30")} />
                    <span>{s.label}</span>
                    {s.detail && <span className="opacity-50">— {s.detail}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
