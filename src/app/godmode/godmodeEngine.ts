export type OutputMode = "prompt" | "prd" | "diagram" | "agent";

export interface GodModeInput {
  title: string;
  role: string;
  objective: string;
  audience: string;
  tone: string;
  features: string;
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
- **Feature Requirements:**
${featureList || "  • Core functionality as specified in objective"}

### Generation Directive

- **CRITICAL FORMAT CONSTRAINT:** Do NOT use JSON, object arrays, JSON-like key-value pairs, or JSON code blocks in any section of the generated prompt. All sections (including Execution Protocol, Constraint Matrix, and Self-Verification Loop) must be written in human-readable plain text or standard Markdown (using headings, paragraphs, numbered/bulleted lists). No JSON formatting is allowed.

Produce a God Mode Level 9500 system prompt with ALL of these sections:

**[SECTION 1: ROLE & COGNITIVE PROFILE]**
Define the agent with calibrated expertise. Specify the exact mental models it must apply, its epistemic constraints (what it knows vs. what it must not guess), and its decision-making hierarchy when requirements conflict.

**[SECTION 2: OBJECTIVE DECOMPOSITION]**
Break the primary objective into atomic sub-tasks. Map sequential dependencies explicitly. Define entry criteria for each phase and exit validation gates.

**[SECTION 3: EXECUTION PROTOCOL]**
Numbered, non-negotiable workflow. Each step has: trigger, action, output, and validation. Include decision branches for edge cases.

**[SECTION 4: CONSTRAINT MATRIX]**
Behavioral invariants as logical rules. Format: IF [condition] THEN [action] ELSE [fallback]. Include 5+ anti-patterns with explicit prohibition rationale.

**[SECTION 5: OUTPUT CONTRACT]**
Exact output format specification. Define: structure, token budget per section, ordering, encoding rules, and a machine-readable termination marker.

**[SECTION 6: CALIBRATION EXAMPLES]**
Two minimal examples bounding the solution space: one ideal case, one edge case. Each with annotated reasoning.

**[SECTION 7: SELF-VERIFICATION LOOP]**
A checklist the agent runs before finalizing output. Binary pass/fail criteria. Non-negotiable gates.

This prompt must eliminate all ambiguity. God Mode Level 9500 means: any AI model reading this knows EXACTLY what to build, how to build it, and how to verify it's correct.`;
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
- **Feature Scope:**
${featureList || "  • Core features derived from objective"}

### Generation Directive

- **CRITICAL FORMAT CONSTRAINT:** Do NOT use JSON, object arrays, JSON-like key-value pairs, or JSON code blocks in any section of the generated PRD. All sections (including Atomic Feature Specifications, Technical Architecture Contract, and Risk Intelligence Matrix) must be written in human-readable plain text or standard Markdown (using headings, paragraphs, numbered/bulleted lists). No JSON formatting is allowed.

Generate a God Mode Level 9500 PRD structured for AI agent execution. Include ALL sections:

**[SECTION 1: EXECUTIVE INTELLIGENCE]**
A single paragraph synthesizing: problem space, solution hypothesis, target user's mental model, and measurable definition of success. Include 3+ implicit requirements the brief doesn't state but any expert would include.

**[SECTION 2: USER COGNITIVE MAP]**
Model the primary user's workflow: pre-usage mental state, key decision points, cognitive shortcuts used, failure states that cause abandonment, and behavioral signals indicating success.

**[SECTION 3: ATOMIC FEATURE SPECIFICATIONS]**
For EACH feature: trigger condition, expected behavior, 3+ edge cases per feature, performance SLA (latency, error rate), and binary acceptance test.

**[SECTION 4: TECHNICAL ARCHITECTURE CONTRACT]**
Component hierarchy with TypeScript interfaces. State management strategy. Data flow diagram (text). API surface area. Error handling protocol. Performance budget.

**[SECTION 5: RISK INTELLIGENCE MATRIX]**
For each major risk: probability estimate, severity (1-5), detection method, mitigation strategy, and contingency plan.

**[SECTION 6: AGENT EXECUTION CHECKLIST]**
Sequential, verifiable checklist an AI agent uses to confirm requirements are met before delivery. Every item must be binary (pass/fail).

**[SECTION 7: ANTI-PATTERN REGISTRY]**
Common implementation mistakes for this type of product. Each with: description, why it fails, and the correct approach.

God Mode Level 9500 PRD: every clause measurable, every requirement binary, every ambiguity eliminated. Structure for machine execution, not human approval.`;

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
    "noveltyIndex": { "score": <number 0-500>, "critique": "<one sentence>" },
    "godModeReadiness": { "score": <number 0-500>, "critique": "<one sentence>" }
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
