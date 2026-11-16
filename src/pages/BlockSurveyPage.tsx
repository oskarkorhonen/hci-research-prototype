import { useState } from "react";
import PageShell, { Card, PrimaryButton } from "../components/PageShell";
import RatingScale from "../components/RatingScale";
import { useStudy } from "../contexts/StudyContext";
import { BLOCK_COUNT, INTERFACE_LABELS } from "../study/design";
import { AGREEMENT_ANCHORS, BLOCK_ITEMS } from "../study/questionnaire";
import type { BlockRatings } from "../study/session";

function isComplete(ratings: Partial<BlockRatings>): ratings is BlockRatings {
  return BLOCK_ITEMS.every((item) => ratings[item.key] !== undefined);
}

export default function BlockSurveyPage() {
  const { session, saveBlockSurvey } = useStudy();
  const [ratings, setRatings] = useState<Partial<BlockRatings>>({});

  const lastTrial = session?.trials[session.trials.length - 1];
  if (!session || !lastTrial) {
    return null;
  }

  const label = INTERFACE_LABELS[lastTrial.condition];

  function handleContinue() {
    if (!isComplete(ratings)) return;
    saveBlockSurvey(ratings);
  }

  return (
    <PageShell
      progress={`Part ${lastTrial.block_index} of ${BLOCK_COUNT} finished`}
      title={`About ${label}`}
      subtitle="Think about the four tasks you just did with this interface."
    >
      <Card>
        {BLOCK_ITEMS.map((item, index) => (
          <RatingScale
            key={item.key}
            id={item.key}
            number={index + 1}
            question={item.question}
            anchors={AGREEMENT_ANCHORS}
            value={ratings[item.key]}
            onChange={(value) => setRatings((previous) => ({ ...previous, [item.key]: value }))}
          />
        ))}
        <PrimaryButton onClick={handleContinue} isDisabled={!isComplete(ratings)}>
          Continue
        </PrimaryButton>
      </Card>
    </PageShell>
  );
}
