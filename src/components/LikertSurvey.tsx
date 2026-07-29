import React, { useState } from "react";
import type { SurveyResults } from "../contexts/TelemetryContext";

const QUESTIONS: { key: keyof SurveyResults; label: string; question: string }[] = [
  {
    key: "mental_demand",
    label: "Mental Demand",
    question: "I found this task mentally demanding.",
  },
  {
    key: "system_complexity",
    label: "System Complexity",
    question: "The system was complex to use.",
  },
  {
    key: "preference",
    label: "Preference",
    question: "I would like to use this system frequently.",
  },
  {
    key: "trust",
    label: "Trust",
    question: "I trust the AI's suggestions for making optimal decisions.",
  },
];

const SCALE_LABELS = [
  { value: 1, label: "Strongly\nDisagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly\nAgree" },
];

interface LikertSurveyProps {
  onSubmit: (results: SurveyResults) => void;
}

export default function LikertSurvey({ onSubmit }: LikertSurveyProps) {
  const [answers, setAnswers] = useState<Partial<SurveyResults>>({});

  const allAnswered = QUESTIONS.every((q) => answers[q.key] !== undefined);

  function handleChange(key: keyof SurveyResults, value: number) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    if (!allAnswered) return;
    onSubmit(answers as SurveyResults);
  }

  return (
    <div className="space-y-8">
      {QUESTIONS.map((q, qi) => (
        <div key={q.key} className="space-y-3">
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">
              {qi + 1}
            </span>
            <div>
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                {q.label}
              </span>
              <p className="text-sm text-slate-800 font-medium mt-0.5">
                {q.question}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pl-8">
            {SCALE_LABELS.map(({ value, label }) => {
              const selected = answers[q.key] === value;
              return (
                <label
                  key={value}
                  className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name={q.key}
                    value={value}
                    checked={selected}
                    onChange={() => handleChange(q.key, value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-colors ${
                      selected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 bg-white text-slate-600 group-hover:border-blue-400 group-hover:bg-blue-50"
                    }`}
                  >
                    {value}
                  </div>
                  <span className="text-center text-xs text-slate-500 leading-tight whitespace-pre-line">
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          {allAnswered
            ? "All questions answered — you may submit."
            : `${QUESTIONS.filter((q) => answers[q.key] === undefined).length} question(s) remaining.`}
        </p>
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            allAnswered
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          Submit Survey
        </button>
      </div>
    </div>
  );
}
