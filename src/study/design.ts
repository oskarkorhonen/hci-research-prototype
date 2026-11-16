import type { TrialType } from "../data/types";

// The experimental design as pure functions, so the counterbalancing can be
// unit-tested and reproduced in the analysis from the participant number alone.

export const CONDITIONS = ["Baseline", "Voluntary", "Forced"] as const;
export type Condition = (typeof CONDITIONS)[number];

export const SET_IDS = ["A", "B", "C"] as const;
export type SetId = (typeof SET_IDS)[number];

const CONDITION_BY_LETTER: Record<string, Condition> = {
  A: "Baseline",
  B: "Voluntary",
  C: "Forced",
};

// All six orders of the three interfaces. Participant n gets order (n-1) mod 6.
export const CONDITION_ORDERS = ["ABC", "ACB", "BAC", "BCA", "CAB", "CBA"] as const;

export interface DocumentSet {
  incorrect: readonly [string, string];
  correct: readonly [string, string];
}

// Three sets of four reports, each with two AI-Incorrect and two AI-Correct
// trials and a mix of the three domains. Which set goes with which interface
// rotates between participants, so no report is tied to an interface.
export const DOCUMENT_SETS: Record<SetId, DocumentSet> = {
  A: {
    incorrect: ["library-incorrect-1", "postmortem-incorrect-1"],
    correct: ["model-correct-1", "library-correct-2"],
  },
  B: {
    incorrect: ["model-incorrect-1", "library-incorrect-2"],
    correct: ["postmortem-correct-1", "model-correct-2"],
  },
  C: {
    incorrect: ["postmortem-incorrect-2", "model-incorrect-2"],
    correct: ["library-correct-1", "postmortem-correct-2"],
  },
};

// The six ways to order two AI-Incorrect (I) and two AI-Correct (C) trials.
const WITHIN_BLOCK_PATTERNS = ["ICIC", "CICI", "ICCI", "CIIC", "IICC", "CCII"] as const;

export const TRIALS_PER_BLOCK = 4;
export const BLOCK_COUNT = CONDITIONS.length;
export const TRIAL_COUNT = TRIALS_PER_BLOCK * BLOCK_COUNT;
export const MIN_PARTICIPANT_NUMBER = 1;
export const MAX_PARTICIPANT_NUMBER = 99;

export interface PlannedTrial {
  trialIndex: number;
  blockIndex: number;
  withinBlockPosition: number;
  condition: Condition;
  documentSet: SetId;
  scenarioId: string;
  trialType: TrialType;
}

export interface SessionPlan {
  participantNumber: number;
  conditionOrder: string;
  setRotation: number;
  trials: PlannedTrial[];
}

export function isValidParticipantNumber(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= MIN_PARTICIPANT_NUMBER &&
    value <= MAX_PARTICIPANT_NUMBER
  );
}

function participantIndex(participantNumber: number): number {
  if (!isValidParticipantNumber(participantNumber)) {
    throw new RangeError(
      `Participant number must be a whole number from ${MIN_PARTICIPANT_NUMBER} to ${MAX_PARTICIPANT_NUMBER}, got ${participantNumber}`
    );
  }
  return participantNumber - 1;
}

export function conditionOrderFor(participantNumber: number): string {
  const index = participantIndex(participantNumber);
  return CONDITION_ORDERS[index % CONDITION_ORDERS.length];
}

// Shifts by one after every six participants, so that across 18 participants
// every interface order is paired with every set rotation exactly once.
export function setRotationFor(participantNumber: number): number {
  const index = participantIndex(participantNumber);
  const cycle = Math.floor(index / CONDITION_ORDERS.length);
  return (index + cycle) % SET_IDS.length;
}

export function documentSetFor(condition: Condition, setRotation: number): SetId {
  return SET_IDS[(CONDITIONS.indexOf(condition) + setRotation) % SET_IDS.length];
}

interface OrderedTrial {
  scenarioId: string;
  trialType: TrialType;
}

function orderWithinBlock(set: DocumentSet, index: number, blockIndex: number): OrderedTrial[] {
  const pattern = WITHIN_BLOCK_PATTERNS[(index + 2 * blockIndex) % WITHIN_BLOCK_PATTERNS.length];
  const swapIncorrect = (index + blockIndex) % 2 === 1;
  const swapCorrect = (Math.floor(index / 2) + blockIndex) % 2 === 1;
  const incorrect = swapIncorrect ? [set.incorrect[1], set.incorrect[0]] : [...set.incorrect];
  const correct = swapCorrect ? [set.correct[1], set.correct[0]] : [...set.correct];

  let nextIncorrect = 0;
  let nextCorrect = 0;
  return pattern.split("").map((slot): OrderedTrial => {
    if (slot === "I") {
      return { scenarioId: incorrect[nextIncorrect++], trialType: "AI-Incorrect" };
    }
    return { scenarioId: correct[nextCorrect++], trialType: "AI-Correct" };
  });
}

export function buildSessionPlan(participantNumber: number): SessionPlan {
  const index = participantIndex(participantNumber);
  const conditionOrder = conditionOrderFor(participantNumber);
  const setRotation = setRotationFor(participantNumber);

  const trials = conditionOrder.split("").flatMap((letter, blockIndex) => {
    const condition = CONDITION_BY_LETTER[letter];
    const documentSet = documentSetFor(condition, setRotation);
    return orderWithinBlock(DOCUMENT_SETS[documentSet], index, blockIndex).map(
      (ordered, position): PlannedTrial => ({
        trialIndex: blockIndex * TRIALS_PER_BLOCK + position + 1,
        blockIndex: blockIndex + 1,
        withinBlockPosition: position + 1,
        condition,
        documentSet,
        scenarioId: ordered.scenarioId,
        trialType: ordered.trialType,
      })
    );
  });

  return { participantNumber, conditionOrder, setRotation, trials };
}

// Participant-facing names. Neutral on purpose: naming an interface "Forced"
// would reveal the manipulation and bias the ratings.
export const INTERFACE_LABELS: Record<Condition, string> = {
  Baseline: "Interface 1",
  Voluntary: "Interface 2",
  Forced: "Interface 3",
};
