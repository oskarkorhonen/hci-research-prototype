import { describe, expect, it } from "vitest";
import { DOCUMENT_SETS, SET_IDS, TRIAL_COUNT } from "../../study/design";
import { SCENARIOS, getScenarioById, keyBlockPosition } from "./index";

const POSITIONS = [1, 2, 3];

function countByPosition(trialType: string): number[] {
  const matching = SCENARIOS.filter((scenario) => scenario.trial_type === trialType);
  return POSITIONS.map((p) => matching.filter((s) => keyBlockPosition(s) === p).length);
}

describe("the twelve scenarios as a set", () => {
  it("has twelve scenarios, half of each trial type", () => {
    expect(SCENARIOS).toHaveLength(TRIAL_COUNT);
    expect(SCENARIOS.filter((s) => s.trial_type === "AI-Incorrect")).toHaveLength(6);
  });

  it("puts the key claim first, second and third equally often in both trial types", () => {
    expect(countByPosition("AI-Incorrect")).toEqual([2, 2, 2]);
    expect(countByPosition("AI-Correct")).toEqual([2, 2, 2]);
  });

  it("puts the key passage on page 4 and page 5 equally often in both trial types", () => {
    for (const trialType of ["AI-Incorrect", "AI-Correct"]) {
      const pages = SCENARIOS.filter((s) => s.trial_type === trialType).map(
        (s) => s.ai_summary_blocks.find((b) => b.id === s.key_block_id)!.citation.page_num
      );
      expect(pages.filter((p) => p === 4)).toHaveLength(3);
      expect(pages.filter((p) => p === 5)).toHaveLength(3);
    }
  });

  it("uses each domain four times", () => {
    for (const domain of ["library", "model", "postmortem"]) {
      expect(SCENARIOS.filter((s) => s.domain === domain)).toHaveLength(4);
    }
  });

  it("resolves every scenario named in a document set", () => {
    for (const id of SET_IDS) {
      for (const scenarioId of [...DOCUMENT_SETS[id].incorrect, ...DOCUMENT_SETS[id].correct]) {
        expect(getScenarioById(scenarioId).id).toBe(scenarioId);
      }
    }
  });

  it("does not let the key position reveal the trial type within a set", () => {
    for (const id of SET_IDS) {
      const incorrect = DOCUMENT_SETS[id].incorrect.map((s) => keyBlockPosition(getScenarioById(s)));
      expect(new Set(incorrect).size).toBe(2);
    }
  });

  it("rejects an unknown scenario id", () => {
    expect(() => getScenarioById("nope")).toThrow("Unknown scenario id");
  });
});
