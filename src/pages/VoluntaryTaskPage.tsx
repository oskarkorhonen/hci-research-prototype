import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, PanelRight } from "lucide-react";
import { useTelemetry } from "../contexts/TelemetryContext";
import { getScenarioForCondition } from "../data/scenario";
import type { SummaryBlock as SummaryBlockType } from "../data/scenario";
import SummaryBlock from "../components/SummaryBlock";
import DocumentViewer from "../components/DocumentViewer";

export default function VoluntaryTaskPage() {
  const navigate = useNavigate();
  const { conditionId, recordCitationClick } = useTelemetry();
  const scenario = getScenarioForCondition(conditionId);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [activeBlock, setActiveBlock] = useState<SummaryBlockType | null>(null);

  function handleCitationClick(block: SummaryBlockType) {
    recordCitationClick();
    setActiveBlock(block);
  }

  function handleSubmit() {
    if (!selectedAnswer) return;
    sessionStorage.setItem("pending_answer", selectedAnswer);
    navigate("/survey");
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Bot size={16} className="text-blue-600" />
          <span className="font-medium">AI Literature Summary</span>
          <span className="text-slate-300 mx-1">·</span>
          <PanelRight size={14} className="text-slate-400" />
          <span className="text-slate-400">Source Document Viewer</span>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium">
          Condition 2 · Voluntary Deep-Linking
        </span>
      </header>

      {/* Split body */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT — AI Summary panel */}
        <div className="w-2/5 flex flex-col border-r border-slate-200 overflow-hidden bg-slate-50">
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

            {/* Research question */}
            <div className="bg-white rounded-xl border border-slate-200 px-4 py-3">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                Research Question
              </p>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {scenario.research_question}
              </p>
            </div>

            {/* AI summary blocks */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 flex items-center gap-2">
                <Bot size={14} className="text-blue-200" />
                <span className="text-xs font-semibold text-white">AI-Generated Summary</span>
              </div>
              <div className="p-4 space-y-3">
                {scenario.ai_summary_blocks.map((block, i) => (
                  <SummaryBlock
                    key={block.id}
                    block={block}
                    index={i}
                    mode="voluntary"
                    isActive={activeBlock?.id === block.id}
                    onCitationClick={handleCitationClick}
                  />
                ))}
              </div>
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
                Click any citation button to jump to the source passage in the document viewer.
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

              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  selectedAnswer
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Submit Decision
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Document viewer panel */}
        <div className="flex-1 overflow-hidden">
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
                Click a citation button on the left to jump to the source passage.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
