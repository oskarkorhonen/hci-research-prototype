import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getScenarioById, keyBlockPosition } from "../data/scenarios";
import { TRIALS_PER_BLOCK, buildSessionPlan } from "../study/design";
import type { PlannedTrial, SessionPlan } from "../study/design";
import { buildSessionRecord } from "../study/session";
import type {
  BlockRatings,
  BlockSurveyRecord,
  DecisionTelemetry,
  Demographics,
  FinalSurvey,
  SessionRecord,
  TrialRecord,
} from "../study/session";
import { readJson, removeKey, writeJson } from "../study/storage";

const ACTIVE_SESSION_KEY = "deeplink_active_session_v2";
const COMPLETED_SESSIONS_KEY = "deeplink_completed_sessions_v2";

// Which screen the participant is on. The flow is driven by this one field
// instead of URLs, so the back button and reloads cannot skip or repeat a step.
export type Phase =
  | "about-you"
  | "briefing"
  | "interface"
  | "task"
  | "confidence"
  | "block-survey"
  | "final";

// Everything about a session in progress. Kept in sessionStorage so an
// accidental page reload does not throw away a participant's earlier trials.
interface ActiveSession {
  phase: Phase;
  plan: SessionPlan;
  startedAt: string;
  reloadCount: number;
  demographics: Demographics | null;
  trials: TrialRecord[];
  blockSurveys: BlockSurveyRecord[];
  pendingDecision: DecisionTelemetry | null;
  // Trials whose task screen was reloaded before the answer was submitted.
  // Their timing and click logs restarted, so the analysis can flag them.
  restartedTrialIndexes: number[];
}

interface StudyContextValue {
  session: ActiveSession | null;
  currentTrial: PlannedTrial | null;
  completedSessions: SessionRecord[];
  lastCompleted: SessionRecord | null;
  startSession: (participantNumber: number) => void;
  saveDemographics: (demographics: Demographics) => void;
  acknowledgeBriefing: () => void;
  beginBlock: () => void;
  savePendingDecision: (decision: DecisionTelemetry) => void;
  completeTrial: (confidenceRating: number) => void;
  saveBlockSurvey: (ratings: BlockRatings) => void;
  finishSession: (finalSurvey: FinalSurvey) => void;
  dismissCompleted: () => void;
  clearCompletedSessions: () => void;
}

const StudyContext = createContext<StudyContextValue | null>(null);

function restoreActiveSession(): ActiveSession | null {
  const stored = readJson<ActiveSession>(sessionStorage, ACTIVE_SESSION_KEY);
  if (!stored) return null;
  // A submitted answer that was waiting for its confidence rating is kept, so
  // a reload cannot be used to see the task again and change the answer. A
  // reload during a task restarts that task, and the trial is flagged.
  const restarted = stored.restartedTrialIndexes ?? [];
  const currentIndex = stored.plan.trials[stored.trials.length]?.trialIndex;
  const restartedTrialIndexes =
    stored.phase === "task" && currentIndex !== undefined
      ? [...restarted, currentIndex]
      : restarted;
  return { ...stored, reloadCount: stored.reloadCount + 1, restartedTrialIndexes };
}

function buildTrialRecord(
  planned: PlannedTrial,
  decision: DecisionTelemetry,
  confidenceRating: number,
  wasRestarted: boolean
): TrialRecord {
  const scenario = getScenarioById(planned.scenarioId);
  return {
    ...decision,
    trial_index: planned.trialIndex,
    block_index: planned.blockIndex,
    within_block_position: planned.withinBlockPosition,
    condition: planned.condition,
    document_set: planned.documentSet,
    scenario_id: scenario.id,
    domain: scenario.domain,
    trial_type: scenario.trial_type,
    key_block_position: keyBlockPosition(scenario),
    correct_answer: scenario.correct_answer,
    decision_correct: decision.given_answer === scenario.correct_answer,
    confidence_rating: confidenceRating,
    trial_restarted: wasRestarted,
    submitted_at: new Date().toISOString(),
  };
}

