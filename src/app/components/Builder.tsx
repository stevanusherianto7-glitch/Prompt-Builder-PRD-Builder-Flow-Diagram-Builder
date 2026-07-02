import React, { useState, useEffect, useRef } from "react";
import { Wand2, FileText, Copy, Play, Save, RefreshCw, Settings2, Sparkles, Network, Mic, Plus } from "lucide-react";
import mermaid from "mermaid";
import { cn } from "./Status";

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  fontFamily: 'Geist, sans-serif'
});

type Mode = "prompt" | "prd" | "diagram";

function MermaidViewer({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && chart) {
      const renderChart = async () => {
        try {
          containerRef.current!.innerHTML = '';
          const id = `mermaid-chart-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error("Mermaid rendering failed:", error);
          if (containerRef.current) {
            containerRef.current.innerHTML = '<div class="text-destructive text-sm p-4 border border-destructive/20 rounded-md bg-destructive/10">Failed to render diagram. Check syntax.</div>';
          }
        }
      };
      renderChart();
    }
  }, [chart]);

  return <div ref={containerRef} className="w-full flex justify-center py-6 overflow-x-auto" />;
}

export function Builder() {
  const [mode, setMode] = useState<Mode>("prompt");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");

  // Form states
  const [title, setTitle] = useState("SaaS Dashboard App");
  const [role, setRole] = useState("Expert Frontend Engineer (React/Tailwind)");
  const [objective, setObjective] = useState("Build a modern data analytics dashboard with chart visualizations.");
  const [audience, setAudience] = useState("Data analysts and marketing managers");
  const [tone, setTone] = useState("Swiss + Data-Dense Dark mode");
  
  // PRD specific states
  const [features, setFeatures] = useState("- Interactive line charts\n- Filter by date range\n- Export to CSV");

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const safeText = (text: string) => text.replace(/[^a-zA-Z0-9 ]/g, '').trim().substring(0, 40) || 'Step';
      const featureListArray = features ? features.split('\n').filter(f => f.trim().length > 0) : [];

      if (mode === "prompt") {
        const featureList = featureListArray.map(f => f.trim().startsWith('-') ? f : `- ${f}`).join('\n');
        setOutput(`# STRUCTURED SYSTEM PROMPT

## 1. ROLE & IDENTITY
You are an **${role || 'Expert Software Engineer'}**. Your defining characteristics are precision, architectural forethought, and strict adherence to established design systems.

## 2. OBJECTIVE
**Primary Task:** ${objective || 'Build an interactive web application.'}

## 3. CONTEXT & PARAMETERS
- **Target End-Users:** ${audience || 'General public'}
- **UI/UX Tone & Aesthetic:** ${tone || 'Professional, clean, and modern'}
- **Required Feature Scope:**
${featureList || '- Core functionality as defined in the objective'}

## 4. EXECUTION WORKFLOW
Follow this operational lifecycle strictly:
1. **[Phase 1] Analysis:** Map out the component hierarchy and state management approach based on the parameters.
2. **[Phase 2] Foundation:** Establish the base layout and apply the design system variables matching the specified Tone.
3. **[Phase 3] Implementation:** Build the functional components and wire up the interactive features.
4. **[Phase 4] Verification:** Review the code against the Anti-Patterns list before finalizing output.

## 5. ANTI-PATTERNS (AVOID STRICTLY)
- ❌ Outputting partial code snippets, placeholders, or \`// TODO\` comments.
- ❌ Inventing external backend APIs or nonexistent npm packages.
- ❌ Deviating from the "${tone || 'Neutral'}" aesthetic constraint.
- ❌ Including conversational filler or explanations; output code only.

## 6. OUTPUT SCHEMA
Respond ONLY with the complete, production-ready codebase. Wrap each file in standard markdown code blocks prefixed by its exact filepath (e.g., \`// src/app/App.tsx\`).`);
      } else if (mode === "prd") {
        const featureList = featureListArray.map(f => f.trim().startsWith('-') ? f : `- ${f}`).join('\n');

        setOutput(`---
name: prd-generator
description: Generate a Product Requirements Document (PRD) based on user inputs.
version: 1.0.0
---

# ${title || 'Product Feature Name'}

## Problem Statement
${objective || 'Define the core problem being solved here.'}

## Target Users
${audience || 'Define the primary user personas.'}

## Tone & Aesthetic
${tone || 'Define the expected look, feel, and voice.'}

## Scope (Functional Requirements)
The following capabilities are mandatory for the MVP scope:
${featureList || '- Core functionality defined by objective'}

## Out of Scope
- Any feature not explicitly listed in the scope above.
- Complex third-party integrations unless specified.

## Non-Functional Requirements
- **Component Architecture:** Code must be modular and reusable.
- **Responsiveness:** Layout adapts gracefully to mobile, tablet, and desktop.
- **State Management:** Efficient use of React hooks/context.

## Success Metrics
- 100% completion of the listed Functional Requirements.
- UI fidelity matches the requested Tone & Aesthetic.
- Code compiles without errors in the target environment.

## Assumptions & Open Questions
- Assumption: The UI will be built primarily using React and Tailwind CSS.
- Open Question: Are there any specific backend API endpoints this needs to connect to in the future?`);
      } else if (mode === "diagram") {
        // Generate Mermaid.js syntax for workflow
        const featureNodes = featureListArray.map((f, i) => `    C --> F${i}[Feature: ${safeText(f)}]`).join('\n');
        
        setOutput(`graph TD
    A[Start: ${safeText(title)}] --> B{Authenticated?}
    B -- Yes --> C[Dashboard / Main UI]
    B -- No --> D[Auth Flow]
    D --> E[Login / Sign Up]
    E --> C
${featureNodes || `    C --> F0[Core: ${safeText(objective)}]`}
    C --> G[Analytics / Reporting]
    G --> H[End User: ${safeText(audience)}]
    
    style A fill:#7c6ff7,stroke:#2a2e40
    style C fill:#00d47e,stroke:#2a2e40,color:#080910
    style H fill:#1a1d2a,stroke:#2a2e40,color:#e8eaf0`);
      }
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar / Tabs */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex bg-secondary p-1 rounded-lg border border-border">
          <button 
            onClick={() => { setMode("prompt"); setOutput(""); }}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              mode === "prompt" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Wand2 className="w-4 h-4" /> Prompt Builder
          </button>
          <button 
            onClick={() => { setMode("prd"); setOutput(""); }}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              mode === "prd" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="w-4 h-4" /> PRD Builder
          </button>
          <button 
            onClick={() => { setMode("diagram"); setOutput(""); }}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              mode === "diagram" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Network className="w-4 h-4" /> Flow Diagram
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary transition-colors">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Inputs */}
        <div className="w-1/2 flex flex-col border-r border-border bg-background overflow-y-auto">
          <div className="p-6 flex flex-col gap-6 max-w-3xl w-full mx-auto">
            
            <div className="flex flex-col items-center justify-center pt-6 pb-2">
              <h2 className="text-3xl font-light mb-6 flex items-center gap-3">
                Build your ideas with AI <Sparkles className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
              </h2>
              
              <div className="relative w-full rounded-[24px] bg-gradient-to-r from-blue-400/80 via-primary/80 to-orange-400/80 p-[1px] shadow-lg mb-4">
                <div className="bg-background rounded-[23px] w-full flex flex-col h-32 p-4">
                  <textarea 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full flex-1 bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground/60 text-base"
                    placeholder="Describe an app and let the AI do the rest"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
                        <Mic className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" /> I'm feeling lucky
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 scrollbar-hide">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors whitespace-nowrap">
                  <span className="text-green-500">🤖</span> Build an Android app
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors whitespace-nowrap">
                  <span className="text-blue-500">📁</span> Google Drive
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors whitespace-nowrap">
                  <span className="text-green-400">📊</span> Google Sheets
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors whitespace-nowrap">
                  <span className="text-red-500">✉️</span> Gmail
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors whitespace-nowrap">
                  <span className="text-blue-400">📅</span> Google Calendar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">AI Agent Persona</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                  placeholder="E.g., Expert React/Tailwind Developer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">App UI/UX Tone</label>
                <input 
                  type="text" 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                  placeholder="E.g., Modern, Dark mode, Data-dense"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">App Target Audience (End-Users)</label>
              <input 
                type="text" 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                placeholder="Who will use the generated app?"
              />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs font-medium text-muted-foreground">App Objective / Main Task</label>
              <textarea 
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full min-h-[120px] bg-input-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all resize-none"
                placeholder="Describe exactly what the AI agent needs to build..."
              />
            </div>

            {(mode === "prd" || mode === "diagram") && (
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-xs font-medium text-muted-foreground">Required Features / Scope</label>
                <textarea 
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full min-h-[120px] bg-input-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all resize-none font-mono"
                  placeholder="- Feature 1\n- Feature 2"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="w-1/2 flex flex-col bg-[#0b0c10] relative">
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button 
              className="p-2 bg-secondary/80 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors border border-border shadow-sm backdrop-blur-sm"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button 
              className="p-2 bg-secondary/80 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors border border-border shadow-sm backdrop-blur-sm"
              title="Test in Playground"
            >
              <Play className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 relative">
            {!output && !isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                {mode === "prompt" && <Wand2 className="w-12 h-12 mb-4" />}
                {mode === "prd" && <FileText className="w-12 h-12 mb-4" />}
                {mode === "diagram" && <Network className="w-12 h-12 mb-4" />}
                <p>Fill out the parameters and click Generate</p>
              </div>
            ) : isGenerating ? (
              <div className="prose prose-invert max-w-none">
                <pre className="bg-transparent text-sm leading-relaxed whitespace-pre-wrap font-mono text-gray-300">
                  <span className="animate-pulse text-muted-foreground">Crafting {mode === 'diagram' ? 'workflow diagram' : 'instructions'} for AI Agent...</span>
                </pre>
              </div>
            ) : (
              <div className="flex flex-col h-full gap-6">
                {mode === "diagram" && (
                  <div className="w-full bg-card rounded-xl border border-border min-h-[300px] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-2 left-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preview</div>
                    <MermaidViewer chart={output} />
                  </div>
                )}
                
                <div className={cn("prose prose-invert max-w-none flex-1", mode === "diagram" && "opacity-70 hover:opacity-100 transition-opacity")}>
                  {mode === "diagram" && <h3 className="text-sm font-semibold mb-2">Mermaid.js Source Code</h3>}
                  <pre className="bg-transparent text-sm leading-relaxed whitespace-pre-wrap font-mono text-gray-300">
                    {output}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
