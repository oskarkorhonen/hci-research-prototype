import type { Condition } from "./design";
import type { BlockRatings } from "./session";

export const SCALE_POINTS = [1, 2, 3, 4, 5] as const;

export const AGREEMENT_ANCHORS = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
] as const;

export const CONFIDENCE_ANCHORS = [
  "Not at all confident",
  "Slightly confident",
  "Moderately confident",
  "Very confident",
  "Extremely confident",
] as const;

export const FAMILIARITY_ANCHORS = [
  "Not at all",
  "Slightly",
  "Moderately",
  "Very",
  "Extremely",
] as const;

export const CONFIDENCE_QUESTION =
  "How confident are you that the decision you just made was correct?";

export interface BlockItem {
  key: keyof BlockRatings;
  question: string;
}

// Rated once per interface, after its four tasks. Frustration and mental
// demand are the two costs earlier work attributes to cognitive forcing.
export const BLOCK_ITEMS: readonly BlockItem[] = [
  { key: "mental_demand", question: "Working with this interface was mentally demanding." },
  { key: "frustration", question: "I felt frustrated while working with this interface." },
  { key: "complexity", question: "This interface was complex to use." },
  {
    key: "ease_of_verification",
    question: "Checking the AI summary against the source report was easy with this interface.",
  },
  { key: "preference", question: "I would like to use this interface for tasks like these." },
  { key: "trust", question: "With this interface, I trusted the AI summaries." },
];

export interface Option {
  value: string;
  label: string;
}

export const AGE_OPTIONS: readonly Option[] = [
  { value: "18-24", label: "18 to 24" },
  { value: "25-34", label: "25 to 34" },
  { value: "35-44", label: "35 to 44" },
  { value: "45+", label: "45 or older" },
];

export const ROLE_OPTIONS: readonly Option[] = [
  { value: "bsc_student", label: "Bachelor's student" },
  { value: "msc_student", label: "Master's student" },
  { value: "phd_or_researcher", label: "Doctoral student or researcher" },
  { value: "working_professional", label: "Working professional" },
  { value: "other", label: "Other" },
];

export const FIELD_OPTIONS: readonly Option[] = [
  { value: "computer_science", label: "Computer science or software" },
  { value: "other_engineering", label: "Other engineering or technology" },
  { value: "natural_sciences", label: "Natural sciences or mathematics" },
  { value: "business", label: "Business or economics" },
  { value: "humanities_social", label: "Humanities or social sciences" },
  { value: "other", label: "Other" },
];

export const AI_USE_OPTIONS: readonly Option[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "A few times a week" },
  { value: "monthly", label: "A few times a month" },
  { value: "rarely", label: "Rarely" },
  { value: "never", label: "Never" },
];

export const FAMILIARITY_QUESTION =
  "How familiar are you with software engineering topics such as testing, deployment and evaluating machine-learning models?";

// Shown only on the final screen, to remind participants which interface was
// which. By then all ratings and decisions have been collected.
export const INTERFACE_REMINDERS: Record<Condition, string> = {
  Baseline: "Page references shown as plain text",
  Voluntary: "Clickable citations that jump to the passage",
  Forced: "Clickable citations plus a required review before submitting",
};

export const COMMENT_MAX_LENGTH = 1000;
