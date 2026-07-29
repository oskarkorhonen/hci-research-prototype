import React from "react";
import { useNavigate } from "react-router-dom";
import { Download, Trash2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useTelemetry } from "../contexts/TelemetryContext";

const CONDITION_BADGE_STYLE: Record<string, string> = {
  Baseline: "bg-slate-100 text-slate-700",
  Voluntary: "bg-blue-100 text-blue-700",
  Forced: "bg-violet-100 text-violet-700",
};

export default function AdminPage() {
  const navigate = useNavigate();
  const { logs, exportCSV, clearAllLogs } = useTelemetry();

  function handleClear() {
    if (window.confirm("Delete all telemetry logs? This cannot be undone.")) {
      clearAllLogs();
    }
  }

  const avgTime =
    logs.length > 0
      ? (logs.reduce((s, l) => s + l.time_to_decision_ms, 0) / logs.length / 1000).toFixed(1)
      : "—";

  const accuracy =
    logs.length > 0
      ? `${Math.round((logs.filter((l) => l.caught_hallucination).length / logs.length) * 100)}%`
      : "—";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <span className="text-slate-300">|</span>
          <h1 className="font-bold text-slate-900">Research Admin — Telemetry Export</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Trash2 size={14} />
            Clear Logs
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-1.5 font-semibold transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Participants", value: logs.length.toString() },
            { label: "Avg Decision Time", value: avgTime + (logs.length ? "s" : "") },
            { label: "Overall Accuracy", value: accuracy },
            {
              label: "Avg Citation Clicks",
              value:
                logs.length > 0
                  ? (logs.reduce((s, l) => s + l.citation_clicks_count, 0) / logs.length).toFixed(1)
                  : "—",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4">
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Log table */}
        {logs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-16 text-center">
            <p className="text-slate-400 text-sm">No telemetry data collected yet.</p>
            <p className="text-slate-400 text-xs mt-1">
              Complete a study session to see logs here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-left">
                    {[
                      "#",
                      "Participant",
                      "Sequence",
                      "Condition",
                      "Scenario",
                      "Timestamp",
                      "Time (s)",
                      "Cit. Clicks",
                      "Answer",
                      "Caught Hallucination",
                      "Mental",
                      "Complexity",
                      "Preference",
                      "Trust",
                    ].map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr
                      key={i}
                      className={`border-b border-slate-100 transition-colors ${
                        i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{log.participant_id}</td>
                      <td className="px-4 py-3 font-mono text-slate-600 text-xs">{log.sequence_order}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            CONDITION_BADGE_STYLE[log.condition_id] ?? "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {log.condition_id}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{log.scenario_id}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-800">
                        {(log.time_to_decision_ms / 1000).toFixed(1)}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-800">{log.citation_clicks_count}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{log.given_answer}</td>
                      <td className="px-4 py-3">
                        {log.caught_hallucination ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                      </td>
                      {[
                        log.mental_demand_score,
                        log.system_complexity_score,
                        log.preference_score,
                        log.trust_score,
                      ].map((score, si) => (
                        <td key={si} className="px-4 py-3">
                          <span
                            className={`inline-block w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                              score >= 4
                                ? "bg-blue-100 text-blue-800"
                                : score <= 2
                                ? "bg-red-100 text-red-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {score}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-400 text-center">
          Logs persist in localStorage across page reloads. Export CSV to save externally.
        </p>
      </main>
    </div>
  );
}
