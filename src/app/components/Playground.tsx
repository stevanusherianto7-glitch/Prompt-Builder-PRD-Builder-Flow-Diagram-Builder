import React, { useState } from "react";
import { Play, Settings2, Save, RotateCcw, AlertTriangle, CheckCircle2, Loader2, Key } from "lucide-react";
import { Status, cn } from "./Status";
import { useApiKey } from "../hooks/useApiKey";
import { ApiKeyPanel } from "./ApiKeyPanel";

export function Playground() {
  const { apiKey, setApiKey, clearApiKey, hasKey, maskedKey } = useApiKey();
  const [systemPrompt, setSystemPrompt] = useState("You are a precision assistant. Answer only what is asked. Be concise.");
  const [userPrompt, setUserPrompt] = useState("Summarize the following customer feedback into 3 bullet points, highlighting the main pain points.\n\nFeedback:\n{{feedback_text}}");
  const [variables, setVariables] = useState([{ key: "feedback_text", value: "The app is incredibly slow when trying to load large datasets. Also, the export feature crashes frequently. Support took 3 days to respond to my ticket." }]);
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(512);
  const [response, setResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const interpolate = (text: string) => {
    let result = text;
    variables.forEach(({ key, value }) => {
      result = result.replaceAll(`{{${key}}}`, value);
    });
    return result;
  };

  const handleTest = async () => {
    if (!apiKey) {
      setError("API key belum diset. Masukkan Google Gemini API key di panel kanan.");
      return;
    }
    setIsGenerating(true);
    setResponse(null);
    setError(null);
    setLatency(null);
    const t0 = Date.now();

    try {
      const interpolatedUser = interpolate(userPrompt);

      const url = `/api/gemini/models/${selectedModel}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
          contents: [{ role: "user", parts: [{ text: interpolatedUser }] }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: temperature,
          },
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setResponse(text);
      setLatency(Date.now() - t0);
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const addVariable = () => setVariables([...variables, { key: "new_var", value: "" }]);

  return (
    <div className="flex h-full flex-col lg:flex-row gap-0 overflow-hidden">
      {/* Editor Column */}
      <div className="flex-1 flex flex-col gap-0 min-h-0 border-r border-border">
        {/* System Prompt */}
        <div className="flex flex-col border-b border-border">
          <div className="px-4 py-2 bg-secondary/30 border-b border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">System Prompt</span>
            <span className="text-[10px] text-muted-foreground font-mono">{systemPrompt.length} chars</span>
          </div>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="h-28 p-4 bg-transparent outline-none resize-none font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/40"
            placeholder="Enter system prompt..."
          />
        </div>

        {/* User Prompt */}
        <div className="flex flex-col flex-1 border-b border-border min-h-0">
          <div className="px-4 py-2 bg-secondary/30 border-b border-border flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">User Prompt</span>
              <span className="text-[10px] bg-secondary border border-border px-2 py-0.5 rounded font-mono text-muted-foreground">v2.4.1</span>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-1.5 transition-colors border border-border">
                <Save className="w-3 h-3" /> Save
              </button>
              <button
                onClick={handleTest}
                disabled={isGenerating}
                className="px-3 py-1 rounded text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                {isGenerating ? "Running..." : "Test Prompt"}
              </button>
            </div>
          </div>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="flex-1 p-4 bg-transparent outline-none resize-none font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/40"
            placeholder="Write your user prompt here... Use {{variable}} for dynamic values."
          />
        </div>

        {/* Variables */}
        <div className="h-40 flex flex-col border-b border-border lg:border-b-0 flex-shrink-0">
          <div className="px-4 py-2 border-b border-border bg-secondary/30 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Variables</span>
            <button onClick={addVariable} className="text-xs text-primary hover:underline">+ Add</button>
          </div>
          <div className="p-3 overflow-y-auto flex-1 flex flex-col gap-2">
            {variables.map((v, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={v.key}
                  onChange={(e) => {
                    const n = [...variables]; n[i].key = e.target.value; setVariables(n);
                  }}
                  className="w-1/3 h-7 px-2 rounded bg-secondary border border-border text-[11px] focus:border-ring outline-none font-mono"
                />
                <input
                  value={v.value}
                  onChange={(e) => {
                    const n = [...variables]; n[i].value = e.target.value; setVariables(n);
                  }}
                  className="flex-1 h-7 px-2 rounded bg-secondary border border-border text-[11px] focus:border-ring outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Config + Output Column */}
      <div className="w-full lg:w-80 flex flex-col gap-0 min-h-0 overflow-y-auto">
        {/* API Key Panel */}
        <div className="flex-shrink-0 border-b border-border p-4">
          <ApiKeyPanel
            apiKey={apiKey}
            maskedKey={maskedKey}
            hasKey={hasKey}
            onSave={setApiKey}
            onClear={clearApiKey}
          />
        </div>

        {/* Config */}
        <div className="flex-shrink-0 border-b border-border">
          <div className="px-4 py-2 bg-secondary/30 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Settings2 className="w-3.5 h-3.5" /> Configuration
            </span>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full h-8 px-3 rounded-lg bg-secondary border border-border text-xs focus:border-ring outline-none"
              >
                <option value="gemini-2.5-flash">gemini-2.5-flash ⚡</option>
                <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                <option value="gemini-3.5-flash">gemini-3.5-flash</option>
                <option value="gemini-2.0-flash-lite">gemini-2.0-flash-lite</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <label className="text-[11px] font-medium text-muted-foreground">Temperature</label>
                <span className="text-[11px] font-mono text-foreground">{temperature}</span>
              </div>
              <input type="range" min="0" max="2" step="0.1" value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-primary h-1.5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <label className="text-[11px] font-medium text-muted-foreground">Max Tokens</label>
                <span className="text-[11px] font-mono text-foreground">{maxTokens}</span>
              </div>
              <input type="range" min="100" max="4096" step="50" value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full accent-primary h-1.5" />
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col min-h-[200px]">
          <div className="px-4 py-2 bg-secondary/30 border-b border-border flex items-center justify-between flex-shrink-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output</span>
            {latency && <Status type="success">{latency}ms</Status>}
          </div>
          <div className={cn(
            "flex-1 p-4 text-xs leading-relaxed whitespace-pre-wrap overflow-y-auto font-mono transition-colors",
            isGenerating ? "text-primary/60" : "text-foreground/80"
          )}>
            {isGenerating ? (
              <div className="flex items-center gap-2 text-primary">
                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
              </div>
            ) : error ? (
              <div className="flex items-start gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ) : response ? (
              response
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30 gap-2 text-center">
                <RotateCcw className="w-8 h-8 opacity-20" />
                <span className="text-[11px]">Click Test Prompt to run</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
