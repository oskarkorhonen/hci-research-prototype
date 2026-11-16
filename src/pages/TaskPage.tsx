import { useRef, useState } from "react";
import { Bot, ShieldAlert } from "lucide-react";
import DecisionPanel from "../components/DecisionPanel";
import DocumentViewer from "../components/DocumentViewer";
import type { Highlight } from "../components/DocumentViewer";
import SummaryBlock from "../components/SummaryBlock";
import { useStudy } from "../contexts/StudyContext";
import { DOMAIN_BRIEFINGS } from "../data/domains";
import { getScenarioById } from "../data/scenarios";
import type { Answer, BlockId, SummaryBlock as SummaryBlockData } from "../data/types";
import { INTERFACE_LABELS, TRIAL_COUNT } from "../study/design";
import type { PlannedTrial } from "../study/design";
import type { DecisionTelemetry } from "../study/session";
import { useForcedReview } from "../study/useForcedReview";

// One counted scroll gesture per this many milliseconds, so a single long
// scroll is not logged as hundreds of events.
const SCROLL_EVENT_THROTTLE_MS = 300;

interface TrialLog {
  startedAt: number;
  clickedBlockIds: BlockId[];
  firstClickMs: number | null;
  scrollEvents: number;
  lastScrollAt: number;
  maxScrollFraction: number;
  forcedReviewStartedMs: number | null;
  answerAtReview: Answer | null;
}

function newTrialLog(): TrialLog {
  return {
    startedAt: Date.now(),
    clickedBlockIds: [],
    firstClickMs: null,
    scrollEvents: 0,
    lastScrollAt: 0,
    maxScrollFraction: 0,
    forcedReviewStartedMs: null,
    answerAtReview: null,
  };
}

type ScreenProps = {
  trial: PlannedTrial;
  onDecision: (decision: DecisionTelemetry) => void;
};

function TaskScreen({ trial, onDecision }: ScreenProps) {
  const scenario = getScenarioById(trial.scenarioId);
  const briefing = DOMAIN_BRIEFINGS[scenario.domain];
  const isForced = trial.condition === "Forced";
  const hasLinks = trial.condition !== "Baseline";

  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<BlockId | null>(null);
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const review = useForcedReview();
  const log = useRef<TrialLog>(newTrialLog());

  function showPassage(block: SummaryBlockData) {
    setActiveBlockId(block.id);
    setHighlight((previous) => ({
      pageNum: block.citation.page_num,
      text: block.citation.exact_text,
      token: (previous?.token ?? 0) + 1,
    }));
  }

  function handleCitationClick(block: SummaryBlockData) {
    // Locked during the required review so the key passage stays in view.
    if (review.state === "reviewing") return;
    const current = log.current;
    current.clickedBlockIds = [...current.clickedBlockIds, block.id];
    current.firstClickMs = current.firstClickMs ?? Date.now() - current.startedAt;
    showPassage(block);
  }

  function handleUserScroll(scrollFraction: number) {
    const current = log.current;
    const now = Date.now();
    current.maxScrollFraction = Math.max(current.maxScrollFraction, scrollFraction);
    if (now - current.lastScrollAt >= SCROLL_EVENT_THROTTLE_MS) {
      current.scrollEvents += 1;
      current.lastScrollAt = now;
    }
  }

  function handleSubmit() {
    if (!selectedAnswer) return;
    if (isForced && review.state === "idle") {
      const keyBlock = scenario.ai_summary_blocks.find((b) => b.id === scenario.key_block_id);
      if (keyBlock) showPassage(keyBlock);
      log.current.forcedReviewStartedMs = Date.now() - log.current.startedAt;
      log.current.answerAtReview = selectedAnswer;
      review.start();
      return;
    }
    const current = log.current;
    onDecision({
      given_answer: selectedAnswer,
      time_to_decision_ms: Date.now() - current.startedAt,
      citation_clicks_count: current.clickedBlockIds.length,
      clicked_block_ids: current.clickedBlockIds,
      key_citation_opened: current.clickedBlockIds.includes(scenario.key_block_id),
      time_to_first_click_ms: current.firstClickMs,
      doc_scroll_events: current.scrollEvents,
      doc_max_scroll_fraction: Number(current.maxScrollFraction.toFixed(3)),
      forced_review_shown: isForced,
      forced_review_started_ms: current.forcedReviewStartedMs,
      answer_changed_after_review:
        current.answerAtReview !== null && current.answerAtReview !== selectedAnswer,
    });
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          Task {trial.trialIndex} of {TRIAL_COUNT}
        </span>
        <span className="text-xs bg-slate-100 text-slate-700 rounded-full px-3 py-1 font-medium">
          {INTERFACE_LABELS[trial.condition]}
        </span>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-2/5 min-w-[360px] border-r border-slate-200 bg-slate-50 overflow-y-auto px-5 py-5 space-y-4">
          <section className="bg-white rounded-xl border border-slate-200 px-4 py-3 space-y-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              You are {briefing.role} on {briefing.board}.
            </p>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {scenario.research_question}
            </p>
            <p className="text-xs text-slate-700 leading-relaxed bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <strong>Board policy:</strong> {briefing.policy}
            </p>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <h2 className="bg-slate-700 px-4 py-2.5 flex items-center gap-2 text-xs font-semibold text-white">
              <Bot size={14} aria-hidden="true" />
              AI-generated summary of the report
            </h2>
            <div className="p-4 space-y-3">
              {scenario.ai_summary_blocks.map((block, index) => (
                <SummaryBlock
                  key={block.id}
                  block={block}
                  index={index}
                  isClickable={hasLinks}
                  isActive={activeBlockId === block.id}
                  onCitationClick={handleCitationClick}
                />
              ))}
            </div>
          </section>

          <DecisionPanel
            selectedAnswer={selectedAnswer}
            onSelect={setSelectedAnswer}
            onSubmit={handleSubmit}
            reviewState={isForced ? review.state : "none"}
            secondsLeft={review.secondsLeft}
          />
        </div>

        <div className="flex-1 overflow-hidden relative">
          <DocumentViewer
            document={scenario.document}
            highlight={highlight}
            onUserScroll={handleUserScroll}
          />
          {review.state === "reviewing" && (
            <div
              className="absolute top-14 right-6 z-20 bg-white rounded-xl shadow-lg border border-amber-200 px-4 py-3 flex items-center gap-3"
              role="status"
            >
              <span className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 text-sm font-bold flex items-center justify-center">
                {review.secondsLeft}
              </span>
              <span className="text-xs text-slate-600">
                <strong className="flex items-center gap-1 text-amber-900">
                  <ShieldAlert size={12} aria-hidden="true" />
                  Required review
                </strong>
                Read the highlighted passage before submitting.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TaskPage() {
  const { session, currentTrial, savePendingDecision } = useStudy();

  if (!session || !currentTrial) {
    return null;
  }

  // The key makes every trial start from a clean screen and a fresh timer.
  return (
    <TaskScreen
      key={currentTrial.trialIndex}
      trial={currentTrial}
      onDecision={savePendingDecision}
    />
  );
}
