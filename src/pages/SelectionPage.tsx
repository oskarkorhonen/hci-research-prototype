import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FlaskConical, User } from "lucide-react";
import { useTelemetry } from "../contexts/TelemetryContext";

export default function SelectionPage() {
  const navigate = useNavigate();
  const { startSession } = useTelemetry();
  const [localPid, setLocalPid] = useState("");
  const [error, setError] = useState("");

  function handleStart() {
    const numericId = parseInt(localPid.replace(/\D/g, ""), 10);
    if (!localPid.trim() || !numericId || numericId < 1 || numericId > 12) {
      setError("Please enter a participant number between 1 and 12.");
      return;
    }
    startSession(localPid.trim());
    navigate("/instructions");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-4">
            <FlaskConical size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">HCI Research Prototype</h1>
          <p className="mt-2 text-slate-500 text-sm max-w-md mx-auto">
            AI-Assisted Decision Making · Verification Interface Study
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-8">

          {/* Participant ID */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <User size={15} />
              Participant Number
            </label>
            <input
              type="text"
              value={localPid}
              onChange={(e) => {
                setLocalPid(e.target.value);
                setError("");
              }}
              placeholder="e.g. 1 (accepts 1–12)"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
            <p className="mt-2 text-xs text-slate-400">
              This is a within-subjects study: every participant experiences all three
              conditions (Baseline, Voluntary Deep-Linking, Forced Verification), each
              with two trials, for 6 trials total. Your participant number determines your
              counterbalanced condition order via a 6-way Latin square (participant number
              mod 6).
            </p>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            Begin Study Session
          </button>
        </div>

        {/* Admin link */}
        <p className="text-center mt-6 text-xs text-slate-400">
          Researcher access:{" "}
          <Link to="/admin" className="text-slate-500 underline hover:text-slate-700">
            Admin / Export
          </Link>
        </p>
      </div>
    </div>
  );
}
