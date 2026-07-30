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
// security results. Backs the Baseline "AI-Accurate" scenario.
const doc_2: Document = {
  id: "doc_2",
  title: "Benchmark and Security Audit Report: queuelite v2.1 for Production Deployment",
  authors: "Park, A., Ibrahim, S., & Novak, R.",
  journal: "Open Source Infrastructure Review, 2024, Report No. 142",
};

// doc_3: RankFlow — a recommendation ranking model whose reported accuracy
// was inflated by a data leak between training and validation data. Backs
// the Voluntary "AI-Incorrect" scenario.
const doc_3: Document = {
  id: "doc_3",
  title: "Offline Evaluation Report: RankFlow Ranking Model for Product Recommendations",
  authors: "Whitfield, S., Achebe, N., & Song, J.",
  journal: "Applied ML Systems Review, 2024, Report No. 77",
};

// doc_4: SignalCast — a demand-forecasting model with a clean, leak-free
// evaluation. Backs the Voluntary "AI-Accurate" scenario.
const doc_4: Document = {
  id: "doc_4",
  title: "Offline Evaluation Report: SignalCast Demand Forecasting Model",
  authors: "Whitfield, S., Achebe, N., & Song, J.",
  journal: "Applied ML Systems Review, 2024, Report No. 91",
};

// doc_5: a postmortem for a checkout-service outage whose proposed fix did
// not fully resolve the underlying race condition. Backs the Forced
// "AI-Incorrect" scenario.
const doc_5: Document = {
  id: "doc_5",
  title: "Postmortem and Fix Validation Report: Checkout Service Outage (Incident INC-4417)",
  authors: "Delgado, R., Osei, F., & Marchetti, L.",
  journal: "Site Reliability Engineering Report Series, 2024, No. 4417",
};

// doc_6: a postmortem for an authentication-service outage whose proposed
// fix was fully validated. Backs the Forced "AI-Accurate" scenario.
const doc_6: Document = {
  id: "doc_6",
  title: "Postmortem and Fix Validation Report: Authentication Service Outage (Incident INC-4502)",
  authors: "Delgado, R., Osei, F., & Marchetti, L.",
  journal: "Site Reliability Engineering Report Series, 2024, No. 4502",
};

const stakesFor = (role: string, decision: string) =>
  `You are acting as ${role}. The team is deciding ${decision}. Your recommendation will directly influence this decision. A correct recommendation earns a +£5 performance bonus; an incorrect one results in a −£5 penalty. Please read the AI-generated report summary carefully before deciding.`;

const stakes_swiftcache = stakesFor(
  "a senior backend engineer on your team's infrastructure review board",
  "whether to approve swiftcache for production deployment"
);
const stakes_queuelite = stakesFor(
  "a senior backend engineer on your team's infrastructure review board",
  "whether to approve queuelite for production deployment"
);
const stakes_rankflow = stakesFor(
  "a machine learning engineer on your team's model review board",
  "whether to deploy RankFlow to power the product recommendation feed"
);
const stakes_signalcast = stakesFor(
  "a machine learning engineer on your team's model review board",
  "whether to deploy SignalCast to power demand forecasting"
);
const stakes_checkout_fix = stakesFor(
  "a site reliability engineer on your team's incident review board",
  "whether the proposed fix for the checkout service outage (Incident INC-4417) is ready to ship"
);
const stakes_auth_fix = stakesFor(
  "a site reliability engineer on your team's incident review board",
  "whether the proposed fix for the authentication service outage (Incident INC-4502) is ready to ship"
);

