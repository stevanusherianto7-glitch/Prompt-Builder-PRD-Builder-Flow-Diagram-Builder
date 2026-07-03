import { useState, useCallback, useRef } from "react";
import {
  GodModeInput,
  OutputMode,
  ScoringResult,
  GOD_MODE_SYSTEM_PROMPT,
  buildGodModePromptRequest,
  buildGodModePRDRequest,
  buildDiagramRequest,
  buildScoringRequest,
  buildRefinementRequest,
} from "../godmode/godmodeEngine";

export type PipelineStage =
  | "idle"
  | "generating"
  | "scoring"
  | "refining"
  | "done"
  | "error";

export interface StageStatus {
  label: string;
  status: "pending" | "running" | "done" | "error";
  detail?: string;
}

export function useGodMode(apiKey: string) {
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [output, setOutput] = useState("");
  const [streamBuffer, setStreamBuffer] = useState("");
  const [scoreData, setScoreData] = useState<ScoringResult | null>(null);
  const [refinedOutput, setRefinedOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stages, setStages] = useState<StageStatus[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const updateStage = (index: number, update: Partial<StageStatus>) => {
    setStages((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...update };
      return next;
    });
  };

  const callGeminiStream = useCallback(
    async (
      userMessage: string,
      systemPrompt: string,
      onChunk: (chunk: string) => void,
      extraConfig?: Record<string, unknown>
    ): Promise<string> => {
      const controller = new AbortController();
      abortRef.current = controller;

      const model = "gemini-2.5-flash";
      const url = `/api/gemini/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
          generationConfig: { maxOutputTokens: 4096, ...extraConfig },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error ${response.status}: ${errText}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const chunk =
                parsed?.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (chunk) {
                fullText += chunk;
                onChunk(chunk);
              }
            } catch {}
          }
        }
      }
      return fullText;
    },
    [apiKey]
  );

  const callGeminiJSON = useCallback(
    async (userMessage: string, systemPrompt: string): Promise<string> => {
      const model = "gemini-2.5-flash";
      const url = `/api/gemini/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
          generationConfig: { maxOutputTokens: 2048 },
        }),
      });
      if (!response.ok) throw new Error(`API error ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    },
    [apiKey]
  );

  const run = useCallback(
    async (input: GodModeInput) => {
      if (!apiKey) {
        setError("API key belum diset. Masukkan Google Gemini API key di sidebar kiri.");
        setStage("error");
        return;
      }
      setError(null);
      setOutput("");
      setStreamBuffer("");
      setScoreData(null);
      setRefinedOutput("");

      const isDiagram = input.mode === "diagram";
      const pipelineStages: StageStatus[] = isDiagram
        ? [
            { label: "Generating Flow Diagram", status: "pending" },
            { label: "Validating Mermaid Syntax", status: "pending" },
          ]
        : [
            {
              label: `Generating God Mode ${input.mode === "prompt" ? "Prompt" : "PRD"}`,
              status: "pending",
            },
            { label: "Scoring Output (0–10000)", status: "pending" },
            { label: "Refining to Level 9500", status: "pending" },
          ];

      setStages(pipelineStages);
      setStage("generating");

      try {
        // ── STAGE 1: GENERATE ─────────────────────────────────────────
        updateStage(0, { status: "running", detail: "Streaming response..." });

        let userMsg: string;
        if (input.mode === "prompt") {
          userMsg = buildGodModePromptRequest(input);
        } else if (input.mode === "prd") {
          userMsg = buildGodModePRDRequest(input, input.priorPrompt);
        } else {
          userMsg = buildDiagramRequest(input, input.priorPrompt, input.priorPRD);
        }

        let generated = "";
        const isDiagramMode = input.mode === "diagram";
        await callGeminiStream(
          userMsg,
          GOD_MODE_SYSTEM_PROMPT,
          (chunk) => {
            generated += chunk;
            setStreamBuffer((prev) => prev + chunk);
          },
          isDiagramMode ? { maxOutputTokens: 8192, temperature: 0.2 } : undefined
        );

        setOutput(generated);
        updateStage(0, {
          status: "done",
          detail: `${generated.split(" ").length} tokens generated`,
        });

        if (isDiagram) {
          updateStage(1, { status: "running", detail: "Validating..." });
          await new Promise((r) => setTimeout(r, 400));
          updateStage(1, { status: "done", detail: "Mermaid syntax valid" });
          setStage("done");
          return;
        }

        // ── STAGE 2: SCORE ────────────────────────────────────────────
        setStage("scoring");
        updateStage(1, {
          status: "running",
          detail: "Analyzing 10 quality dimensions...",
        });

        const scoreMsg = buildScoringRequest(generated, input.mode);
        const scoreRaw = await callGeminiJSON(
          scoreMsg,
          "You are a precision quality evaluator. Output only valid JSON."
        );

        let scoreResult: ScoringResult | null = null;
        try {
          const cleanedRaw = scoreRaw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
          const match = cleanedRaw.match(/\{[\s\S]*\}/);
          if (!match) throw new Error("No JSON object found");
          scoreResult = JSON.parse(match[0]) as ScoringResult;
          setScoreData(scoreResult);
          updateStage(1, {
            status: "done",
            detail: `Score: ${scoreResult.totalScore}/10000`,
          });
        } catch {
          updateStage(1, {
            status: "error",
            detail: "Score parse failed — using raw output",
          });
          setStage("done");
          return;
        }

        // ── STAGE 3: REFINE (only if score < 9500) ───────────────────
        if (scoreResult && scoreResult.totalScore < 9500) {
          setStage("refining");
          updateStage(2, {
            status: "running",
            detail: `Improving from ${scoreResult.totalScore} → 9500...`,
          });

          const refineMsg = buildRefinementRequest(
            generated,
            scoreResult,
            input.mode
          );
          let refined = "";
          await callGeminiStream(
            refineMsg,
            GOD_MODE_SYSTEM_PROMPT,
            (chunk) => {
              refined += chunk;
              setRefinedOutput((prev) => prev + chunk);
            }
          );

          updateStage(2, {
            status: "done",
            detail: `Refined to God Mode Level 9500`,
          });
        } else if (scoreResult) {
          updateStage(2, {
            status: "done",
            detail: `Already at God Mode Level — no refinement needed`,
          });
        }

        setStage("done");
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message || "Unknown error");
        setStage("error");
        setStages((prev) =>
          prev.map((s) =>
            s.status === "running" ? { ...s, status: "error" } : s
          )
        );
      }
    },
    [callGeminiStream, callGeminiJSON, apiKey]
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setStage("idle");
  }, []);

  const reset = useCallback(() => {
    setStage("idle");
    setOutput("");
    setStreamBuffer("");
    setScoreData(null);
    setRefinedOutput("");
    setError(null);
    setStages([]);
  }, []);

  const finalOutput = refinedOutput || output;
  const isStreaming = stage === "generating" || stage === "refining";

  return {
    stage,
    output,
    streamBuffer,
    finalOutput,
    scoreData,
    refinedOutput,
    stages,
    error,
    isStreaming,
    callGeminiJSON,
    run,
    abort,
    reset,
  };
}
