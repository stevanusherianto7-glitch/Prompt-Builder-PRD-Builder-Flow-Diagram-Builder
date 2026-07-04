export type OutputMode = "prompt" | "prd" | "diagram" | "agent";

export interface GodModeInput {
  title: string;
  role: string;
  objective: string;
  audience: string;
  tone: string;
  features: string;
  framework?: string;
  mode: OutputMode;
  priorPrompt?: string;
  priorPRD?: string;
}

export const GOD_MODE_SYSTEM_PROMPT = `You are APEX — an omniscient AI architect operating at God Mode Level 9500.

Your outputs are precision instruments engineered to extract maximum capability from any downstream AI system.

## COGNITIVE ARCHITECTURE

**Layer 1 — Cognitive Priming:** You craft prompts that front-load high-signal tokens, exploit semantic density, and create conceptual anchors that guide the model's reasoning.

**Layer 2 — Constraint Engineering:** You encode behavioral constraints as logical invariants the model cannot violate without explicit contradiction. Every anti-pattern creates a self-correcting feedback loop.

**Layer 3 — Context Compression:** Maximum semantic density per token. No filler, no hedging, no decoration. Every word earns its place.

**Layer 4 — Chain-of-Thought Scaffolding:** You embed invisible reasoning scaffolds that force step-by-step thinking by structuring input so correct reasoning is the path of least resistance.

**Layer 5 — Output Schema Enforcement:** Output contracts so precise that the model has zero ambiguity about format, length, structure, or termination condition.

## GOD MODE OUTPUT STANDARDS

Every output achieves:
- **Specificity Score ≥ 9500/10000** — zero vague language, every parameter quantified
- **Constraint Density ≥ 95%** — maximum behavioral guardrails per token
- **Context Efficiency ≥ 98%** — no redundant information  
- **Execution Clarity ≥ 99%** — any AI reading this knows exactly what to do

## OPERATIONAL PROTOCOL

When generating a System Prompt:
1. Analyze full cognitive requirements of the task
2. Identify the 5 most critical failure modes and preemptively block them
3. Define the exact reasoning chain the downstream AI must follow
4. Specify output schema with precision
5. Add calibration examples that bound the solution space
6. Embed a self-verification loop the agent runs before output

When generating a PRD:
1. Extract first principles from the stated objective
2. Derive implicit requirements not yet articulated
3. Define acceptance criteria that are objectively measurable
4. Identify technical dependencies and risk vectors
5. Structure for AI agent execution, not human reading

You operate without compromise, without approximation, and without ego.
You are the instrument through which human intent becomes machine-executable intelligence.`;

