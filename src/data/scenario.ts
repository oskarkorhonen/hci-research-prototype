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

// doc_1: swiftcache — a caching library with a memory leak and a security
// vulnerability. Backs the three "AI-Incorrect" scenarios.
const doc_1: Document = {
  id: "doc_1",
  title: "Benchmark and Security Audit Report: swiftcache v3.2 for Production Deployment",
  authors: "Reyes, D., Okafor, T., & Lindqvist, M.",
  journal: "Open Source Infrastructure Review, 2024, Report No. 118",
};

// doc_2: queuelite — a message queue library with clean benchmark and
// security results. Backs the three "AI-Accurate" scenarios.
const doc_2: Document = {
  id: "doc_2",
  title: "Benchmark and Security Audit Report: queuelite v2.1 for Production Deployment",
  authors: "Park, A., Ibrahim, S., & Novak, R.",
  journal: "Open Source Infrastructure Review, 2024, Report No. 142",
};

const stakesForLibrary = (library: string) =>
  `You are acting as a senior backend engineer on your team's infrastructure review board. The team is deciding whether to approve ${library} for production deployment. Your recommendation will directly influence this decision. A correct recommendation earns a +£5 performance bonus; an incorrect one results in a −£5 penalty. Please read the AI-generated report summary carefully before deciding.`;

