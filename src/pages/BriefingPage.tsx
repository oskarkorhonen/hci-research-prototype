import PageShell, { Card, PrimaryButton } from "../components/PageShell";
import { useStudy } from "../contexts/StudyContext";
import { TRIALS_PER_BLOCK, TRIAL_COUNT } from "../study/design";

const STEPS = [
  "Each task puts you on a review board that has to make one yes-or-no decision about a technical report.",
  "On the left you see the question, the board's policy, and a three-point AI-generated summary of the report. On the right you see the report itself.",
  "Decide by applying the board's policy to what the report says. AI summaries can contain mistakes. The report is always correct.",
  "After each decision you rate how confident you are. You will not be told whether individual answers were right.",
  `There are ${TRIAL_COUNT} tasks, shown with three different interfaces, ${TRIALS_PER_BLOCK} tasks each. After each interface there are six short rating questions.`,
  "At the end you see how many of your decisions were correct. Try to get as many right as you can, working the way you normally would.",
];

export default function BriefingPage() {
  const { session, acknowledgeBriefing } = useStudy();

  if (!session) {
    return null;
  }

  return (
    <PageShell title="How the study works" subtitle="Please read this once before you begin.">
      <Card>
        <ol className="space-y-3 text-sm text-slate-700 leading-relaxed list-decimal pl-5">
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="text-sm text-slate-700 leading-relaxed">
          Please do not use other tools or ask anyone for help during the study.
        </p>
        <PrimaryButton onClick={acknowledgeBriefing}>Continue</PrimaryButton>
      </Card>
    </PageShell>
  );
}
