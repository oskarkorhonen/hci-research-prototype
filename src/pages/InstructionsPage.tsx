import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle, XCircle, Clock, ArrowRight, Shuffle } from "lucide-react";
import { useTelemetry, CONDITION_NAMES } from "../contexts/TelemetryContext";
import { getScenarioById } from "../data/scenario";

export default function InstructionsPage() {
  const navigate = useNavigate();
  const { conditionId, scenarioId, participantId, sequenceOrder, stepIndex, totalSteps, startTask } =
    useTelemetry();
  const scenario = getScenarioById(scenarioId);

  function handleBegin() {
    startTask();
    navigate("/task");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">

        {/* Session badge */}
        <div className="flex items-center justify-between text-xs text-slate-500 bg-white rounded-lg border border-slate-200 px-4 py-2">
          <span>Participant: <strong className="text-slate-700">{participantId}</strong></span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
            Condition {conditionId} · {CONDITION_NAMES[conditionId]} · Step {stepIndex + 1} of {totalSteps}
          </span>
        </div>

        {/* Counterbalancing notice */}
        <div className="flex items-start gap-3 rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-3">
          <Shuffle size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-800 leading-relaxed">
            To counterbalance order effects in this within-subjects trial, you have been
            assigned to Sequence <strong>{sequenceOrder}</strong>.
          </p>
        </div>

        {/* Stakes card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
            <h2 className="font-bold text-amber-900 text-base">Task Briefing & Stakes</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-slate-700 leading-relaxed">
              {scenario.stakes_description}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-green-800">Correct Decision</p>
                  <p className="text-sm font-bold text-green-700">+£5 bonus</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                <XCircle size={18} className="text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-red-800">Incorrect Decision</p>
                  <p className="text-sm font-bold text-red-700">−£5 penalty</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-700">
              <strong>Research question you will answer:</strong>{" "}
              <span className="italic">"{scenario.research_question}"</span>
            </div>
          </div>
        </div>

        {/* Condition-specific instructions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 space-y-3">
          <h3 className="font-semibold text-slate-800 text-sm">
            How this interface works (Condition {conditionId})
          </h3>

          {conditionId === "1" && (
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                You will see an AI-generated summary of the literature. Read it carefully.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                Citations are shown as static labels. No PDF viewer is provided.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                Make your decision and click "Submit Decision" when ready.
              </li>
            </ul>
          )}

          {conditionId === "2" && (
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                The screen is split: the AI summary is on the left, the source document on the right.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                Each citation is a <strong>clickable button</strong>. Clicking it jumps to and highlights the relevant passage in the source document.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                Verification is entirely optional. Submit whenever you are ready.
              </li>
            </ul>
          )}

          {conditionId === "3" && (
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                Same split-screen interface as Condition 2 with clickable citations.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                When you click "Submit Decision", the system will <strong>automatically open the key source claim</strong> and require a 15-second review before your submission is accepted.
              </li>
              <li className="flex items-start gap-2">
                <Clock size={13} className="mt-0.5 text-violet-500 flex-shrink-0" />
                This pause is mandatory. Use it to review the evidence before confirming.
              </li>
            </ul>
          )}
        </div>

        <button
          onClick={handleBegin}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          Start Task
          <ArrowRight size={16} />
        </button>

        <p className="text-center text-xs text-slate-400">
          Your interactions are being recorded for research purposes only.
        </p>
      </div>
    </div>
  );
}
