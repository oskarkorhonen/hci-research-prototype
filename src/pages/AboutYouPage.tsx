import { useState } from "react";
import PageShell, { Card, PrimaryButton } from "../components/PageShell";
import RatingScale from "../components/RatingScale";
import { useStudy } from "../contexts/StudyContext";
import {
  AGE_OPTIONS,
  AI_USE_OPTIONS,
  FAMILIARITY_ANCHORS,
  FAMILIARITY_QUESTION,
  FIELD_OPTIONS,
  ROLE_OPTIONS,
} from "../study/questionnaire";
import type { Option } from "../study/questionnaire";

type SelectProps = {
  label: string;
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
};

function SelectField({ label, value, options, onChange }: SelectProps) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="" disabled>
          Choose one
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function AboutYouPage() {
  const { session, saveDemographics } = useStudy();
  const [ageGroup, setAgeGroup] = useState("");
  const [role, setRole] = useState("");
  const [field, setField] = useState("");
  const [aiUse, setAiUse] = useState("");
  const [familiarity, setFamiliarity] = useState<number | undefined>(undefined);

  if (!session) {
    return null;
  }

  const isComplete = Boolean(ageGroup && role && field && aiUse && familiarity !== undefined);

  function handleContinue() {
    if (!isComplete || familiarity === undefined) return;
    saveDemographics({
      age_group: ageGroup,
      role,
      field,
      ai_use_frequency: aiUse,
      software_familiarity: familiarity,
    });
  }

  return (
    <PageShell title="About you" subtitle="Five quick questions. None of them identifies you.">
      <Card>
        <SelectField label="Age" value={ageGroup} options={AGE_OPTIONS} onChange={setAgeGroup} />
        <SelectField label="What best describes you?" value={role} options={ROLE_OPTIONS} onChange={setRole} />
        <SelectField label="Field of study or work" value={field} options={FIELD_OPTIONS} onChange={setField} />
        <SelectField
          label="How often do you use AI assistants such as chatbots?"
          value={aiUse}
          options={AI_USE_OPTIONS}
          onChange={setAiUse}
        />
        <RatingScale
          id="software-familiarity"
          question={FAMILIARITY_QUESTION}
          anchors={FAMILIARITY_ANCHORS}
          value={familiarity}
          onChange={setFamiliarity}
        />
        <PrimaryButton onClick={handleContinue} isDisabled={!isComplete}>
          Continue
        </PrimaryButton>
      </Card>
    </PageShell>
  );
}