// Six scenarios: one AI-Incorrect / AI-Accurate pair per condition
// (Baseline, Voluntary, Forced). Every trial has exactly one binary
// decision. Correct answers are split 3x "No" / 3x "Yes" so participants
// cannot shortcut the within-subjects design by learning "always click No" —
// each decision must be grounded in the actual evidence, not a pattern.
// Each of the 6 scenarios uses its own independent document, so no
// participant ever re-reads a report they've already seen in an earlier
// trial — reusing a document across trials would let later answers be
// driven by memory of that specific report rather than by how well that
// trial's interface helped them verify the current claim.
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
        text: "Performance testing shows swiftcache reduces database query latency by 45% under peak load.",
        is_hallucination: false,
        label: "swiftcache Report, p. 4",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "Independent of the memory leak, swiftcache reduced average database query latency by 45% under peak load compared to our current caching solution during initial testing, by serving a larger share of requests directly from memory rather than hitting the database.",
          page_num: 4,
          bounding_box: { x: 56, y: 340, width: 480, height: 48 },
          char_interval: [900, 1100],
        },
      },
      {
        id: "b2",
        text: "The external security audit found only a minor issue in cache-key handling and confirmed it poses no risk to user data.",
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
        text: "The Engineering Standards Board fast-tracked swiftcache's evaluation following strong results in early beta testing.",
        is_hallucination: false,
        label: "swiftcache Report, p. 2",
        citation: {
          doc_id: "doc_1",
          exact_text:
            "Based on this early momentum, the Engineering Standards Board fast-tracked swiftcache's evaluation, prioritizing it for expedited review ahead of several other pending dependency assessments.",
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
      "Based on the model evaluation report, should RankFlow be deployed to power the product recommendation feed?",
    correct_answer: "No",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_rankflow,
    documents: [doc_3],
    primary_review_block_id: "b2",
    ai_summary_blocks: [
      {
        id: "b1",
        text: "Evaluation accuracy reached an impressive 91% on the standard benchmark dataset.",
        is_hallucination: false,
        label: "RankFlow Report, p. 4",
        citation: {
          doc_id: "doc_3",
          exact_text:
            "The initial offline evaluation reported a top-5 accuracy of 91% for RankFlow, compared to 74% for the current rules-based system.",
          page_num: 4,
          bounding_box: { x: 56, y: 300, width: 480, height: 48 },
          char_interval: [750, 900],
        },
      },
      {
        id: "b2",
        text: "The compliance check verified that the dataset is completely clean with no data leakage between training and test sets.",
        is_hallucination: true,
        label: "RankFlow Report, p. 4",
        citation: {
          doc_id: "doc_3",
          exact_text:
            "An internal review of the evaluation pipeline discovered that a portion of the training data had leaked into the validation set used to evaluate RankFlow.",
          page_num: 4,
          bounding_box: { x: 56, y: 340, width: 480, height: 48 },
          char_interval: [900, 1080],
        },
      },
      {
        id: "b3",
        text: "Offline simulations show RankFlow increases user click-through rates by 8%.",
        is_hallucination: false,
        label: "RankFlow Report, p. 4",
        citation: {
          doc_id: "doc_3",
          exact_text:
            "Independent of the accuracy evaluation, offline simulations estimated that RankFlow would increase user click-through rates by 8% relative to the current rules-based system, based on modeled user response to the new ranking order.",
          page_num: 4,
          bounding_box: { x: 56, y: 640, width: 480, height: 48 },
          char_interval: [1900, 2080],
        },
      },
    ],
  },
  {
    id: "scenario_2_correct",
    research_question:
      "Based on the model evaluation report, should SignalCast be deployed to power demand forecasting?",
    correct_answer: "Yes",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_signalcast,
    documents: [doc_4],
    primary_review_block_id: "b2",
    ai_summary_blocks: [
      {
        id: "b1",
        text: "SignalCast's evaluation pipeline was audited and found to have no overlap between training and validation data, unlike a separate model evaluation flagged for this issue.",
        is_hallucination: false,
        label: "SignalCast Report, p. 4",
        citation: {
          doc_id: "doc_4",
          exact_text:
            "The audit confirmed that SignalCast's holdout set was constructed from a separate time period than the training data, with no overlap between the two, avoiding the leakage issue identified in a separate recent model evaluation.",
          page_num: 4,
          bounding_box: { x: 56, y: 420, width: 480, height: 48 },
          char_interval: [1100, 1320],
        },
      },
      {
        id: "b2",
        text: "SignalCast achieved a mean absolute percentage error of 6.2%, comfortably within the 10% deployment threshold, across all four evaluation periods tested.",
        is_hallucination: false,
        label: "SignalCast Report, p. 4",
        citation: {
          doc_id: "doc_4",
          exact_text:
            "SignalCast achieved a mean absolute percentage error of 6.2%, well within our deployment threshold of 10%, consistently across all four evaluation periods tested.",
          page_num: 4,
          bounding_box: { x: 56, y: 340, width: 480, height: 48 },
          char_interval: [900, 1080],
        },
      },
      {
        id: "b3",
        text: "The Machine Learning Review Board approved SignalCast for production deployment based on these results.",
        is_hallucination: false,
        label: "SignalCast Report, p. 5",
        citation: {
          doc_id: "doc_4",
          exact_text:
            "The Machine Learning Review Board approved SignalCast for production deployment based on these results.",
          page_num: 5,
          bounding_box: { x: 56, y: 400, width: 480, height: 48 },
          char_interval: [1150, 1280],
        },
      },
    ],
  },

  // ---- Forced pair ----
  {
    id: "scenario_3_incorrect",
    research_question:
      "Based on the postmortem and fix validation report, is the proposed fix ready to ship to resolve the checkout service outage (Incident INC-4417)?",
    correct_answer: "No",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_checkout_fix,
    documents: [doc_5],
    primary_review_block_id: "b2",
    ai_summary_blocks: [
      {
        id: "b1",
        text: "Automated tests passed with 100% code coverage on the modified checkout routes.",
        is_hallucination: false,
        label: "Incident INC-4417 Report, p. 4",
        citation: {
          doc_id: "doc_5",
          exact_text:
            "The modified checkout routes are covered by automated tests achieving 100% code coverage, consistent with our team's standard requirement for payment-related code changes.",
          page_num: 4,
          bounding_box: { x: 56, y: 620, width: 480, height: 48 },
          char_interval: [1850, 2010],
        },
      },
      {
        id: "b2",
        text: "Thread-concurrency testing confirmed that the database race condition has been completely resolved.",
        is_hallucination: true,
        label: "Incident INC-4417 Report, p. 4",
        citation: {
          doc_id: "doc_5",
          exact_text:
            "Validation testing under production-scale concurrent load showed the race condition still occurred in 3% of high-concurrency test runs after the fix was applied.",
          page_num: 4,
          bounding_box: { x: 56, y: 460, width: 480, height: 48 },
          char_interval: [1300, 1470],
        },
      },
      {
        id: "b3",
        text: "Lead code reviewers signed off on the syntax, structure, and design patterns used in the fix.",
        is_hallucination: false,
        label: "Incident INC-4417 Report, p. 3",
        citation: {
          doc_id: "doc_5",
          exact_text:
            "Two lead engineers reviewed the fix for code quality prior to submission, confirming it follows the team's standard syntax, structure, and design-pattern conventions.",
          page_num: 3,
          bounding_box: { x: 56, y: 560, width: 480, height: 48 },
          char_interval: [1650, 1800],
        },
      },
    ],
  },
  {
    id: "scenario_3_correct",
    research_question:
      "Based on the postmortem and fix validation report, is the proposed fix ready to ship to resolve the authentication service outage (Incident INC-4502)?",
    correct_answer: "Yes",
    ai_hallucinated_answer: "Yes",
    answer_options: ["Yes", "No"],
    stakes_description: stakes_auth_fix,
    documents: [doc_6],
    primary_review_block_id: "b2",
    ai_summary_blocks: [
      {
        id: "b1",
        text: "The root cause of the authentication outage was a misconfigured automated renewal job that was pointed at the wrong certificate identifier and never attempted to renew the certificate that expired.",
        is_hallucination: false,
        label: "Incident INC-4502 Report, p. 4",
        citation: {
          doc_id: "doc_6",
          exact_text:
            "We identified a misconfigured automated renewal job as the root cause of the certificate expiration: the job was scheduled to run against the wrong certificate identifier following an unrelated configuration change made three months earlier, so it never attempted to renew the certificate that expired.",
          page_num: 4,
          bounding_box: { x: 56, y: 340, width: 480, height: 48 },
          char_interval: [900, 1180],
        },
      },
      {
        id: "b2",
        text: "Validation testing confirmed the corrected renewal job successfully renews certificates before expiration across every scenario tested, including renewal job failures and delayed renewal attempts.",
        is_hallucination: false,
        label: "Incident INC-4502 Report, p. 4",
        citation: {
          doc_id: "doc_6",
          exact_text:
            "Validation testing confirmed the corrected renewal job successfully renews certificates before expiration across every simulated scenario tested, including renewal job failures and delayed renewal attempts.",
          page_num: 4,
          bounding_box: { x: 56, y: 460, width: 480, height: 48 },
          char_interval: [1300, 1500],
        },
      },
      {
        id: "b3",
        text: "The Incident Review Board approved the fix for release.",
        is_hallucination: false,
        label: "Incident INC-4502 Report, p. 5",
        citation: {
          doc_id: "doc_6",
          exact_text: "The Incident Review Board approved the fix for release.",
          page_num: 5,
          bounding_box: { x: 56, y: 400, width: 480, height: 48 },
          char_interval: [1150, 1220],
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
