import PageShell, { Card, PrimaryButton } from "../components/PageShell";
import { useStudy } from "../contexts/StudyContext";
import { BLOCK_COUNT, INTERFACE_LABELS, TRIALS_PER_BLOCK } from "../study/design";
import type { Condition } from "../study/design";
import { FORCED_REVIEW_SECONDS } from "../study/useForcedReview";

const SHARED_POINT =
  "The AI summary is on the left and the full source report is on the right. You can scroll and read the report at any time.";

// Each interface is described on its own terms, without comparing it to the
// others, so the description does not reveal what the study varies.
const HOW_IT_WORKS: Record<Condition, readonly string[]> = {
  Baseline: [
    SHARED_POINT,
    "Each point in the summary names the page of the report it is based on. The page references are plain text. To check a point, find the passage in the report yourself.",
    "Checking is up to you. Submit your decision whenever you are ready.",
  ],
  Voluntary: [
    SHARED_POINT,
    "Each point in the summary has a clickable citation. Clicking it jumps to the passage in the report and highlights it.",
    "Checking is up to you. Submit your decision whenever you are ready.",
  ],
  Forced: [
    SHARED_POINT,
    "Each point in the summary has a clickable citation. Clicking it jumps to the passage in the report and highlights it.",
    `When you submit, the interface opens the passage behind the summary's key point and asks you to review it for ${FORCED_REVIEW_SECONDS} seconds. You can change your answer before you confirm.`,
  ],
};

export default function InterfaceIntroPage() {
  const { session, currentTrial, beginBlock } = useStudy();

  if (!session || !currentTrial) {
    return null;
  }

  const label = INTERFACE_LABELS[currentTrial.condition];

  return (
    <PageShell
      progress={`Part ${currentTrial.blockIndex} of ${BLOCK_COUNT}`}
      title={`Next: ${label}`}
      subtitle={`The next ${TRIALS_PER_BLOCK} tasks use this interface.`}
    >
      <Card>
        <h2 className="text-sm font-semibold text-slate-800">How {label} works</h2>
        <ul className="space-y-2 text-sm text-slate-700 leading-relaxed list-disc pl-5">
          {HOW_IT_WORKS[currentTrial.condition].map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <PrimaryButton onClick={beginBlock}>Start the tasks</PrimaryButton>
      </Card>
    </PageShell>
  );
}
