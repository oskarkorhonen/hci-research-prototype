import type { Answer, BlockId, Domain, TrialType } from "../data/types";
import type { Condition, SessionPlan, SetId } from "./design";

// The record saved for one participant. Field names are snake_case because
// this object is written out as JSON and read by the Python analysis.
export const SCHEMA_VERSION = 2;

export interface Demographics {
  age_group: string;
  role: string;
  field: string;
  ai_use_frequency: string;
  software_familiarity: number;
}

// What the task screen measured, before the confidence rating is added.
export interface DecisionTelemetry {
  given_answer: Answer;
  time_to_decision_ms: number;
  citation_clicks_count: number;
  clicked_block_ids: BlockId[];
  key_citation_opened: boolean;
  time_to_first_click_ms: number | null;
  doc_scroll_events: number;
  doc_max_scroll_fraction: number;
  forced_review_shown: boolean;
  // Forced only: ms from trial start to the start of the required review.
  forced_review_started_ms: number | null;
  // Forced only: whether the answer was changed during or after the review.
  answer_changed_after_review: boolean;
}

export interface TrialRecord extends DecisionTelemetry {
  trial_index: number;
  block_index: number;
  within_block_position: number;
  condition: Condition;
  document_set: SetId;
  scenario_id: string;
  domain: Domain;
  trial_type: TrialType;
  key_block_position: number;
  correct_answer: Answer;
  decision_correct: boolean;
  confidence_rating: number;
  trial_restarted: boolean;
  submitted_at: string;
}

export interface BlockRatings {
  mental_demand: number;
  frustration: number;
  complexity: number;
  ease_of_verification: number;
  preference: number;
  trust: number;
}

export interface BlockSurveyRecord extends BlockRatings {
  block_index: number;
  condition: Condition;
}

export interface FinalSurvey {
  most_preferred: Condition;
  least_preferred: Condition;
  comment: string;
}

export interface SessionRecord {
  schema_version: number;
  participant_id: string;
  participant_number: number;
  session_started_at: string;
  session_completed_at: string;
  condition_order: string;
  set_rotation: number;
  reload_count: number;
  viewport: { width: number; height: number };
  demographics: Demographics;
  trials: TrialRecord[];
  block_surveys: BlockSurveyRecord[];
  final_survey: FinalSurvey;
  score: number;
}

export function participantId(participantNumber: number): string {
  return `P${String(participantNumber).padStart(2, "0")}`;
}

export function countCorrect(trials: readonly TrialRecord[]): number {
  return trials.filter((trial) => trial.decision_correct).length;
}

export function sessionFileName(record: SessionRecord): string {
  return `deeplink_${record.participant_id}.json`;
}

export interface SessionParts {
  plan: SessionPlan;
  startedAt: string;
  completedAt: string;
  reloadCount: number;
  viewport: { width: number; height: number };
  demographics: Demographics;
  trials: TrialRecord[];
  blockSurveys: BlockSurveyRecord[];
  finalSurvey: FinalSurvey;
}

export function buildSessionRecord(parts: SessionParts): SessionRecord {
  return {
    schema_version: SCHEMA_VERSION,
    participant_id: participantId(parts.plan.participantNumber),
    participant_number: parts.plan.participantNumber,
    session_started_at: parts.startedAt,
    session_completed_at: parts.completedAt,
    condition_order: parts.plan.conditionOrder,
    set_rotation: parts.plan.setRotation,
    reload_count: parts.reloadCount,
    viewport: parts.viewport,
    demographics: parts.demographics,
    trials: parts.trials,
    block_surveys: parts.blockSurveys,
    final_survey: parts.finalSurvey,
    score: countCorrect(parts.trials),
  };
}
