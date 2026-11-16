import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageShell, { Card, PrimaryButton } from "../components/PageShell";
import { useStudy } from "../contexts/StudyContext";
import {
  MAX_PARTICIPANT_NUMBER,
  MIN_PARTICIPANT_NUMBER,
  isValidParticipantNumber,
} from "../study/design";

// Narrower screens cannot show the summary and the report side by side.
const MIN_COMFORTABLE_WIDTH = 1000;

const CONSENT_POINTS = [
  "You will read short AI-generated summaries of technical reports and make 12 yes-or-no decisions. It takes about 30 minutes.",
  "Taking part is voluntary. You can stop at any time by closing this page, and nothing is saved if you do.",
  "The study records your decisions, how long they take, what you click and scroll in the study pages, your ratings, and a few background answers. It does not record your name or anything outside these pages.",
  "The data is used for a university course research project. Results are reported for the group as a whole, and the anonymous data set may be published with the report.",
  "If you have questions, ask the researcher who invited you.",
];

export default function WelcomePage() {
  const [searchParams] = useSearchParams();
  const { startSession } = useStudy();
  const [numberText, setNumberText] = useState(searchParams.get("p") ?? "");
  const [hasConsented, setHasConsented] = useState(false);

  const participantNumber = Number(numberText.trim());
  const isNumberValid = numberText.trim() !== "" && isValidParticipantNumber(participantNumber);
  const isNarrow = window.innerWidth < MIN_COMFORTABLE_WIDTH;

  function handleStart() {
    if (!isNumberValid || !hasConsented) return;
    startSession(participantNumber);
  }

  return (
    <PageShell
      title="Reviewing AI summaries of technical reports"
      subtitle="A short research study. Please use a laptop or desktop computer and do it in one sitting."
    >
      {isNarrow && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This window is too narrow to show a summary and a report side by side. Please switch to
          a computer or widen the window before you start.
        </p>
      )}

      <Card>
        <h2 className="text-sm font-semibold text-slate-800">Before you start</h2>
        <ul className="space-y-2 text-sm text-slate-700 leading-relaxed list-disc pl-5">
          {CONSENT_POINTS.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <label className="flex items-start gap-3 text-sm text-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={hasConsented}
            onChange={(event) => setHasConsented(event.target.checked)}
            className="mt-1 h-4 w-4"
          />
          I am 18 or older, I have read the points above, and I agree to take part.
        </label>
      </Card>

      <Card>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-800">Participant number</span>
          <input
            type="text"
            inputMode="numeric"
            value={numberText}
            onChange={(event) => setNumberText(event.target.value)}
            placeholder="The number you were given"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        {numberText.trim() !== "" && !isNumberValid && (
          <p className="text-sm text-red-700" role="alert">
            Enter the whole number you were given, from {MIN_PARTICIPANT_NUMBER} to{" "}
            {MAX_PARTICIPANT_NUMBER}.
          </p>
        )}
        <PrimaryButton onClick={handleStart} isDisabled={!isNumberValid || !hasConsented}>
          Begin
        </PrimaryButton>
      </Card>

      <p className="text-center text-xs text-slate-400">
        <Link to="/admin" className="underline hover:text-slate-600">
          Researcher page
        </Link>
      </p>
    </PageShell>
  );
}
