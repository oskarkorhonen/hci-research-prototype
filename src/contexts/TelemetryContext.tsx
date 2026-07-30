import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CONDITION_SCENARIOS, getScenarioById, getTrialType } from "../data/scenario";
import type { TrialType } from "../data/scenario";

export interface SurveyResults {
  confidence: number;
  mental_demand: number;
  system_complexity: number;
  preference: number;
  trust: number;
}

export interface TelemetryLog {
  participant_id: string;
  sequence_order: string;
  condition_id: string;
  scenario_id: string;
  trial_type: TrialType;
  within_block_position: number;
  timestamp: string;
  time_to_decision_ms: number;
  citation_clicks_count: number;
  given_answer: string;
  correct_answer: string;
  decision_correct: boolean;
  confidence_rating: number;
  mental_demand_score: number;
  system_complexity_score: number;
  preference_score: number;
  trust_score: number;
}

// Researcher-facing condition names. These are recorded in telemetry but are
// never shown to participants — see INTERFACE_LABELS for participant-facing
// labels, which are deliberately neutral so the manipulation isn't revealed.
// A = Baseline, B = Voluntary Deep-Linking, C = Forced Verification.
export const CONDITION_NAMES: Record<string, string> = {
  "1": "Baseline",
  "2": "Voluntary",
  "3": "Forced",
};

// Participant-facing labels. Neutral placeholders only: naming a condition
// "Forced Verification" in the UI would cue participants to the hypothesis
// and bias the preference and trust ratings specifically.
export const INTERFACE_LABELS: Record<string, string> = {
  "1": "Interface 1",
  "2": "Interface 2",
  "3": "Interface 3",
};

const LETTER_TO_CONDITION: Record<string, string> = { A: "1", B: "2", C: "3" };

// Latin square of the 6 possible condition orderings, used to counterbalance
// order effects (trust carry-over) across participants in this within-subjects design.
export const LATIN_SQUARE = ["ABC", "ACB", "BAC", "BCA", "CAB", "CBA"];

export interface Trial {
  conditionId: string;
  scenarioId: string;
  // 1 or 2 — position of this trial within its condition block. Logged so
  // within-block order effects can actually be checked at analysis time.
  withinBlockPosition: number;
}

// Each condition block contains one AI-Incorrect and one AI-Accurate trial.
// The order of that pair alternates by participant-ID parity: previously the
// AI-Incorrect trial always came first, which loaded interface-learning cost
// onto the primary outcome measure and let trust depression from a caught
// hallucination bleed into the immediately following accurate trial.
function buildTrialPlan(sequence: string, numericId: number): Trial[] {
  const incorrectFirst = numericId % 2 === 1;
  return sequence
    .split("")
    .map((letter) => LETTER_TO_CONDITION[letter])
    .flatMap((conditionId) => {
      const pair = CONDITION_SCENARIOS[conditionId];
      const ordered = incorrectFirst
        ? [pair.incorrect, pair.correct]
        : [pair.correct, pair.incorrect];
      return ordered.map((scenarioId, i) => ({
        conditionId,
        scenarioId,
        withinBlockPosition: i + 1,
      }));
    });
}

interface TelemetryContextType {
  participantId: string;
  conditionId: string;
  scenarioId: string;
  sequenceOrder: string;
  sequenceLabel: string;
  interfaceLabel: string;
  trialPlan: Trial[];
  stepIndex: number;
  totalSteps: number;
  citationClicks: number;
  taskStartTime: number | null;
  logs: TelemetryLog[];
  startSession: (rawParticipantId: string) => void;
  startTask: () => void;
  endTask: () => void;
  recordCitationClick: () => void;
  submitDecision: (
    givenAnswer: string,
    correctAnswer: string,
    scenarioId: string,
    surveyResults: SurveyResults
  ) => TelemetryLog;
  advanceToNextTrial: () => boolean;
  exportCSV: () => void;
  resetSession: () => void;
  clearAllLogs: () => void;
}

const TelemetryContext = createContext<TelemetryContextType | null>(null);