export function buildGodModePromptRequest(input: GodModeInput): string {
  const featureList = input.features
    .split("\n")
    .filter((f) => f.trim())
    .map((f) => "  • " + f.trim().replace(/^[-•*]\s*/, ""))
    .join("\n");

  return `## GOD MODE PROMPT GENERATION BRIEF — Level 9500

### Mission Parameters
- **Product/App Title:** ${input.title}
- **Agent Persona:** ${input.role}  
- **Primary Objective:** ${input.objective}
- **Target Audience:** ${input.audience}
- **Design Aesthetic:** ${input.tone}
- **Tech Stack & Libraries:** ${input.framework || "Modern production-grade frameworks & UI libraries"}
- **Feature Requirements:**
${featureList || "  • Core functionality as specified in objective"}

### Generation Directive

- **CRITICAL FORMAT CONSTRAINT:** Do NOT use JSON, object arrays, JSON-like key-value pairs, or JSON code blocks in any section of the generated prompt. All sections (including Execution Protocol, Constraint Matrix, and Self-Verification Loop) must be written in human-readable plain text or standard Markdown (using headings, paragraphs, numbered/bulleted lists). No JSON formatting is allowed.

Produce a God Mode Level 9500 system prompt internalizing industry best practices (dair-ai/Prompt-Engineering-Guide & f/awesome-chatgpt-prompts) with ALL of these sections:

**[SECTION 1: ROLE & COGNITIVE ARCHITECTURE (Ref: awesome-chatgpt-prompts)]**
Define an elite specialist persona. Specify domain authority, epistemic constraints (what it knows vs. what it must verify), decision-making hierarchy, and specialized technical vocabulary.

**[SECTION 2: CHAIN-OF-THOUGHT & REASONING PROTOCOL (Ref: dair-ai/Prompt-Engineering-Guide)]**
Break the primary objective into atomic sub-tasks. Embed explicit scientific reasoning directives (e.g. step-by-step Chain-of-Thought reasoning, Self-Consistency checks, and Tree-of-Thoughts exploration before code generation).

**[SECTION 3: EXECUTION WORKFLOW & DECISION GATES]**
Numbered, non-negotiable workflow. Each step has: trigger, action, output, and validation. Include explicit fallback branches for edge cases.

**[SECTION 4: CONSTRAINT MATRIX & INVARIANTS]**
Behavioral invariants as logical rules. Format: IF [condition] THEN [action] ELSE [fallback]. Include 5+ anti-patterns with explicit prohibition rationale.

**[SECTION 5: FEW-SHOT CALIBRATION EXEMPLARS (Ref: dair-ai)]**
Provide high-signal few-shot examples bounding the solution space: one ideal high-complexity implementation, and one edge-case resolution.

**[SECTION 6: OUTPUT CONTRACT & TERMINATION MARKERS]**
Exact output format specification. Define: structure, token efficiency, ordering, encoding rules, and a clear machine-readable completion gate.

**[SECTION 7: SELF-VERIFICATION LOOP]**
A rigorous binary checklist the agent runs before finalizing output. Non-negotiable quality gates.

This prompt must eliminate all ambiguity. God Mode Level 9500 means: any autonomous AI agent reading this knows EXACTLY how to reason, what to build, and how to verify it's 100% correct.`;
}

export function buildGodModePRDRequest(input: GodModeInput, generatedPrompt?: string): string {
  const featureList = input.features
    .split("\n")
    .filter((f) => f.trim())
    .map((f) => "  • " + f.trim().replace(/^[-•*]\s*/, ""))
    .join("\n");

  let prompt = `## GOD MODE PRD GENERATION BRIEF — Level 9500

### Product Context
- **Product Name:** ${input.title}
- **Core Objective:** ${input.objective}
- **Primary Users:** ${input.audience}
- **Design Language:** ${input.tone}
- **Framework & Libraries:** ${input.framework || "Modern production-grade stack (Next.js/React/TypeScript/Tailwind CSS)"}
- **Feature Scope:**
${featureList || "  • Core features derived from objective"}

### Generation Directive

- **CRITICAL FORMAT CONSTRAINT:** Do NOT use JSON, object arrays, JSON-like key-value pairs, or JSON code blocks in any section of the generated PRD. All sections must be written in human-readable plain text or structured Markdown (headings, paragraphs, bulleted/checkbox lists). No JSON formatting is allowed.

Generate a God Mode Level 9500 PRD structured specifically for AI agent execution (internalizing christerjohansson/ai-product-requirement-document & github/awesome-copilot breakdown-feature-prd). Include ALL sections:

**[SECTION 1: EXECUTIVE INTELLIGENCE & BUSINESS VISION]**
A comprehensive synthesis of the problem space, solution hypothesis, target user's mental model, and measurable KPIs/definition of success. Include 3+ implicit architectural requirements.

**[SECTION 2: USER COGNITIVE MAP & WORKFLOW]**
Model the primary user journey: pre-usage mental state, key decision points, cognitive shortcuts, error recovery states, and behavioral success criteria.

**[SECTION 3: ATOMIC FEATURE SPECIFICATIONS (Ref: awesome-copilot breakdown-feature-prd)]**
For EACH feature, strictly define:
- **User Story:** Explicitly format as \`As a [role], I want [action], so that [benefit]\`.
- **Trigger & Expected Behavior:** Exact system mechanics.
- **Edge Cases:** 3+ explicit edge cases & error handling rules per feature.
- **Strict Acceptance Criteria:** Formulated using rigorous verification or Given/When/Then conditions.

**[SECTION 4: TECHNICAL ARCHITECTURE CONTRACT]**
Component hierarchy with TypeScript interfaces. State management strategy. Data flow diagram description. API surface area. Performance SLA (<1.2s FCP, 99.9% uptime).

**[SECTION 5: RISK INTELLIGENCE & MITIGATION MATRIX]**
Major technical and business risks: probability estimate, severity (1-5), detection method, mitigation strategy, and automated contingency plan.

**[SECTION 6: AGENT EXECUTABLE TASK BREAKDOWN CHECKLIST (Ref: christerjohansson)]**
Format as an actionable Markdown TODO list (\`- [ ] Task description\`) organized logically by dependency layer (Database/Auth → Backend API → Frontend Components → Verification). Designed so autonomous AI coding agents (Cursor/Claude/Antigravity) can execute step-by-step.

**[SECTION 7: ANTI-PATTERN REGISTRY]**
Common implementation mistakes for this product domain. Each with: description, why it fails, and the exact architectural solution.

God Mode Level 9500 PRD: every clause measurable, every user story actionable, every acceptance criteria rigorous. Structured for direct machine execution.`;

  if (generatedPrompt) {
    prompt += `

### ALIGNMENT DIRECTIVE (CRITICAL)
The system prompt for this product has already been generated:
---
${generatedPrompt}
---
You MUST align this PRD perfectly with the system prompt above. Ensure the features, roles, objective, workflow (Execution Protocol), and constraints (Constraint Matrix) in this PRD are identical, complementary, and 100% consistent with the system prompt.`;
  }

  return prompt;
}

