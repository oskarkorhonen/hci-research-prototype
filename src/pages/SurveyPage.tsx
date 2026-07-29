import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { useTelemetry, CONDITION_NAMES } from "../contexts/TelemetryContext";
import { getScenarioById } from "../data/scenario";
import LikertSurvey from "../components/LikertSurvey";
import type { SurveyResults } from "../contexts/TelemetryContext";

export default function SurveyPage() {
  const navigate = useNavigate();
  const { submitDecision, advanceToNextTrial, conditionId, scenarioId, participantId } =
    useTelemetry();
  const scenario = getScenarioById(scenarioId);
  const [pendingAnswer, setPendingAnswer] = useState("");

  useEffect(() => {
    const ans = sessionStorage.getItem("pending_answer") || "";
    setPendingAnswer(ans);
    if (!ans) {
      // Guard: should not arrive here without an answer
      navigate("/");
    }
  }, [navigate]);

  function handleSurveySubmit(results: SurveyResults) {
    submitDecision(pendingAnswer, scenario.correct_answer, scenario.id, results);
    sessionStorage.removeItem("pending_answer");
    const hasNextTrial = advanceToNextTrial();
    navigate(hasNextTrial ? "/instructions" : "/complete");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-6">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white mb-3">
            <ClipboardList size={22} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Post-Task Questionnaire</h1>
          <p className="mt-1 text-sm text-slate-500">
            Please answer all four questions about your experience.
          </p>
        </div>

        {/* Session context */}
        <div className="flex items-center justify-between text-xs text-slate-500 bg-white rounded-lg border border-slate-200 px-4 py-2">
          <span>Participant: <strong className="text-slate-700">{participantId}</strong></span>
          <span>Condition {conditionId} · {CONDITION_NAMES[conditionId]}</span>
          <span>
            Your answer:{" "}
            <strong
              className={pendingAnswer === scenario.correct_answer ? "text-green-700" : "text-slate-700"}
            >
              {pendingAnswer || "—"}
            </strong>
          </span>
        </div>

        {/* Survey card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-6">
          <LikertSurvey onSubmit={handleSurveySubmit} />
        </div>

        <p className="text-center text-xs text-slate-400">
          Your responses are anonymous and used solely for research purposes.
        </p>
      </div>
    </div>
  );
}
