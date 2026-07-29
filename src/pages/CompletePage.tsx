import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, RotateCcw } from "lucide-react";
import { useTelemetry } from "../contexts/TelemetryContext";

export default function CompletePage() {
  const navigate = useNavigate();
  const { logs, participantId, sequenceOrder, resetSession } = useTelemetry();
  const lastLog = logs[logs.length - 1];

  function handleNewSession() {
    resetSession();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center">

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto">
          <CheckCircle size={36} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Task Complete</h1>
          <p className="mt-2 text-slate-500 text-sm">
            Thank you for participating. Your responses have been recorded.
          </p>
        </div>

        {lastLog && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 text-left space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">Session Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Participant</span>
                <span className="font-medium text-slate-800">{participantId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sequence</span>
                <span className="font-medium text-slate-800">{sequenceOrder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Final condition</span>
                <span className="font-medium text-slate-800">{lastLog.condition_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Decision time</span>
                <span className="font-medium text-slate-800">
                  {(lastLog.time_to_decision_ms / 1000).toFixed(1)}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Citation clicks</span>
                <span className="font-medium text-slate-800">{lastLog.citation_clicks_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Your answer</span>
                <span
                  className={`font-semibold ${
                    lastLog.caught_hallucination ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {lastLog.given_answer}
                  {lastLog.caught_hallucination ? " ✓ Caught hallucination" : " ✗ Missed hallucination"}
                </span>
              </div>
              {!lastLog.caught_hallucination && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Correct answer was</span>
                  <span className="font-semibold text-green-700">{lastLog.correct_answer}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleNewSession}
            className="flex-1 py-3 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors"
          >
            <RotateCcw size={15} />
            New Session
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            View Admin / Export
          </button>
        </div>
      </div>
    </div>
  );
}