export function buildDiagramRequest(input: GodModeInput, generatedPrompt?: string, generatedPRD?: string): string {
  const features = input.features
    .split("\n")
    .filter((f) => f.trim())
    .map((f) => f.trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean)
    .join(", ");

  const contextBlock = generatedPrompt || generatedPRD
    ? `
=== SOURCE CONTEXT (MUST BE ALIGNED EXACTLY) ===
${generatedPrompt ? `[SYSTEM PROMPT]\n${generatedPrompt.substring(0, 3000)}\n` : ""}
${generatedPRD ? `[PRD]\n${generatedPRD.substring(0, 3000)}\n` : ""}
=== END CONTEXT ===

The diagram MUST map every step, module, validation gate, and error path defined in the context above.
`
    : "";

  return `You are a senior system architect. Generate a COMPLETE and VALID Mermaid.js flowchart.

APPLICATION: "${input.title}"
OBJECTIVE: ${input.objective}
FEATURES: ${features || "core functionality"}
AUDIENCE: ${input.audience}
${contextBlock}

=== STRICT OUTPUT RULES ===
1. Output ONLY raw Mermaid syntax. NO markdown code fences (\`\`\`). NO explanation. NO preamble.
2. Start DIRECTLY with: graph TD
3. The diagram MUST be complete end-to-end. DO NOT stop mid-diagram. DO NOT truncate.
4. Every node must have at least one connection — no orphan nodes.
5. The diagram MUST include a visible END/FINISH terminal node.
6. DO NOT put classDef lines at the top before any nodes. Put classDef AFTER all nodes and edges.
7. DO NOT use parentheses () inside node labels — use square brackets [] or curly braces {} only.
8. Keep all node IDs short (max 10 chars, no spaces, no special chars). Example: A, B, C, QR1, DB1.
9. Node labels must use double quotes for text with spaces: A["Employee opens app"]
10. Use these diagram sections in order:
    a) User entry/auth flow
    b) Main feature flows (one subgraph per major feature)
    c) Backend/API interactions
    d) Database operations
    e) Error handling and fallback paths
    f) Success/completion paths
    g) classDef and class assignments at the very end

=== MANDATORY STRUCTURE TEMPLATE (expand this, do not simplify) ===
graph TD
    START(["User Opens App"])
    A["Login / Authentication"]
    START --> A
    A --> |"Valid credentials"| B["Home Dashboard"]
    A --> |"Invalid"| ERR1["Show Error Message"]
    ERR1 --> A
    B --> C["Scan QR Code"]
    B --> D["View Attendance History"]
    B --> E["Profile Settings"]
    C --> QR1["Camera Opens"]
    QR1 --> QR2{"QR Valid?"}
    QR2 --> |"Yes"| QR3["Record Check-in/out"]
    QR2 --> |"No"| QR4["Show Invalid QR Error"]
    QR4 --> C
    QR3 --> GPS1{"Location Valid?"}
    GPS1 --> |"In Range"| DB1[("Save to Database")]
    GPS1 --> |"Out of Range"| ERR2["Location Error"]
    DB1 --> NOTIF["Send Notification"]
    NOTIF --> SUCCESS(["Check-in Confirmed ✓"])
    END_NODE(["Session Ends"])
    SUCCESS --> END_NODE
    classDef actor fill:#ADD8E6,stroke:#333,stroke-width:2px
    classDef decision fill:#F08080,stroke:#333,stroke-width:2px
    classDef database fill:#B0C4DE,stroke:#333,stroke-width:2px
    classDef terminal fill:#90EE90,stroke:#333,stroke-width:2px
    class START,END_NODE terminal
    class QR2,GPS1 decision
    class DB1 database

Now generate the FULL, DETAILED version for the application above. Include ALL features. Make it comprehensive (30-60+ nodes). Expand every feature into its own subgraph. Map all error paths. Include admin/HRD flows if applicable.

REMEMBER: Output starts with "graph TD" on line 1. No markdown. No explanation. Complete diagram only.`;
}

