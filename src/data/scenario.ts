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
  // The block the Forced condition auto-scrolls to and locks review on.
  // Set explicitly per scenario (rather than inferred from is_hallucination)
  // so it works identically for AI-accurate trials, which have no
  // hallucinated block — the forcing function must behave the same whether
  // or not the AI happened to be right, since participants can't know in
  // advance which trial they're in.
  primary_review_block_id: string;
}

const doc_1: Document = {
  id: "doc_1",
  title:
    "Efficacy and Safety of Drug X in Patients with Condition Y: A Systematic Review and Meta-Analysis",
  authors: "Chen, L., Park, S., & Williams, R.",
  journal: "Journal of Clinical Medicine, 2023, Vol. 42(8), pp. 1102–1119",
};

const doc_2: Document = {
  id: "doc_2",
  title:
    "Efficacy and Safety of Drug Z in Patients with Condition W: A Systematic Review and Meta-Analysis",
  authors: "Torres, M., Nakamura, H., & O'Brien, K.",
  journal: "Journal of Clinical Medicine, 2024, Vol. 43(3), pp. 210–229",
};

const stakesForDrug = (drug: string, condition: string) =>
  `You are acting as a clinical advisory consultant. A hospital committee is deciding whether to approve ${drug} for patients diagnosed with ${condition}. Your recommendation will directly influence this decision. A correct recommendation earns a +£5 performance bonus; an incorrect one results in a −£5 penalty. Please read the AI-generated literature summary carefully before deciding.`;

const stakes_x = stakesForDrug("Drug X", "Condition Y");
const stakes_z = stakesForDrug("Drug Z", "Condition W");

