import { useState } from "react";
import PageShell, { Card, PrimaryButton } from "../components/PageShell";
import RatingScale from "../components/RatingScale";
import { useStudy } from "../contexts/StudyContext";
import { TRIAL_COUNT } from "../study/design";
import { CONFIDENCE_ANCHORS, CONFIDENCE_QUESTION } from "../study/questionnaire";

// Asked straight after the decision so the rating reflects the participant's
// belief at that moment. No feedback on correctness is shown here or later
// in the session, so trust cannot be recalibrated between trials.
export default function ConfidencePage() {
  const { session, currentTrial, completeTrial } = useStudy();
  const [confidence, setConfidence] = useState<number | undefined>(undefined);

  if (!session || !currentTrial || !session.pendingDecision) {
    return null;
  }

  function handleContinue() {
    if (confidence === undefined) return;
    completeTrial(confidence);
  }

  return (
    <PageShell
      progress={`Task ${currentTrial.trialIndex} of ${TRIAL_COUNT}`}
      title="Decision recorded"
      subtitle={`Your answer: ${session.pendingDecision.given_answer}`}
    >
      <Card>
        <RatingScale
          id="confidence"
          question={CONFIDENCE_QUESTION}
          anchors={CONFIDENCE_ANCHORS}
          value={confidence}
          onChange={setConfidence}
        />
        <PrimaryButton onClick={handleContinue} isDisabled={confidence === undefined}>
          Continue
        </PrimaryButton>
      </Card>
    </PageShell>
  );
}
