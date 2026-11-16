import { CheckCircle2, Clock } from "lucide-react";
import type { Answer } from "../data/types";
import type { ForcedReviewState } from "../study/useForcedReview";

const ANSWERS: readonly Answer[] = ["Yes", "No"];

type Props = {
  selectedAnswer: Answer | null;
  onSelect: (answer: Answer) => void;
  onSubmit: () => void;
  // "none" for the two interfaces without a forced review.
  reviewState: ForcedReviewState | "none";
  secondsLeft: number;
};

function submitLabel(reviewState: Props["reviewState"], secondsLeft: number): string {
  if (reviewState === "reviewing") return `Reviewing source… ${secondsLeft}s`;
  if (reviewState === "unlocked") return "Confirm and submit";
  return "Submit decision";
}

function submitStyle(reviewState: Props["reviewState"], hasAnswer: boolean): string {
  if (reviewState === "reviewing") return "bg-amber-100 text-amber-800 cursor-not-allowed";
  if (!hasAnswer) return "bg-slate-200 text-slate-400 cursor-not-allowed";
  if (reviewState === "unlocked") return "bg-green-600 hover:bg-green-700 text-white";
  return "bg-blue-600 hover:bg-blue-700 text-white";
}

export default function DecisionPanel({
  selectedAnswer,
  onSelect,
  onSubmit,
  reviewState,
  secondsLeft,
}: Props) {
  const isReviewing = reviewState === "reviewing";
  const hasAnswer = selectedAnswer !== null;

  return (
    <section className="bg-white rounded-xl border border-slate-200 px-4 py-4 space-y-3">
      <h2 className="text-sm font-semibold text-slate-800">Your decision</h2>
      <div className="flex gap-2" role="radiogroup" aria-label="Your decision">
        {ANSWERS.map((answer) => {
          const isSelected = selectedAnswer === answer;
          return (
            <label
              key={answer}
              className={`flex-1 flex items-center justify-center rounded-xl border-2 py-2.5 cursor-pointer font-semibold text-sm transition-colors focus-within:ring-2 focus-within:ring-blue-400 ${
                isSelected
                  ? "border-blue-600 bg-blue-50 text-blue-900"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="decision"
                value={answer}
                checked={isSelected}
                onChange={() => onSelect(answer)}
                className="sr-only"
              />
              {answer}
            </label>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!hasAnswer || isReviewing}
        className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${submitStyle(
          reviewState,
          hasAnswer
        )}`}
      >
        {isReviewing && <Clock size={14} className="animate-pulse" aria-hidden="true" />}
        {reviewState === "unlocked" && <CheckCircle2 size={14} aria-hidden="true" />}
        {submitLabel(reviewState, secondsLeft)}
      </button>

      {reviewState === "idle" && hasAnswer && (
        <p className="text-xs text-slate-500 text-center">
          Submitting starts a required {secondsLeft}-second review of the source before your
          decision is recorded. You can still change your answer.
        </p>
      )}
    </section>
  );
}
