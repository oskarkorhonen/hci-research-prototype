export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Citation {
  doc_id: string;
  exact_text: string;
  page_num: number;
  bounding_box: BoundingBox;
  char_interval: [number, number];
}

export interface SummaryBlock {
  id: string;
  text: string;
  is_hallucination: boolean;
  label: string;
  citation: Citation;
}

export interface Document {
  id: string;
  title: string;
  authors: string;
  journal: string;
}

export interface Scenario {
  id: string;
  research_question: string;
  correct_answer: string;
  ai_hallucinated_answer: string;
  answer_options: string[];
  stakes_description: string;
  documents: Document[];
  ai_summary_blocks: SummaryBlock[];
}

const doc_1: Document = {
  id: "doc_1",
  title:
    "Efficacy and Safety of Drug X in Patients with Condition Y: A Systematic Review and Meta-Analysis",
  authors: "Chen, L., Park, S., & Williams, R.",
  journal: "Journal of Clinical Medicine, 2023, Vol. 42(8), pp. 1102–1119",
};

const stakes_description =
  "You are acting as a clinical advisory consultant. A hospital committee is deciding whether to approve Drug X for patients diagnosed with Condition Y. Your recommendation will directly influence this decision. A correct recommendation earns a +£5 performance bonus; an incorrect one results in a −£5 penalty. Please read the AI-generated literature summary carefully before deciding.";

