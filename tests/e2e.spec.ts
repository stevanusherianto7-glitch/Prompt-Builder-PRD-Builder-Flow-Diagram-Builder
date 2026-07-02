import { test, expect } from "@playwright/test";

test.describe("God Mode 9500 E2E Playwright Suite", () => {
  test("should load main builder UI and display tabs", async ({ page }) => {
    await page.goto("http://localhost:5175/");
    await expect(page).toHaveTitle(/SaaS Full Stack App|PromptOps|Figma/i);

    // Verify Prompt Builder tab is visible
    const promptTab = page.locator("button", { hasText: "Prompt Builder" });
    await expect(promptTab).toBeVisible();

    // Verify PRD Builder tab is visible
    const prdTab = page.locator("button", { hasText: "PRD Builder" });
    await expect(prdTab).toBeVisible();

    // Verify Flow Diagram tab is visible
    const diagramTab = page.locator("button", { hasText: "Flow Diagram" });
    await expect(diagramTab).toBeVisible();

    // Verify Auto-Fill button is present inside Idea box
    const autoFillBtn = page.locator("button", { hasText: "Auto-Fill Fields with AI" });
    await expect(autoFillBtn).toBeVisible();
  });
});