const STORAGE_KEY = "hci_telemetry_logs";

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [participantId, setParticipantId] = useState("");
  const [conditionId, setConditionId] = useState("1");
  const [scenarioId, setScenarioId] = useState("");
  const [sequenceOrder, setSequenceOrder] = useState("");
  const [trialPlan, setTrialPlan] = useState<Trial[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [citationClicks, setCitationClicks] = useState(0);
  const [taskStartTime, setTaskStartTime] = useState<number | null>(null);
  const [logs, setLogs] = useState<TelemetryLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const citationClicksRef = useRef(0);
  // Held in a ref, not state, so the value is available synchronously to
  // submitDecision on the next page without an extra render.
  const taskEndTimeRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const startSession = useCallback((rawParticipantId: string) => {
    const numericId = parseInt(rawParticipantId.replace(/\D/g, ""), 10) || 0;
    const sequence = LATIN_SQUARE[numericId % LATIN_SQUARE.length];
    const plan = buildTrialPlan(sequence, numericId);

    setParticipantId(`Participant_${String(numericId).padStart(2, "0")}`);
    setSequenceOrder(sequence);
    setTrialPlan(plan);
    setStepIndex(0);
    setConditionId(plan[0].conditionId);
    setScenarioId(plan[0].scenarioId);
    setCitationClicks(0);
    citationClicksRef.current = 0;
    setTaskStartTime(null);
    taskEndTimeRef.current = null;
  }, []);

  const startTask = useCallback(() => {
    setCitationClicks(0);
    citationClicksRef.current = 0;
    taskEndTimeRef.current = null;
    setTaskStartTime(Date.now());
  }, []);

  // Called the instant the participant submits their Yes/No decision, so
  // time_to_decision_ms measures only the decision task — not the time they
  // subsequently spend filling in the post-trial questionnaire.
  const endTask = useCallback(() => {
    taskEndTimeRef.current = Date.now();
  }, []);

  const recordCitationClick = useCallback(() => {
    citationClicksRef.current += 1;
    setCitationClicks(citationClicksRef.current);
  }, []);

  const submitDecision = useCallback(
    (
      givenAnswer: string,
      correctAnswer: string,
      scenarioIdForLog: string,
      surveyResults: SurveyResults
    ): TelemetryLog => {
      const decisionTime = taskEndTimeRef.current ?? Date.now();
      const elapsed = taskStartTime ? decisionTime - taskStartTime : 0;
      const scenario = getScenarioById(scenarioIdForLog);
      const currentTrial = trialPlan[stepIndex];
      const log: TelemetryLog = {
        participant_id: participantId || "unknown",
        sequence_order: sequenceOrder,
        condition_id: CONDITION_NAMES[conditionId] ?? conditionId,
        scenario_id: scenarioIdForLog,
        trial_type: getTrialType(scenario),
        within_block_position: currentTrial?.withinBlockPosition ?? 0,
        timestamp: new Date().toISOString(),
        time_to_decision_ms: elapsed,
        citation_clicks_count: citationClicksRef.current,
        given_answer: givenAnswer,
        correct_answer: correctAnswer,
        // True when the final decision matches ground truth. On AI-Incorrect
        // trials a false value indicates overreliance; on AI-Correct trials it
        // indicates undue skepticism. Pair with trial_type to separate them.
        decision_correct:
          givenAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase(),
        confidence_rating: surveyResults.confidence,
        mental_demand_score: surveyResults.mental_demand,
        system_complexity_score: surveyResults.system_complexity,
        preference_score: surveyResults.preference,
        trust_score: surveyResults.trust,
      };
      setLogs((prev) => [...prev, log]);
      return log;
    },
    [participantId, sequenceOrder, conditionId, taskStartTime, trialPlan, stepIndex]
  );

  const advanceToNextTrial = useCallback((): boolean => {
    const nextIndex = stepIndex + 1;
    if (nextIndex >= trialPlan.length) return false;
    setStepIndex(nextIndex);
    setConditionId(trialPlan[nextIndex].conditionId);
    setScenarioId(trialPlan[nextIndex].scenarioId);
    return true;
  }, [stepIndex, trialPlan]);

  const exportCSV = useCallback(() => {
    if (logs.length === 0) {
      alert("No telemetry data to export.");
      return;
    }
    const headers = [
      "participant_id",
      "sequence_order",
      "condition_id",
      "scenario_id",
      "trial_type",
      "within_block_position",
      "timestamp",
      "time_to_decision_ms",
      "citation_clicks_count",
      "given_answer",
      "correct_answer",
      "decision_correct",
      "confidence_rating",
      "mental_demand_score",
      "system_complexity_score",
      "preference_score",
      "trust_score",
    ];
    const rows = logs.map((log) =>
      headers.map((h) => JSON.stringify((log as unknown as Record<string, unknown>)[h] ?? "")).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hci_telemetry_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [logs]);

  const resetSession = useCallback(() => {
    setCitationClicks(0);
    citationClicksRef.current = 0;
    setTaskStartTime(null);
    taskEndTimeRef.current = null;
  }, []);

  const clearAllLogs = useCallback(() => {
    setLogs([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const sequenceIndex = LATIN_SQUARE.indexOf(sequenceOrder);

  return (
    <TelemetryContext.Provider
      value={{
        participantId,
        conditionId,
        scenarioId,
        sequenceOrder,
        sequenceLabel: sequenceIndex >= 0 ? `Task Sequence ${sequenceIndex + 1}` : "Task Sequence",
        interfaceLabel: INTERFACE_LABELS[conditionId] ?? "Interface",
        trialPlan,
        stepIndex,
        totalSteps: trialPlan.length,
        citationClicks,
        taskStartTime,
        logs,
        startSession,
        startTask,
        endTask,
        recordCitationClick,
        submitDecision,
        advanceToNextTrial,
        exportCSV,
        resetSession,
        clearAllLogs,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const ctx = useContext(TelemetryContext);
  if (!ctx) throw new Error("useTelemetry must be used inside TelemetryProvider");
  return ctx;
}
