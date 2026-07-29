import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, PanelRight, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useTelemetry } from "../contexts/TelemetryContext";
import { getScenarioById } from "../data/scenario";
import type { SummaryBlock as SummaryBlockType } from "../data/scenario";
import SummaryBlock from "../components/SummaryBlock";
import DocumentViewer from "../components/DocumentViewer";

const FORCED_REVIEW_SECONDS = 15;

type ForcingState = "idle" | "reviewing" | "unlocked";

export default function ForcedTaskPage() {
  const navigate = useNavigate();
  const { scenarioId, recordCitationClick } = useTelemetry();
  const scenario = getScenarioById(scenarioId);
  // Forced review always targets the same designated block, whether or not
  // the AI happened to be accurate this trial — the timer must behave
  // identically either way so it can't tip participants off.
  const primaryBlock = scenario.ai_summary_blocks.find(
    (b) => b.id === scenario.primary_review_block_id
  )!;
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [activeBlock, setActiveBlock] = useState<SummaryBlockType | null>(null);
  const [forcingState, setForcingState] = useState<ForcingState>("idle");
  const [countdown, setCountdown] = useState(FORCED_REVIEW_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startForcedReview = useCallback(() => {
    setForcingState("reviewing");
    setActiveBlock(primaryBlock);
    setCountdown(FORCED_REVIEW_SECONDS);

    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          setForcingState("unlocked");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, [primaryBlock]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handleCitationClick(block: SummaryBlockType) {
    // Locked during the forced review so the mandatory passage stays in view
    if (forcingState === "reviewing") return;
    recordCitationClick();
    setActiveBlock(block);
  }

  function handleSubmitAttempt() {
    if (!selectedAnswer) return;
    if (forcingState === "idle") {
      startForcedReview();
    } else if (forcingState === "unlocked") {
      sessionStorage.setItem("pending_answer", selectedAnswer);
      navigate("/survey");
    }
  }

  const submitLabel = (() => {
    if (forcingState === "idle") return "Submit Decision";
    if (forcingState === "reviewing") return `Reviewing source… ${countdown}s`;
    return "Confirm & Submit";
  })();

  const submitDisabled = !selectedAnswer || forcingState === "reviewing";

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Bot size={16} className="text-violet-600" />
          <span className="font-medium">AI Report Summary</span>
          <span className="text-slate-300 mx-1">·</span>
          <PanelRight size={14} className="text-slate-400" />
          <span className="text-slate-400">Source Document Viewer</span>
        </div>
        <span className="text-xs bg-violet-100 text-violet-700 rounded-full px-3 py-1 font-medium">
          Condition 3 · Forced Verification
        </span>
      </header>

      {/* Split body */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* LEFT — AI Summary panel */}
        <div className="w-2/5 flex flex-col border-r border-slate-200 overflow-hidden bg-slate-50">
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

            {/* Research question */}
            <div className="bg-white rounded-xl border border-slate-200 px-4 py-3">
              <p className="text-xs font-semibold text-violet-700 uppercase tracking-wider mb-1">
                Research Question
              </p>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {scenario.research_question}
              </p>
            </div>

            {/* AI summary blocks */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-4 py-2.5 flex items-center gap-2">
                <Bot size={14} className="text-violet-200" />
                <span className="text-xs font-semibold text-white">AI-Generated Summary</span>
              </div>
              <div className="p-4 space-y-3">
                {scenario.ai_summary_blocks.map((block, i) => (
                  <SummaryBlock
                    key={block.id}
                    block={block}
                    index={i}
                    mode="forced"
                    isActive={activeBlock?.id === block.id}
                    onCitationClick={handleCitationClick}
                  />
                ))}
              </div>
            </div>

            {/* Decision */}
            <div className="bg-white rounded-xl border border-slate-200 px-4 py-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-800">Your Decision</h3>
              <div className="flex gap-2">
                {scenario.answer_options.map((opt) => (
                  <label
                    key={opt}
                    className={`flex-1 flex items-center justify-center rounded-xl border-2 py-2.5 cursor-pointer font-semibold text-sm transition-colors ${
                      selectedAnswer === opt
                        ? opt === "Yes"
                          ? "border-green-500 bg-green-50 text-green-800"
                          : "border-red-400 bg-red-50 text-red-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision"
                      value={opt}
                      checked={selectedAnswer === opt}
                      onChange={() => setSelectedAnswer(opt)}
                      className="sr-only"
                    />
                    {opt}
                  </label>
                ))}
              </div>

              {/* Submit with forcing-function state */}
              <button
                onClick={handleSubmitAttempt}
                disabled={submitDisabled}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                  forcingState === "unlocked"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : forcingState === "reviewing"
                    ? "bg-amber-100 text-amber-700 cursor-not-allowed"
                    : selectedAnswer
                    ? "bg-violet-600 hover:bg-violet-700 text-white"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {forcingState === "reviewing" ? (
                  <>
                    <Clock size={14} className="animate-pulse" />
                    {submitLabel}
                  </>
                ) : forcingState === "unlocked" ? (
                  <>
                    <CheckCircle2 size={14} />
                    {submitLabel}
                  </>
                ) : (
                  submitLabel
                )}
              </button>

              {forcingState === "idle" && selectedAnswer && (
                <p className="text-xs text-slate-400 text-center">
                  Clicking submit will trigger a mandatory source review before your decision is recorded.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — Document viewer */}
        <div className="flex-1 overflow-hidden relative">
          {activeBlock ? (
            <DocumentViewer
              document={scenario.documents[0]}
              highlightedPageNum={activeBlock.citation.page_num}
              highlightedText={activeBlock.citation.exact_text}
              highlightedBlockId={activeBlock.id}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-200 text-slate-500">
              <PanelRight size={48} className="text-slate-300 mb-4" />
              <p className="text-sm font-medium">Source Document</p>
              <p className="text-xs mt-1 text-slate-400">
                Click a citation to jump to the source, or submit to trigger forced review.
              </p>
            </div>
          )}

          {/* Forced review indicator — floats in a corner, never obscures the highlighted passage */}
          {forcingState === "reviewing" && (
            <div className="absolute top-4 right-4 z-20 max-w-xs">
              <div className="bg-white rounded-xl shadow-lg border border-amber-200 px-4 py-3 flex items-center gap-3">
                <div className="relative w-11 h-11 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                    <circle
                      cx="22" cy="22" r="18"
                      fill="none" stroke="#e2e8f0" strokeWidth="5"
                    />
                    <circle
                      cx="22" cy="22" r="18"
                      fill="none" stroke="#d97706" strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 18}`}
                      strokeDashoffset={`${2 * Math.PI * 18 * (1 - countdown / FORCED_REVIEW_SECONDS)}`}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-amber-700">{countdown}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-900 flex items-center gap-1">
                    <ShieldAlert size={12} />
                    Mandatory review
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Read the highlighted passage before submitting.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Unlocked confirmation banner */}
          {forcingState === "unlocked" && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-green-600 text-white text-sm font-semibold rounded-full px-5 py-2 shadow-lg flex items-center gap-2">
                <CheckCircle2 size={16} />
                Review complete — you may now submit your decision.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