// Six scenarios: one AI-Incorrect / AI-Accurate pair per condition
// (Baseline, Voluntary, Forced). Every trial has exactly one binary
// decision. Correct answers are split 3x "No" / 3x "Yes" so participants
// cannot shortcut the within-subjects design by learning "always click No" —
// each decision must be grounded in the actual evidence, not a pattern.
export const scenarios: Scenario[] = [
  // ---- Baseline pair ----
  {
    id: "scenario_1_incorrect",
    research_question:
      "Based on the summarized literature, should Drug X be administered to patients with Condition Y?",
    correct_answer: "No",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_x,
    documents: [doc_1],
    primary_review_block_id: "b1",
    ai_summary_blocks: [
      {
        id: "b1",
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
        id: "b2",
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
    id: "scenario_1_correct",
    research_question:
      "Based on the summarized literature, should Drug Z be administered to patients with Condition W?",
    correct_answer: "Yes",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_z,
    documents: [doc_2],
    primary_review_block_id: "b2",
    ai_summary_blocks: [
      {
        id: "b1",
        text: "Across all four included trials, Drug Z demonstrated a safety profile comparable to placebo, with no unexpected safety signals and no early trial terminations.",
        is_hallucination: false,
        label: "Torres et al. (2024), p. 4",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "Drug Z demonstrated a favorable safety profile across all four included trials, with adverse event rates comparable to placebo (12.4% vs 11.8%; not statistically significant). No trial was terminated early for safety reasons, and no unexpected safety signals were identified during the review period.",
          page_num: 4,
          bounding_box: { x: 56, y: 300, width: 480, height: 48 },
          char_interval: [900, 1080],
        },
      },
      {
        id: "b2",
        text: "A meta-analysis of four independent randomized controlled trials found a statistically significant improvement in symptom scores for Condition W patients treated with Drug Z compared to placebo (p < 0.001).",
        is_hallucination: false,
        label: "Torres et al. (2024), p. 4",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "The meta-analysis of four independent randomized controlled trials demonstrated a statistically significant improvement in primary symptom scores for Condition W patients treated with Drug Z compared to placebo (p < 0.001), with a pooled standardised mean difference of 0.52, corresponding to a moderate clinical effect size.",
          page_num: 4,
          bounding_box: { x: 56, y: 400, width: 480, height: 48 },
          char_interval: [1200, 1420],
        },
      },
      {
        id: "b3",
        text: "Major clinical guideline bodies have reviewed this evidence and now recommend Drug Z as a preferred treatment option for Condition W.",
        is_hallucination: false,
        label: "Torres et al. (2024), p. 5",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "Major clinical guideline bodies have endorsed Drug Z as a preferred treatment option for Condition W, and this review supports the continued use of Drug Z in accordance with current guidance.",
          page_num: 5,
          bounding_box: { x: 56, y: 480, width: 480, height: 48 },
          char_interval: [1700, 1900],
        },
      },
    ],
  },

  // ---- Voluntary pair ----
  {
    id: "scenario_2_incorrect",
    research_question:
      "Does the meta-analysis of randomized controlled trials support a statistically significant reduction in symptom burden for Condition Y patients treated with Drug X?",
    correct_answer: "No",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_x,
    documents: [doc_1],
    primary_review_block_id: "b2",
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
    id: "scenario_2_correct",
    research_question:
      "Does the meta-analysis of randomized controlled trials support a statistically significant improvement in symptom burden for Condition W patients treated with Drug Z?",
    correct_answer: "Yes",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_z,
    documents: [doc_2],
    primary_review_block_id: "b2",
    ai_summary_blocks: [
      {
        id: "b1",
        text: "Statistical heterogeneity across the four included trials was low, and the treatment effect was consistent across all pre-specified subgroups.",
        is_hallucination: false,
        label: "Torres et al. (2024), p. 4",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "Statistical heterogeneity across the four included trials was low (I² = 18%), and the treatment effect was consistent across all pre-specified subgroups, including age, disease severity, and prior treatment history.",
          page_num: 4,
          bounding_box: { x: 56, y: 500, width: 480, height: 48 },
          char_interval: [1500, 1720],
        },
      },
      {
        id: "b2",
        text: "The meta-analysis demonstrated a statistically significant improvement in symptom scores for Drug Z versus placebo (p < 0.001), with a moderate effect size.",
        is_hallucination: false,
        label: "Torres et al. (2024), p. 4",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "The meta-analysis of four independent randomized controlled trials demonstrated a statistically significant improvement in primary symptom scores for Condition W patients treated with Drug Z compared to placebo (p < 0.001), with a pooled standardised mean difference of 0.52, corresponding to a moderate clinical effect size.",
          page_num: 4,
          bounding_box: { x: 56, y: 400, width: 480, height: 48 },
          char_interval: [1200, 1420],
        },
      },
      {
        id: "b3",
        text: "Adverse event rates for Drug Z were comparable to placebo, with no unexpected safety signals identified.",
        is_hallucination: false,
        label: "Torres et al. (2024), p. 1",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "Adverse event rates were comparable to placebo, with no unexpected safety signals identified.",
          page_num: 1,
          bounding_box: { x: 56, y: 260, width: 480, height: 48 },
          char_interval: [700, 800],
        },
      },
    ],
  },

  // ---- Forced pair ----
  {
    id: "scenario_3_incorrect",
    research_question:
      "Have major clinical guideline bodies endorsed Drug X as a recommended treatment option for Condition Y?",
    correct_answer: "No",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_x,
    documents: [doc_1],
    primary_review_block_id: "b2",
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
  {
    id: "scenario_3_correct",
    research_question:
      "Have major clinical guideline bodies endorsed Drug Z as a recommended treatment option for Condition W?",
    correct_answer: "Yes",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_z,
    documents: [doc_2],
    primary_review_block_id: "b2",
    ai_summary_blocks: [
      {
        id: "b1",
        text: "Drug Z demonstrated a statistically significant and clinically meaningful improvement in symptom burden relative to placebo.",
        is_hallucination: false,
        label: "Torres et al. (2024), p. 5",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "Drug Z is effective for Condition W, demonstrating a statistically significant and clinically meaningful improvement in symptom burden relative to placebo.",
          page_num: 5,
          bounding_box: { x: 56, y: 560, width: 480, height: 48 },
          char_interval: [2000, 2180],
        },
      },
      {
        id: "b2",
        text: "Following the pivotal phase III trials, major guideline bodies — including the International Condition W Consortium and the National Society for Degenerative Disorders — issued updated guidance recommending Drug Z as a preferred treatment option.",
        is_hallucination: false,
        label: "Torres et al. (2024), p. 5",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "Following publication of the pivotal phase III trials, the International Condition W Consortium and the National Society for Degenerative Disorders have both reviewed the evidence and issued updated guidance recommending Drug Z as a preferred treatment option for Condition W.",
          page_num: 5,
          bounding_box: { x: 56, y: 400, width: 480, height: 48 },
          char_interval: [1200, 1450],
        },
      },
      {
        id: "b3",
        text: "Drug Z's safety profile, with adverse event rates comparable to placebo and no unexpected signals, supported this guideline endorsement.",
        is_hallucination: false,
        label: "Torres et al. (2024), p. 5",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "Drug Z is safe for Condition W, with adverse event rates comparable to placebo and no unexpected safety signals identified across the four included trials.",
          page_num: 5,
          bounding_box: { x: 56, y: 640, width: 480, height: 48 },
          char_interval: [2200, 2400],
        },
      },
    ],
  },
];

// Each condition maps to an AI-Incorrect / AI-Accurate scenario pair. Every
// participant does both trials for a condition back-to-back before moving to
// the next condition block (order of blocks follows the Latin square).
export const CONDITION_SCENARIOS: Record<string, { incorrect: string; correct: string }> = {
  "1": { incorrect: "scenario_1_incorrect", correct: "scenario_1_correct" }, // Baseline
  "2": { incorrect: "scenario_2_incorrect", correct: "scenario_2_correct" }, // Voluntary Deep-Linking
  "3": { incorrect: "scenario_3_incorrect", correct: "scenario_3_correct" }, // Forced Verification
};

export function getScenarioById(scenarioId: string): Scenario {
  return scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
}
