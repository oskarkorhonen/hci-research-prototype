import type { BlockId, Scenario } from "../types";
import { scenario as libraryCorrect1 } from "./library-correct-1";
import { scenario as libraryCorrect2 } from "./library-correct-2";
import { scenario as libraryIncorrect1 } from "./library-incorrect-1";
import { scenario as libraryIncorrect2 } from "./library-incorrect-2";
import { scenario as modelCorrect1 } from "./model-correct-1";
import { scenario as modelCorrect2 } from "./model-correct-2";
import { scenario as modelIncorrect1 } from "./model-incorrect-1";
import { scenario as modelIncorrect2 } from "./model-incorrect-2";
import { scenario as postmortemCorrect1 } from "./postmortem-correct-1";
import { scenario as postmortemCorrect2 } from "./postmortem-correct-2";
import { scenario as postmortemIncorrect1 } from "./postmortem-incorrect-1";
import { scenario as postmortemIncorrect2 } from "./postmortem-incorrect-2";

export const SCENARIOS: readonly Scenario[] = [
  libraryIncorrect1,
  libraryCorrect1,
  libraryIncorrect2,
  libraryCorrect2,
  modelIncorrect1,
  modelCorrect1,
  modelIncorrect2,
  modelCorrect2,
  postmortemIncorrect1,
  postmortemCorrect1,
  postmortemIncorrect2,
  postmortemCorrect2,
];

const SCENARIOS_BY_ID = new Map(SCENARIOS.map((scenario) => [scenario.id, scenario]));

export function getScenarioById(scenarioId: string): Scenario {
  const scenario = SCENARIOS_BY_ID.get(scenarioId);
  if (!scenario) {
    throw new Error(`Unknown scenario id: ${scenarioId}`);
  }
  return scenario;
}

const BLOCK_POSITIONS: Record<BlockId, number> = { b1: 1, b2: 2, b3: 3 };

export function keyBlockPosition(scenario: Scenario): number {
  return BLOCK_POSITIONS[scenario.key_block_id];
}
