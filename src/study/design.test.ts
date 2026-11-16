import { describe, expect, it } from "vitest";
import {
  CONDITIONS,
  CONDITION_ORDERS,
  DOCUMENT_SETS,
  SET_IDS,
  TRIAL_COUNT,
  buildSessionPlan,
  conditionOrderFor,
  documentSetFor,
  setRotationFor,
} from "./design";

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

const allScenarioIds = SET_IDS.flatMap((id) => [
  ...DOCUMENT_SETS[id].incorrect,
  ...DOCUMENT_SETS[id].correct,
]);

describe("document sets", () => {
  it("use twelve different reports", () => {
    expect(new Set(allScenarioIds).size).toBe(TRIAL_COUNT);
  });

  it("put AI-Incorrect and AI-Correct reports in the matching slots", () => {
    for (const id of SET_IDS) {
      expect(DOCUMENT_SETS[id].incorrect.every((s) => s.includes("-incorrect-"))).toBe(true);
      expect(DOCUMENT_SETS[id].correct.every((s) => s.includes("-correct-"))).toBe(true);
    }
  });

  it("mix at least three domains into every set", () => {
    for (const id of SET_IDS) {
      const all = [...DOCUMENT_SETS[id].incorrect, ...DOCUMENT_SETS[id].correct];
      expect(new Set(all.map((s) => s.split("-")[0])).size).toBe(3);
    }
  });
});

describe("session plan for one participant", () => {
  it.each(range(1, 24))("participant %i sees every report exactly once", (n) => {
    const ids = buildSessionPlan(n).trials.map((t) => t.scenarioId);
    expect(ids).toHaveLength(TRIAL_COUNT);
    expect(new Set(ids)).toEqual(new Set(allScenarioIds));
  });

  it.each(range(1, 24))("participant %i gets one block per interface, 2 + 2 trials each", (n) => {
    const { trials } = buildSessionPlan(n);
    for (const block of [1, 2, 3]) {
      const inBlock = trials.filter((t) => t.blockIndex === block);
      expect(inBlock).toHaveLength(4);
      expect(new Set(inBlock.map((t) => t.condition)).size).toBe(1);
      expect(new Set(inBlock.map((t) => t.documentSet)).size).toBe(1);
      expect(inBlock.filter((t) => t.trialType === "AI-Incorrect")).toHaveLength(2);
      expect(inBlock.map((t) => t.withinBlockPosition)).toEqual([1, 2, 3, 4]);
    }
    expect(new Set(trials.map((t) => t.condition))).toEqual(new Set(CONDITIONS));
    expect(trials.map((t) => t.trialIndex)).toEqual(range(1, TRIAL_COUNT));
  });

  it("labels each trial with the type its scenario id carries", () => {
    for (const trial of buildSessionPlan(5).trials) {
      const expected = trial.scenarioId.includes("-incorrect-") ? "AI-Incorrect" : "AI-Correct";
      expect(trial.trialType).toBe(expected);
    }
  });

  it("is deterministic", () => {
    expect(buildSessionPlan(7)).toEqual(buildSessionPlan(7));
  });

  it.each([0, -1, 1.5, 100, Number.NaN])("rejects participant number %s", (bad) => {
    expect(() => buildSessionPlan(bad)).toThrow(RangeError);
  });
});

describe("counterbalancing across participants", () => {
  it("uses each interface order once among the first six", () => {
    expect(new Set(range(1, 6).map(conditionOrderFor))).toEqual(new Set(CONDITION_ORDERS));
  });

  it("pairs every interface order with every set rotation once across 18", () => {
    const cells = range(1, 18).map((n) => `${conditionOrderFor(n)}-${setRotationFor(n)}`);
    expect(new Set(cells).size).toBe(18);
  });

  it("gives each interface each document set three times across the first nine", () => {
    for (const condition of CONDITIONS) {
      const sets = range(1, 9).map((n) => documentSetFor(condition, setRotationFor(n)));
      for (const id of SET_IDS) {
        expect(sets.filter((s) => s === id)).toHaveLength(3);
      }
    }
  });

  it("keeps set use within one of even for ten participants", () => {
    for (const condition of CONDITIONS) {
      const sets = range(1, 10).map((n) => documentSetFor(condition, setRotationFor(n)));
      for (const id of SET_IDS) {
        const count = sets.filter((s) => s === id).length;
        expect(count).toBeGreaterThanOrEqual(3);
        expect(count).toBeLessThanOrEqual(4);
      }
    }
  });

  it("starts blocks with an AI-Incorrect trial about half the time", () => {
    const firstTrials = range(1, 12).flatMap((n) =>
      buildSessionPlan(n).trials.filter((t) => t.withinBlockPosition === 1)
    );
    const share =
      firstTrials.filter((t) => t.trialType === "AI-Incorrect").length / firstTrials.length;
    expect(share).toBeGreaterThanOrEqual(0.4);
    expect(share).toBeLessThanOrEqual(0.6);
  });
});
