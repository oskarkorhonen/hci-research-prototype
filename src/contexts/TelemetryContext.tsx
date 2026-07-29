import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CONDITION_SCENARIOS } from "../data/scenario";

export interface SurveyResults {
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
  timestamp: string;
  time_to_decision_ms: number;
  citation_clicks_count: number;
  given_answer: string;
  correct_answer: string;
  caught_hallucination: boolean;
  mental_demand_score: number;
  system_complexity_score: number;
  preference_score: number;
  trust_score: number;
}

// A = Baseline, B = Voluntary Deep-Linking, C = Forced Verification.
export const CONDITION_NAMES: Record<string, string> = {
  "1": "Baseline",
  "2": "Voluntary",
  "3": "Forced",
};

const LETTER_TO_CONDITION: Record<string, string> = { A: "1", B: "2", C: "3" };

// Latin square of the 6 possible condition orderings, used to counterbalance
// order effects (trust carry-over) across participants in this within-subjects design.
export const LATIN_SQUARE = ["ABC", "ACB", "BAC", "BCA", "CAB", "CBA"];

export interface Trial {
  conditionId: string;
  scenarioId: string;
}

// Each condition block runs its AI-Incorrect trial before its AI-Accurate
// trial, back to back, in whichever position the Latin square places that
// condition. E.g. sequence "CAB" -> Forced(incorrect, correct), Baseline
// (incorrect, correct), Voluntary(incorrect, correct) — 6 trials total.
function buildTrialPlan(sequence: string): Trial[] {
  return sequence
    .split("")
    .map((letter) => LETTER_TO_CONDITION[letter])
    .flatMap((conditionId) => {
      const pair = CONDITION_SCENARIOS[conditionId];
      return [
        { conditionId, scenarioId: pair.incorrect },
        { conditionId, scenarioId: pair.correct },
      ];
    });
}

interface TelemetryContextType {
  participantId: string;
  conditionId: string;
  scenarioId: string;
  sequenceOrder: string;
  trialPlan: Trial[];
  stepIndex: number;
  totalSteps: number;
  citationClicks: number;
  taskStartTime: number | null;
  logs: TelemetryLog[];
  startSession: (rawParticipantId: string) => void;
  startTask: () => void;
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const startSession = useCallback((rawParticipantId: string) => {
    const numericId = parseInt(rawParticipantId.replace(/\D/g, ""), 10) || 0;
    const sequence = LATIN_SQUARE[numericId % LATIN_SQUARE.length];
    const plan = buildTrialPlan(sequence);

    setParticipantId(`Participant_${String(numericId).padStart(2, "0")}`);
    setSequenceOrder(sequence);
    setTrialPlan(plan);
    setStepIndex(0);
    setConditionId(plan[0].conditionId);
    setScenarioId(plan[0].scenarioId);
    setCitationClicks(0);
    citationClicksRef.current = 0;
    setTaskStartTime(null);
  }, []);

  const startTask = useCallback(() => {
    setCitationClicks(0);
    citationClicksRef.current = 0;
    setTaskStartTime(Date.now());
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
      const elapsed = taskStartTime ? Date.now() - taskStartTime : 0;
      const log: TelemetryLog = {
        participant_id: participantId || "unknown",
        sequence_order: sequenceOrder,
        condition_id: CONDITION_NAMES[conditionId] ?? conditionId,
        scenario_id: scenarioIdForLog,
        timestamp: new Date().toISOString(),
        time_to_decision_ms: elapsed,
        citation_clicks_count: citationClicksRef.current,
        given_answer: givenAnswer,
        correct_answer: correctAnswer,
        // Reflects whether the final decision was correct: rejecting the
        // hallucination on AI-Incorrect trials, or accepting the accurate
        // summary on AI-Accurate trials.
        caught_hallucination:
          givenAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase(),
        mental_demand_score: surveyResults.mental_demand,
        system_complexity_score: surveyResults.system_complexity,
        preference_score: surveyResults.preference,
        trust_score: surveyResults.trust,
      };
      setLogs((prev) => [...prev, log]);
      return log;
    },
    [participantId, sequenceOrder, conditionId, taskStartTime]
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
      "time_to_decision_ms",
      "citation_clicks_count",
      "caught_hallucination",
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
  }, []);

  const clearAllLogs = useCallback(() => {
    setLogs([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <TelemetryContext.Provider
      value={{
        participantId,
        conditionId,
        scenarioId,
        sequenceOrder,
        trialPlan,
        stepIndex,
        totalSteps: trialPlan.length,
        citationClicks,
        taskStartTime,
        logs,
        startSession,
        startTask,
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
