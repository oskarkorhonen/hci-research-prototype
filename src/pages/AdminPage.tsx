import { useState } from "react";
import { Link } from "react-router-dom";
import PageShell, { Card } from "../components/PageShell";
import { useStudy } from "../contexts/StudyContext";
import { TRIAL_COUNT } from "../study/design";
import { sessionFileName } from "../study/session";
import { downloadJson } from "../study/storage";

// Lists sessions completed in THIS browser. It is only useful when several
// participants take the study on the researcher's own machine. Participants
// who use their own computer send their results file instead.
export default function AdminPage() {
  const { completedSessions, clearCompletedSessions } = useStudy();
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  function handleClear() {
    clearCompletedSessions();
    setIsConfirmingClear(false);
  }

  return (
    <PageShell
      title="Researcher page"
      subtitle="Sessions completed in this browser. Each one is also downloaded as a file when the participant finishes."
    >
      <Card>
        {completedSessions.length === 0 ? (
          <p className="text-sm text-slate-600">No completed sessions are stored in this browser.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {completedSessions.map((record) => (
              <li
                key={`${record.participant_id}-${record.session_completed_at}`}
                className="py-3 flex items-center justify-between gap-4 text-sm"
              >
                <span className="text-slate-700">
                  <strong className="text-slate-900">{record.participant_id}</strong> · order{" "}
                  {record.condition_order} · {record.score}/{TRIAL_COUNT} correct ·{" "}
                  {record.session_completed_at.slice(0, 16).replace("T", " ")}
                </span>
                <button
                  type="button"
                  onClick={() => downloadJson(sessionFileName(record), record)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {completedSessions.length > 0 && (
        <Card>
          {isConfirmingClear ? (
            <div className="space-y-3">
              <p className="text-sm text-red-800">
                This removes the stored sessions from this browser. Downloaded files are not
                affected. Make sure you have every file first.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Remove stored sessions
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingClear(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Keep them
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfirmingClear(true)}
              className="text-sm font-medium text-red-700 underline"
            >
              Remove stored sessions from this browser
            </button>
          )}
        </Card>
      )}

      <p className="text-center text-xs text-slate-400">
        <Link to="/" className="underline hover:text-slate-600">
          Back to the start page
        </Link>
      </p>
    </PageShell>
  );
}
