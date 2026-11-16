import { describe, expect, it } from "vitest";
import type { Scenario } from "../types";

// Checks every scenario file in this folder against the rules the study
// materials must obey. Run with: npx vitest run src/data/scenarios
const modules = import.meta.glob<{ scenario: Scenario }>("./*-*-[0-9].ts", { eager: true });
const scenarios = Object.entries(modules).map(([path, module]) => ({
  path,
  scenario: module.scenario,
}));

const MIN_WORDS = 1050;
const MAX_WORDS = 1500;
const EXPECTED_PAGES = 6;
const MIN_CLAIM_WORDS = 12;
const MAX_CLAIM_WORDS = 32;

// Phrases that would hand participants the decision without checking a claim.
const VERDICT_PHRASES = [
  "we recommend",
  "is recommended",
  "recommends",
  "our recommendation",
  "not ready",
  "not safe",
  "should not be",
  "do not approve",
  "has not approved",
  "was approved",
  "approved for",
  "approved the",
  "ready to ship",
  "ready for production",
  "safe to deploy",
  "safe for production",
  "block approval",
  "blocks approval",
  "blocking",
  "dealbreaker",
  "must not",
  "we advise",
  "conclusion",
];

function bodies(scenario: Scenario): string[] {
  return scenario.document.pages.flatMap((page) => page.sections.map((s) => s.body));
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function occurrences(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

describe("study materials", () => {
  it("finds at least one scenario file", () => {
    expect(scenarios.length).toBeGreaterThan(0);
  });

  describe.each(scenarios)("$path", ({ path, scenario }) => {
    const text = bodies(scenario).join("\n");

    it("has an id that matches its file name and document", () => {
      expect(path).toBe(`./${scenario.id}.ts`);
      expect(scenario.document.id).toBe(scenario.id);
      expect(scenario.id).toMatch(new RegExp(`^${scenario.domain}-(incorrect|correct)-[12]$`));
    });

    it("has a trial type consistent with its id and correct answer", () => {
      const expectIncorrect = scenario.id.includes("-incorrect-");
      expect(scenario.trial_type).toBe(expectIncorrect ? "AI-Incorrect" : "AI-Correct");
      expect(scenario.correct_answer).toBe(expectIncorrect ? "No" : "Yes");
    });

    it("has three summary blocks b1-b3 and a valid key block", () => {
      expect(scenario.ai_summary_blocks.map((b) => b.id)).toEqual(["b1", "b2", "b3"]);
      expect(["b1", "b2", "b3"]).toContain(scenario.key_block_id);
    });

    it("has six consecutively numbered pages", () => {
      expect(scenario.document.pages.map((p) => p.pageNum)).toEqual(
        Array.from({ length: EXPECTED_PAGES }, (_, i) => i + 1)
      );
    });

    it("stays within the agreed length", () => {
      const words = wordCount(text);
      expect(words).toBeGreaterThanOrEqual(MIN_WORDS);
      expect(words).toBeLessThanOrEqual(MAX_WORDS);
    });

    it.each(scenario.ai_summary_blocks)("cites block $id verbatim, once, on the stated page", (block) => {
      const page = scenario.document.pages.find((p) => p.pageNum === block.citation.page_num);
      expect(page, "cited page exists").toBeDefined();
      const onPage = page!.sections.filter((s) => s.body.includes(block.citation.exact_text));
      expect(onPage.length, "exact_text sits inside one section body on that page").toBe(1);
      expect(occurrences(text, block.citation.exact_text), "exact_text is unique in the document").toBe(1);
      expect(block.label).toMatch(new RegExp(`p\\. ${block.citation.page_num}$`));
    });

    it("cites three different passages and never quotes them in the claim", () => {
      const cited = scenario.ai_summary_blocks.map((b) => b.citation.exact_text);
      expect(new Set(cited).size).toBe(3);
      for (const block of scenario.ai_summary_blocks) {
        expect(block.text).not.toBe(block.citation.exact_text);
        const words = wordCount(block.text);
        expect(words).toBeGreaterThanOrEqual(MIN_CLAIM_WORDS);
        expect(words).toBeLessThanOrEqual(MAX_CLAIM_WORDS);
      }
    });

    it("does not put the key passage on pages 1, 2 or 6", () => {
      const key = scenario.ai_summary_blocks.find((b) => b.id === scenario.key_block_id)!;
      expect([3, 4, 5]).toContain(key.citation.page_num);
    });

    it("contains no verdict phrase that gives the decision away", () => {
      const lowered = text.toLowerCase();
      const found = VERDICT_PHRASES.filter((phrase) => lowered.includes(phrase));
      expect(found).toEqual([]);
    });

    it("states on page 1 that the report makes no recommendation", () => {
      const pageOne = scenario.document.pages[0].sections.map((s) => s.body).join(" ");
      expect(pageOne).toContain("presents findings only");
    });
  });
});
