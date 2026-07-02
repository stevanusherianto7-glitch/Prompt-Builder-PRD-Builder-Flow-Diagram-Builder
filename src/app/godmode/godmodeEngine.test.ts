import { describe, it, expect } from "vitest";
import { buildGodModePromptRequest, buildGodModePRDRequest, GodModeInput } from "./godmodeEngine";

describe("God Mode Engine - Prompt & PRD Builder", () => {
  const sampleInput: GodModeInput = {
    title: "Resto QR Attendance",
    role: "Senior Full-Stack Architect",
    objective: "Streamline attendance tracking with secure QR verification",
    audience: "Restaurant managers and staff",
    tone: "Modern dark aesthetic",
    features: "QR verification\nGPS Geofencing\nAdmin Dashboard",
    mode: "prompt",
  };

  it("should generate a high-precision Level 9500 prompt request", () => {
    const request = buildGodModePromptRequest(sampleInput);
    expect(request).toContain("Resto QR Attendance");
    expect(request).toContain("Senior Full-Stack Architect");
    expect(request).toContain("QR verification");
    expect(request).toContain("Level 9500");
  });

  it("should generate a comprehensive PRD request with feature list", () => {
    const request = buildGodModePRDRequest(sampleInput);
    expect(request).toContain("Resto QR Attendance");
    expect(request).toContain("Streamline attendance tracking");
    expect(request).toContain("Modern dark aesthetic");
  });
});