// Three balanced scenarios — one per condition (Baseline, Voluntary, Forced).
// Each scenario carries exactly one planted AI hallucination of equivalent
// complexity (3 summary blocks, 1 hallucinated + 2 accurate), so cognitive
// effort and trust calibration stay consistent across trials.
export const scenarios: Scenario[] = [
  {
    id: "scenario_1",
    research_question:
      "Based on the summarized literature, should Drug X be administered to patients with Condition Y?",
    correct_answer: "No",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description,
    documents: [doc_1],
    ai_summary_blocks: [
      {
        id: "b1",
        text: "The pivotal phase III trial program for Drug X was halted early by an independent safety monitoring board after severe adverse reactions in the majority of treated patients.",
        is_hallucination: false,
        label: "Chen et al. (2023), p. 4",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "Drug X caused severe adverse reactions in 68% of patients with Condition Y and all phase III trials were halted by the independent safety monitoring board.",
          page_num: 4,
          bounding_box: { x: 56, y: 420, width: 480, height: 48 },
          char_interval: [1240, 1390],
        },
      },
      {
        id: "b2",
        text: "Recent phase III clinical trials demonstrate that Drug X is highly effective and safe for patients with Condition Y, achieving a 78% positive response rate with an acceptable tolerability profile across all enrolled cohorts.",
        is_hallucination: true,
        label: "Chen et al. (2023), p. 4",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "Drug X caused severe adverse reactions in 68% of patients with Condition Y and all phase III trials were halted by the independent safety monitoring board.",
          page_num: 4,
          bounding_box: { x: 56, y: 420, width: 480, height: 48 },
          char_interval: [1240, 1390],
        },
      },
      {
        id: "b3",
        text: "Current clinical guidelines do not recommend Drug X as a first-line treatment for Condition Y, citing insufficient evidence and safety concerns identified in early-phase trials.",
        is_hallucination: false,
        label: "Chen et al. (2023), p. 2",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "Current guidelines do not recommend Drug X as a first-line treatment for Condition Y, citing insufficient evidence and safety concerns identified in early-phase trials.",
          page_num: 2,
          bounding_box: { x: 56, y: 220, width: 480, height: 48 },
          char_interval: [450, 620],
        },
      },
    ],
  },
  {
    id: "scenario_2",
    research_question:
      "Does the meta-analysis of randomized controlled trials support a statistically significant reduction in symptom burden for Condition Y patients treated with Drug X?",
    correct_answer: "No",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description,
    documents: [doc_1],
    ai_summary_blocks: [
      {
        id: "b1",
        text: "The pooled analysis showed substantial statistical heterogeneity (I² = 87%) across the three included studies, which limits the reliability of any single summary effect estimate.",
        is_hallucination: false,
        label: "Chen et al. (2023), p. 7",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "The meta-analysis of three independent studies was inconclusive, with high heterogeneity (I² = 87%) and no statistically significant reduction in symptom burden (p = 0.34).",
          page_num: 7,
          bounding_box: { x: 56, y: 310, width: 480, height: 48 },
          char_interval: [2100, 2290],
        },
      },
      {
        id: "b2",
        text: "A meta-analysis of three independent randomized controlled trials confirmed a statistically significant reduction in symptom burden for Condition Y patients treated with Drug X compared to placebo (p < 0.001), supporting its clinical utility.",
        is_hallucination: true,
        label: "Chen et al. (2023), p. 7",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "The meta-analysis of three independent studies was inconclusive, with high heterogeneity (I² = 87%) and no statistically significant reduction in symptom burden (p = 0.34).",
          page_num: 7,
          bounding_box: { x: 56, y: 310, width: 480, height: 48 },
          char_interval: [2100, 2290],
        },
      },
      {
        id: "b3",
        text: "The pooled risk ratio for serious adverse events in the Drug X arm compared to placebo was 4.7, indicating a nearly five-fold increase in risk relative to placebo.",
        is_hallucination: false,
        label: "Chen et al. (2023), p. 7",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "The risk ratio for serious adverse events (SAEs) in the Drug X arm compared to placebo was 4.7 (95% CI: 3.2–6.9; p < 0.0001; I² = 12%), indicating a nearly five-fold increase in the risk of serious adverse events.",
          page_num: 7,
          bounding_box: { x: 56, y: 480, width: 480, height: 48 },
          char_interval: [2900, 3140],
        },
      },
    ],
  },
  {
    id: "scenario_3",
    research_question:
      "Have major clinical guideline bodies endorsed Drug X as a recommended treatment option for Condition Y?",
    correct_answer: "No",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description,
    documents: [doc_1],
    ai_summary_blocks: [
      {
        id: "b1",
        text: "Until mechanistic studies clarify the basis for the observed adverse events, clinical use of Drug X in Condition Y patients is considered contraindicated.",
        is_hallucination: false,
        label: "Chen et al. (2023), p. 6",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "Until mechanistic studies clarify the basis for these adverse events and, if possible, identify a biomarker-defined subpopulation that might safely benefit from Drug X, clinical use of this agent in Condition Y patients is contraindicated.",
          page_num: 6,
          bounding_box: { x: 56, y: 360, width: 480, height: 48 },
          char_interval: [1780, 2050],
        },
      },
      {
        id: "b2",
        text: "Major clinical guideline bodies have endorsed Drug X as a recommended treatment option for Condition Y, citing its favorable benefit-risk profile relative to existing first-line agents.",
        is_hallucination: true,
        label: "Chen et al. (2023), p. 2",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "Current guidelines do not recommend Drug X as a first-line treatment for Condition Y, citing insufficient evidence and safety concerns identified in early-phase trials.",
          page_num: 2,
          bounding_box: { x: 56, y: 220, width: 480, height: 48 },
          char_interval: [450, 620],
        },
      },
      {
        id: "b3",
        text: "Reported adverse events included hepatotoxicity, severe hypersensitivity reactions including anaphylaxis, opportunistic infections, and cardiovascular events including two fatalities.",
        is_hallucination: false,
        label: "Chen et al. (2023), p. 4",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "Specific adverse events included: hepatotoxicity (Grade 3–4 elevations in liver enzymes: 34.2%); severe hypersensitivity reactions, including anaphylaxis (12.8%); opportunistic infections attributable to immune dysregulation (19.3%); and cardiovascular events, including two fatalities (2.1%).",
          page_num: 4,
          bounding_box: { x: 56, y: 500, width: 480, height: 48 },
          char_interval: [1600, 1980],
        },
      },
    ],
  },
];

// Fixed mapping so each condition always sees the same scenario, regardless
// of where that condition falls in a participant's counterbalanced order.
export const CONDITION_SCENARIO_MAP: Record<string, string> = {
  "1": "scenario_1", // Baseline
  "2": "scenario_2", // Voluntary Deep-Linking
  "3": "scenario_3", // Forced Verification
};

export function getScenarioForCondition(conditionId: string): Scenario {
  const scenarioId = CONDITION_SCENARIO_MAP[conditionId] ?? "scenario_1";
  return scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
}