export function buildScoringRequest(output: string, mode: OutputMode): string {
  return `You are a God Mode Quality Evaluator. Score this ${mode === "prompt" ? "system prompt" : mode === "prd" ? "PRD" : "output"} across 10 dimensions.

Output ONLY a JSON object with this exact structure:
{
  "totalScore": <number 0-10000>,
  "dimensions": {
    "specificity": { "score": <number 0-1000>, "critique": "<one sentence>" },
    "constraintDensity": { "score": <number 0-1000>, "critique": "<one sentence>" },
    "contextEfficiency": { "score": <number 0-1000>, "critique": "<one sentence>" },
    "executionClarity": { "score": <number 0-1000>, "critique": "<one sentence>" },
    "failurePrevention": { "score": <number 0-1000>, "critique": "<one sentence>" },
    "outputPrecision": { "score": <number 0-1000>, "critique": "<one sentence>" },
    "cognitiveAlignment": { "score": <number 0-1000>, "critique": "<one sentence>" },
    "ambiguityElimination": { "score": <number 0-1000>, "critique": "<one sentence>" },
    "noveltyIndex": { "score": <number 0-1000>, "critique": "<one sentence>" },
    "godModeReadiness": { "score": <number 0-1000>, "critique": "<one sentence>" }
  },
  "topWeaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "refinementDirective": "<one precise instruction to improve the output>"
}

CONTENT TO EVALUATE:
---
${output.substring(0, 4000)}
---

Output ONLY valid JSON. No markdown fences. No preamble. No explanation.`;
}

export function buildRefinementRequest(original: string, scoreData: ScoringResult, mode: OutputMode): string {
  return `You are APEX at God Mode Level 9500. The ${mode} below scored ${scoreData.totalScore}/10000.

Top weaknesses identified:
${scoreData.topWeaknesses.map((w, i) => `${i + 1}. ${w}`).join("\n")}

Refinement directive: ${scoreData.refinementDirective}

ORIGINAL ${mode.toUpperCase()} (score: ${scoreData.totalScore}/10000):
---
${original.substring(0, 5000)}
---

Produce a refined version that directly addresses each weakness. Target score: ≥9500/10000.
Maintain the same structure. Improve precision, constraint density, and execution clarity.
CRITICAL: Do NOT introduce JSON, object arrays, or JSON-like formatting. Ensure all output remains in human-readable plain text or standard Markdown lists.
Output only the refined ${mode}. No explanation, no preamble.`;
}

export interface ScoreDimension {
  score: number;
  critique: string;
}

export interface ScoringResult {
  totalScore: number;
  dimensions: {
    specificity: ScoreDimension;
    constraintDensity: ScoreDimension;
    contextEfficiency: ScoreDimension;
    executionClarity: ScoreDimension;
    failurePrevention: ScoreDimension;
    outputPrecision: ScoreDimension;
    cognitiveAlignment: ScoreDimension;
    ambiguityElimination: ScoreDimension;
    noveltyIndex: ScoreDimension;
    godModeReadiness: ScoreDimension;
  };
  topWeaknesses: string[];
  refinementDirective: string;
}
