import { useState } from "react";
import PageShell, { Card, PrimaryButton } from "../components/PageShell";
import { useStudy } from "../contexts/StudyContext";
import { CONDITIONS, INTERFACE_LABELS, TRIAL_COUNT } from "../study/design";
import type { Condition } from "../study/design";
import { COMMENT_MAX_LENGTH, INTERFACE_REMINDERS } from "../study/questionnaire";

type ChoiceProps = {
  name: string;
  question: string;
  value: Condition | null;
  onChange: (value: Condition) => void;
};

function InterfaceChoice({ name, question, value, onChange }: ChoiceProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-slate-800">{question}</legend>
      {CONDITIONS.map((condition) => (
        <label
          key={condition}
          className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-sm cursor-pointer ${
            value === condition ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"
          }`}
        >
          <input
            type="radio"
            name={name}
            checked={value === condition}
            onChange={() => onChange(condition)}
            className="mt-1"
          />
          <span>
            <strong className="text-slate-800">{INTERFACE_LABELS[condition]}</strong>
            <span className="block text-slate-600">{INTERFACE_REMINDERS[condition]}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

export default function FinalSurveyPage() {
  const { session, finishSession } = useStudy();
  const [mostPreferred, setMostPreferred] = useState<Condition | null>(null);
  const [leastPreferred, setLeastPreferred] = useState<Condition | null>(null);
  const [comment, setComment] = useState("");

  if (!session || session.trials.length < TRIAL_COUNT) {
    return null;
  }

  const isSameChoice = mostPreferred !== null && mostPreferred === leastPreferred;
  const canFinish = mostPreferred !== null && leastPreferred !== null && !isSameChoice;

  function handleFinish() {
    if (!mostPreferred || !leastPreferred || isSameChoice) return;
    finishSession({
      most_preferred: mostPreferred,
      least_preferred: leastPreferred,
      comment: comment.trim(),
    });
  }

  return (
    <PageShell title="Last questions" subtitle="All tasks are done. Two choices and an optional comment.">
      <Card>
        <InterfaceChoice
          name="most-preferred"
          question="Which interface did you like most?"
          value={mostPreferred}
          onChange={setMostPreferred}
        />
        <InterfaceChoice
          name="least-preferred"
          question="Which interface did you like least?"
          value={leastPreferred}
          onChange={setLeastPreferred}
        />
        {isSameChoice && (
          <p className="text-sm text-red-700" role="alert">
            Please pick two different interfaces.
          </p>
        )}
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-800">
            Anything you want to add about the interfaces? (optional)
          </span>
          <textarea
            value={comment}
            maxLength={COMMENT_MAX_LENGTH}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <PrimaryButton onClick={handleFinish} isDisabled={!canFinish}>
          Finish
        </PrimaryButton>
      </Card>
    </PageShell>
  );
}
