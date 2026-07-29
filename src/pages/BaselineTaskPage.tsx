import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, HelpCircle } from "lucide-react";
import { useTelemetry } from "../contexts/TelemetryContext";
import { getScenarioById } from "../data/scenario";
import SummaryBlock from "../components/SummaryBlock";

export default function BaselineTaskPage() {
  const navigate = useNavigate();
  const { scenarioId } = useTelemetry();
  const scenario = getScenarioById(scenarioId);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  function handleSubmit() {
    if (!selectedAnswer) return;
    // Survey results are collected on the next page; pass a placeholder here
    // and store the answer in sessionStorage for SurveyPage to finalize.
    sessionStorage.setItem("pending_answer", selectedAnswer);
    navigate("/survey");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Bot size={16} className="text-blue-600" />
          <span className="font-medium">AI Report Summary</span>
        </div>
        <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-3 py-1 font-medium">
          Condition 1 · Baseline
        </span>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Research question */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
          <div className="flex items-start gap-3">
            <HelpCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                Research Question
              </p>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {scenario.research_question}
              </p>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 flex items-center gap-2">
            <Bot size={16} className="text-blue-200" />
            <h2 className="text-sm font-semibold text-white">
              AI-Generated Report Summary
            </h2>
          </div>

          <div className="px-5 py-4 space-y-3">
            {scenario.ai_summary_blocks.map((block, i) => (
              <SummaryBlock
                key={block.id}
                block={block}
                index={i}
                mode="baseline"
                isActive={false}
              />
            ))}
          </div>

          <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
            <em>
              Source: {scenario.documents[0].authors} — {scenario.documents[0].journal}. Citations
              shown as static labels — no interactive viewer available in this condition.
            </em>
          </div>
        </div>

        {/* Decision panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-800">Your Decision</h3>
          <p className="text-sm text-slate-600">{scenario.research_question}</p>

          <div className="flex gap-3">
            {scenario.answer_options.map((opt) => (
              <label
                key={opt}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 py-3 cursor-pointer font-semibold text-sm transition-colors ${
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

          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
              selectedAnswer
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Submit Decision
          </button>
        </div>
      </main>
    </div>
  );
}