export function StudyProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ActiveSession | null>(restoreActiveSession);
  const [completedSessions, setCompletedSessions] = useState<SessionRecord[]>(
    () => readJson<SessionRecord[]>(localStorage, COMPLETED_SESSIONS_KEY) ?? []
  );
  const [lastCompleted, setLastCompleted] = useState<SessionRecord | null>(null);

  useEffect(() => {
    if (session) {
      writeJson(sessionStorage, ACTIVE_SESSION_KEY, session);
    } else {
      removeKey(sessionStorage, ACTIVE_SESSION_KEY);
    }
  }, [session]);

  useEffect(() => {
    writeJson(localStorage, COMPLETED_SESSIONS_KEY, completedSessions);
  }, [completedSessions]);

  const currentTrial = session ? (session.plan.trials[session.trials.length] ?? null) : null;

  const startSession = useCallback((participantNumber: number) => {
    setLastCompleted(null);
    setSession({
      phase: "about-you",
      plan: buildSessionPlan(participantNumber),
      startedAt: new Date().toISOString(),
      reloadCount: 0,
      demographics: null,
      trials: [],
      blockSurveys: [],
      pendingDecision: null,
      restartedTrialIndexes: [],
    });
  }, []);

  const saveDemographics = useCallback((demographics: Demographics) => {
    setSession((current) =>
      current ? { ...current, demographics, phase: "briefing" } : current
    );
  }, []);

  const acknowledgeBriefing = useCallback(() => {
    setSession((current) => (current ? { ...current, phase: "interface" } : current));
  }, []);

  const beginBlock = useCallback(() => {
    setSession((current) => (current ? { ...current, phase: "task" } : current));
  }, []);

  const savePendingDecision = useCallback((decision: DecisionTelemetry) => {
    setSession((current) =>
      current ? { ...current, pendingDecision: decision, phase: "confidence" } : current
    );
  }, []);

  const completeTrial = useCallback(
    (confidenceRating: number): void => {
      if (!session || !currentTrial || !session.pendingDecision) {
        throw new Error("No decision is waiting for a confidence rating");
      }
      const record = buildTrialRecord(
        currentTrial,
        session.pendingDecision,
        confidenceRating,
        session.restartedTrialIndexes.includes(currentTrial.trialIndex)
      );
      const phase: Phase =
        currentTrial.withinBlockPosition === TRIALS_PER_BLOCK ? "block-survey" : "task";
      setSession({
        ...session,
        phase,
        trials: [...session.trials, record],
        pendingDecision: null,
      });
    },
    [session, currentTrial]
  );

  const saveBlockSurvey = useCallback(
    (ratings: BlockRatings): void => {
      if (!session || session.trials.length === 0) {
        throw new Error("No finished block to rate");
      }
      const lastTrial = session.trials[session.trials.length - 1];
      const survey: BlockSurveyRecord = {
        ...ratings,
        block_index: lastTrial.block_index,
        condition: lastTrial.condition,
      };
      const phase: Phase =
        session.trials.length === session.plan.trials.length ? "final" : "interface";
      setSession({ ...session, phase, blockSurveys: [...session.blockSurveys, survey] });
    },
    [session]
  );

  const finishSession = useCallback(
    (finalSurvey: FinalSurvey) => {
      if (!session || !session.demographics) {
        throw new Error("Session is missing its background answers");
      }
      const record = buildSessionRecord({
        plan: session.plan,
        startedAt: session.startedAt,
        completedAt: new Date().toISOString(),
        reloadCount: session.reloadCount,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        demographics: session.demographics,
        trials: session.trials,
        blockSurveys: session.blockSurveys,
        finalSurvey,
      });
      setCompletedSessions((existing) => [...existing, record]);
      setLastCompleted(record);
      setSession(null);
    },
    [session]
  );

  const dismissCompleted = useCallback(() => setLastCompleted(null), []);
  const clearCompletedSessions = useCallback(() => setCompletedSessions([]), []);

  const value = useMemo<StudyContextValue>(
    () => ({
      session,
      currentTrial,
      completedSessions,
      lastCompleted,
      startSession,
      saveDemographics,
      acknowledgeBriefing,
      beginBlock,
      savePendingDecision,
      completeTrial,
      saveBlockSurvey,
      finishSession,
      dismissCompleted,
      clearCompletedSessions,
    }),
    [
      session,
      currentTrial,
      completedSessions,
      lastCompleted,
      startSession,
      saveDemographics,
      acknowledgeBriefing,
      beginBlock,
      savePendingDecision,
      completeTrial,
      saveBlockSurvey,
      finishSession,
      dismissCompleted,
      clearCompletedSessions,
    ]
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- the hook belongs with its provider
export function useStudy(): StudyContextValue {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error("useStudy must be used inside StudyProvider");
  }
  return context;
}