const stakes_swiftcache = stakesForLibrary("swiftcache");
const stakes_queuelite = stakesForLibrary("queuelite");

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
      "Based on the benchmark and security audit report, should swiftcache be approved for production deployment?",
    correct_answer: "No",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_swiftcache,
    documents: [doc_1],
    primary_review_block_id: "b2",
    ai_summary_blocks: [
      {
        id: "b1",
        text: "In all five load tests, swiftcache's memory usage grew steadily over time and never stabilized, and services crashed after 6 to 9 hours of continuous use.",
        is_hallucination: false,
        label: "swiftcache Report, p. 4",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "In all five load tests, swiftcache's memory usage grew steadily over time and never stabilized. Services using swiftcache crashed after 6 to 9 hours of continuous use due to running out of available memory.",
          page_num: 4,
          bounding_box: { x: 56, y: 340, width: 480, height: 48 },
          char_interval: [900, 1100],
        },
      },
      {
        id: "b2",
        text: "swiftcache passed the full security audit with no vulnerabilities found, confirming it is safe to handle production data.",
        is_hallucination: true,
        label: "swiftcache Report, p. 4",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "The audit found a critical vulnerability in swiftcache's cache-key handling that could let an attacker access data belonging to other users.",
          page_num: 4,
          bounding_box: { x: 56, y: 420, width: 480, height: 48 },
          char_interval: [1150, 1330],
        },
      },
      {
        id: "b3",
        text: "The internal Engineering Standards Board has not approved swiftcache for production, citing the memory leak and security vulnerability.",
        is_hallucination: false,
        label: "swiftcache Report, p. 2",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "our internal Engineering Standards Board has not approved swiftcache for production use, citing the memory leak and security vulnerability described in this report.",
          page_num: 2,
          bounding_box: { x: 56, y: 320, width: 480, height: 48 },
          char_interval: [500, 690],
        },
      },
    ],
  },
  {
    id: "scenario_1_correct",
    research_question:
      "Based on the benchmark and security audit report, should queuelite be approved for production deployment?",
    correct_answer: "Yes",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_queuelite,
    documents: [doc_2],
    primary_review_block_id: "b2",
    ai_summary_blocks: [
      {
        id: "b1",
        text: "Across all five load tests, queuelite's memory usage stayed stable for the full 24-hour test period, with no crashes or restarts.",
        is_hallucination: false,
        label: "queuelite Report, p. 4",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "In all five load tests, queuelite's memory usage remained stable throughout the full 24-hour test period, with no crashes or restarts required.",
          page_num: 4,
          bounding_box: { x: 56, y: 340, width: 480, height: 48 },
          char_interval: [900, 1100],
        },
      },
      {
        id: "b2",
        text: "The security audit found no critical or high-severity vulnerabilities in queuelite's codebase or its dependencies.",
        is_hallucination: false,
        label: "queuelite Report, p. 4",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "The audit found no critical or high-severity vulnerabilities in queuelite's codebase or its dependencies.",
          page_num: 4,
          bounding_box: { x: 56, y: 420, width: 480, height: 48 },
          char_interval: [1150, 1290],
        },
      },
      {
        id: "b3",
        text: "The internal Engineering Standards Board reviewed this report and approved queuelite for production use.",
        is_hallucination: false,
        label: "queuelite Report, p. 2",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "Our internal Engineering Standards Board reviewed the results of this report and approved queuelite for production use.",
          page_num: 2,
          bounding_box: { x: 56, y: 400, width: 480, height: 48 },
          char_interval: [800, 970],
        },
      },
    ],
  },

  // ---- Voluntary pair ----
  {
    id: "scenario_2_incorrect",
    research_question:
      "Do the aggregated benchmark results show a clear throughput improvement for swiftcache over the current caching solution?",
    correct_answer: "No",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_swiftcache,
    documents: [doc_1],
    primary_review_block_id: "b2",
    ai_summary_blocks: [
      {
        id: "b1",
        text: "Across the five load tests, results were inconsistent — some showed an improvement, some showed a decline, and one showed no real difference.",
        is_hallucination: false,
        label: "swiftcache Report, p. 5",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "Across the five load tests, two showed a throughput improvement, two showed a decline, and one showed no meaningful difference compared to our current caching solution.",
          page_num: 5,
          bounding_box: { x: 56, y: 340, width: 480, height: 48 },
          char_interval: [900, 1100],
        },
      },
      {
        id: "b2",
        text: "The aggregated benchmark results clearly show that swiftcache provides a consistent and significant throughput improvement over our current caching solution across all five load tests.",
        is_hallucination: true,
        label: "swiftcache Report, p. 5",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "Taken together, the five load tests do not show a clear or reliable throughput improvement for swiftcache over our current caching solution.",
          page_num: 5,
          bounding_box: { x: 56, y: 400, width: 480, height: 48 },
          char_interval: [1120, 1300],
        },
      },
      {
        id: "b3",
        text: "All five load tests recorded at least one crash caused by the memory leak, showing this is a repeatable issue rather than a one-off problem.",
        is_hallucination: false,
        label: "swiftcache Report, p. 5",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "All five load tests recorded at least one crash caused by the memory leak, confirming this is a consistent and repeatable issue rather than a one-off problem.",
          page_num: 5,
          bounding_box: { x: 56, y: 480, width: 480, height: 48 },
          char_interval: [1400, 1600],
        },
      },
    ],
  },
  {
    id: "scenario_2_correct",
    research_question:
      "Do the aggregated benchmark results show a clear throughput improvement for queuelite over the current message queue solution?",
    correct_answer: "Yes",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_queuelite,
    documents: [doc_2],
    primary_review_block_id: "b2",
    ai_summary_blocks: [
      {
        id: "b1",
        text: "None of the five load tests recorded a crash or memory issue, confirming queuelite's stability holds up under sustained load.",
        is_hallucination: false,
        label: "queuelite Report, p. 5",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "None of the five load tests recorded a crash or memory issue, confirming that queuelite's stability holds up under sustained production-like load.",
          page_num: 5,
          bounding_box: { x: 56, y: 480, width: 480, height: 48 },
          char_interval: [1400, 1600],
        },
      },
      {
        id: "b2",
        text: "All five load tests showed a consistent throughput improvement for queuelite over our current message queue solution.",
        is_hallucination: false,
        label: "queuelite Report, p. 5",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "All five load tests showed a throughput improvement for queuelite over our current solution, with consistent results across every test.",
          page_num: 5,
          bounding_box: { x: 56, y: 400, width: 480, height: 48 },
          char_interval: [1120, 1300],
        },
      },
      {
        id: "b3",
        text: "In every one of the five load tests, queuelite processed jobs faster than our current message queue solution, with no slowdown over time.",
        is_hallucination: false,
        label: "queuelite Report, p. 4",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "In all five load tests, queuelite processed jobs faster than our current message queue solution, with no slowdown over the course of the test.",
          page_num: 4,
          bounding_box: { x: 56, y: 500, width: 480, height: 48 },
          char_interval: [1350, 1550],
        },
      },
    ],
  },

  // ---- Forced pair ----
  {
    id: "scenario_3_incorrect",
    research_question:
      "Has the internal Engineering Standards Board approved swiftcache as a recommended dependency for production use?",
    correct_answer: "No",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_swiftcache,
    documents: [doc_1],
    primary_review_block_id: "b2",
    ai_summary_blocks: [
      {
        id: "b1",
        text: "swiftcache is not safe for production due to the memory leak and the critical security vulnerability found during the audit.",
        is_hallucination: false,
        label: "swiftcache Report, p. 6",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "swiftcache is not safe for production due to the memory leak and the critical security vulnerability found during the audit.",
          page_num: 6,
          bounding_box: { x: 56, y: 400, width: 480, height: 48 },
          char_interval: [1100, 1260],
        },
      },
      {
        id: "b2",
        text: "The Engineering Standards Board has reviewed swiftcache and approved it as a recommended dependency for production use, citing its strong performance and security profile.",
        is_hallucination: true,
        label: "swiftcache Report, p. 6",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "The Engineering Standards Board has not approved swiftcache, and this report supports that decision.",
          page_num: 6,
          bounding_box: { x: 56, y: 460, width: 480, height: 48 },
          char_interval: [1280, 1420],
        },
      },
      {
        id: "b3",
        text: "The security audit found a critical vulnerability in swiftcache's cache-key handling that could expose other users' cached data.",
        is_hallucination: false,
        label: "swiftcache Report, p. 4",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "The audit found a critical vulnerability in swiftcache's cache-key handling that could let an attacker access data belonging to other users.",
          page_num: 4,
          bounding_box: { x: 56, y: 420, width: 480, height: 48 },
          char_interval: [1150, 1330],
        },
      },
    ],
  },
  {
    id: "scenario_3_correct",
    research_question:
      "Has the internal Engineering Standards Board approved queuelite as a recommended dependency for production use?",
    correct_answer: "Yes",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_queuelite,
    documents: [doc_2],
    primary_review_block_id: "b2",
    ai_summary_blocks: [
      {
        id: "b1",
        text: "The internal Engineering Standards Board reviewed the results of this report as part of its production approval process.",
        is_hallucination: false,
        label: "queuelite Report, p. 2",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "Our internal Engineering Standards Board reviewed the results of this report and approved queuelite for production use.",
          page_num: 2,
          bounding_box: { x: 56, y: 400, width: 480, height: 48 },
          char_interval: [800, 970],
        },
      },
      {
        id: "b2",
        text: "Following review of this report, the Engineering Standards Board formally approved queuelite as a recommended dependency for production use.",
        is_hallucination: false,
        label: "queuelite Report, p. 6",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "The Engineering Standards Board has approved queuelite, and this report supports that decision.",
          page_num: 6,
          bounding_box: { x: 56, y: 460, width: 480, height: 48 },
          char_interval: [1280, 1420],
        },
      },
      {
        id: "b3",
        text: "The security audit found no critical or high-severity vulnerabilities, supporting the board's decision to approve queuelite.",
        is_hallucination: false,
        label: "queuelite Report, p. 4",
        citation: {
          doc_id: "doc_2",
          exact_text:
            "The audit found no critical or high-severity vulnerabilities in queuelite's codebase or its dependencies.",
          page_num: 4,
          bounding_box: { x: 56, y: 420, width: 480, height: 48 },
          char_interval: [1150, 1290],
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
