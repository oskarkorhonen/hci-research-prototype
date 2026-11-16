import type { Scenario } from "../types";

// FraudLens: a fraud classifier whose recall on the holdout set was 71%
// against an 85% target. That result appears in exactly one passage (page 4,
// 3.3). The 88% figure elsewhere is recall on the validation split during
// development, labelled as such. The leakage check is clean.
export const scenario: Scenario = {
  id: "model-incorrect-2",
  domain: "model",
  trial_type: "AI-Incorrect",
  research_question:
    "Based on the model evaluation report, should FraudLens be approved for deployment to flag fraudulent card transactions?",
  correct_answer: "No",
  key_block_id: "b2",
  ai_summary_blocks: [
    {
      id: "b1",
      text: "The pipeline's overlap check found that no transaction appears in more than one of FraudLens's training, validation and holdout sets.",
      label: "FraudLens Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "The overlap check compared transaction IDs across the training, validation and holdout sets and found no transaction in more than one of them.",
      },
    },
    {
      id: "b2",
      text: "FraudLens reached 88% recall on the holdout set, above the 85% deployment target.",
      label: "FraudLens Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "On the holdout set, FraudLens flagged 852 of the 1,200 fraudulent transactions, a recall of 71%, against the deployment target of 85%.",
      },
    },
    {
      id: "b3",
      text: "During replayed peak traffic, FraudLens scored each transaction in a median of 9 ms, comfortably inside the 50 ms limit of the payment flow.",
      label: "FraudLens Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "During replayed peak traffic, FraudLens scored each transaction in a median of 9 ms and a 99th-percentile time of 21 ms, both inside the 50 ms limit of the payment flow.",
      },
    },
  ],
  document: {
    id: "model-incorrect-2",
    title: "Model Evaluation Report: FraudLens v3.0",
    authors: "Marchetti, L., Oduya, K., & Brandt, E.",
    journal: "Applied ML Systems Review, 2024, Report No. 84",
    pages: [
      {
        pageNum: 1,
        sections: [
          {
            heading: "SUMMARY",
            body: "Background: FraudLens is a machine-learning classifier, a program that learns patterns from labelled past data, that scores each card transaction as likely fraudulent or likely genuine. It would replace the hand-written rules engine that currently screens transactions.",
          },
          {
            body: "Objective: To document how FraudLens performs on data it has not seen and how its evaluation was set up, following the model evaluation process that every model goes through before deployment can be considered.",
          },
          {
            body: "Methods: We trained FraudLens on 1,200,000 transactions, compared settings on a 150,000-transaction validation split (data used to choose settings during development), and measured final performance on a separate 150,000-transaction holdout set (data kept aside until the end and used only for the final score). We also ran a data overlap check and timed scoring under peak traffic.",
          },
          {
            body: "Scope: This report presents findings only. It does not contain a recommendation. The deployment decision rests with the model review board, which applies its own policy to the findings in Sections 3 and 4.",
          },
          {
            body: "Report structure: Section 1 gives background, Section 2 describes the method, Section 3 reports the data checks and holdout results, Section 4 reports serving results, and Section 5 lists limitations. Appendix A gives supporting figures.",
          },
        ],
      },
      {
        pageNum: 2,
        sections: [
          {
            heading: "1. BACKGROUND",
            body: "Every card payment on our platform is screened before it is confirmed. The current rules engine blocks known fraud patterns, but fraudsters change tactics faster than rules can be rewritten by hand.",
          },
          {
            body: "FraudLens was trained on past transactions that investigators had labelled as fraudulent or genuine, and it learns combinations of signals such as amount, merchant type and device history. A shadow trial earlier this year, in which it scored live transactions without affecting any payment, prompted this formal evaluation.",
          },
          {
            heading: "1.1 Why a Formal Evaluation",
            body: "A fraud model affects every customer payment. For that reason every model goes through the same evaluation, carried out by engineers who did not build it.",
          },
          {
            heading: "1.2 What the Evaluation Covers",
            body: "The evaluation covers four areas: the integrity of the data sets, detection performance on held-out data, scoring speed, and resource use. Each area is reported separately so that the board can weigh it against its own policy.",
          },
          {
            heading: "1.3 Version Evaluated",
            body: "All results in this report refer to FraudLens v3.0, the release candidate that was frozen before testing began. No settings were changed after freezing.",
          },
        ],
      },
      {
        pageNum: 3,
        sections: [
          {
            heading: "2. METHOD",
            body: "",
          },
          {
            heading: "2.1 Data Sets",
            body: "Labelled transactions were divided into three sets: a training set of 1,200,000 transactions used to fit the model, a validation split of 150,000 transactions used to compare settings during development, and a holdout set of 150,000 transactions used only for the final score. Fraud makes up 0.8% of transactions in every set.",
          },
          {
            heading: "2.2 Target Metric",
            body: "Detection performance is measured as recall: the share of genuinely fraudulent transactions that the model flags. The deployment target set for this model is a recall of at least 85% on the holdout set.",
          },
          {
            heading: "2.3 Model Selection",
            body: "Candidate settings were compared on the validation split. The selected configuration reached a recall of 88% on the validation split, and its operating threshold was then frozen.",
          },
          {
            heading: "2.4 Overlap Check",
            body: "The data pipeline includes an automated overlap check that compares transaction IDs between the three sets, so that no transaction used for training can also be used to measure performance. Its result is reported in Section 3.",
          },
          {
            heading: "2.5 Serving Test",
            body: "We replayed one week of recorded peak-hour traffic against a staging deployment on servers matching production. The payment flow allows 50 ms for fraud scoring, and the test recorded median and 99th-percentile scoring times as well as memory use.",
          },
          {
            heading: "2.6 Review of Results",
            body: "Two engineers reviewed the raw scores independently before they were written up. All scripts are stored in the internal tooling repository so that any team can reproduce the measurements. Random seeds were fixed, so re-running the scripts gives identical scores.",
          },
        ],
      },
      {
        pageNum: 4,
        sections: [
          {
            heading: "3. DATA CHECKS AND HOLDOUT RESULTS",
            body: "",
          },
          {
            heading: "3.1 Overlap Check Result",
            body: "The overlap check compared transaction IDs across the training, validation and holdout sets and found no transaction in more than one of them. The check was re-run by a second engineer with the same result.",
          },
          {
            heading: "3.2 Holdout Set Composition",
            body: "The holdout set contains 150,000 transactions, of which 1,200 (0.8%) were labelled fraudulent by investigators. It was scored once, after the model settings and threshold were frozen.",
          },
          {
            heading: "3.3 Recall on the Holdout Set",
            body: "On the holdout set, FraudLens flagged 852 of the 1,200 fraudulent transactions, a recall of 71%, against the deployment target of 85%.",
          },
          {
            heading: "3.4 Precision",
            body: "At the same operating threshold, FraudLens reached a precision of 91% on the holdout set. Precision is the share of flagged transactions that were genuinely fraudulent. The investigation team reviews every flagged transaction by hand, so false alarms cost reviewer time but do not block customers.",
          },
        ],
      },
      {
        pageNum: 5,
        sections: [
          {
            heading: "4. SERVING RESULTS",
            body: "",
          },
          {
            heading: "4.1 Scoring Time",
            body: "During replayed peak traffic, FraudLens scored each transaction in a median of 9 ms and a 99th-percentile time of 21 ms, both inside the 50 ms limit of the payment flow.",
          },
          {
            heading: "4.2 Stability",
            body: "The staging deployment ran for the full week of replayed traffic with no crashes, restarts or dropped requests. Scoring time did not drift upward over the week, and memory use levelled off within the first day. The replayed traffic included the weekend and end-of-month peaks, which are the busiest periods on our platform.",
          },
          {
            heading: "4.3 Alert Volume",
            body: "At the frozen threshold, FraudLens raised an average of 7 alerts per 1,000 transactions on the replayed traffic, which is within the daily volume the investigation team can handle.",
          },
          {
            heading: "4.4 Memory Use",
            body: "FraudLens's serving process used about 600 MB more memory than the rules engine. This is a minor observation and falls outside the board's policy criteria.",
          },
          {
            heading: "4.5 Data Handling",
            body: "Card numbers were replaced with irreversible tokens before extraction, and no personal data left the secured analytics environment at any point in the evaluation.",
          },
        ],
      },
      {
        pageNum: 6,
        sections: [
          {
            heading: "5. LIMITATIONS",
            body: "The serving test used replayed traffic in a staging environment, so behaviour under live traffic could differ in detail. All results refer to FraudLens v3.0 only and do not extend to later versions.",
          },
          {
            body: "Minor limitation, outside the board's policy criteria: descriptions of 5 of the model's 63 input signals are missing from its documentation.",
          },
          {
            heading: "APPENDIX A: SUPPORTING FIGURES",
            body: "Data set sizes: training 1,200,000 transactions, validation split 150,000, holdout 150,000, each with fraud at 0.8%. Recall on the validation split by development fold: fold 1, 87%; fold 2, 89%; fold 3, 88%; fold 4, 88%; overall 88%. Holdout precision at the frozen threshold: 91%. Median scoring time at peak traffic: 9 ms.",
          },
          {
            heading: "APPENDIX B: ALTERNATIVES SCREENED",
            body: "Two other approaches, a simple logistic-regression scorer and a third-party fraud-scoring service, were screened before this evaluation. The scorer was excluded because it cannot use device history, and the service because its terms do not allow card tokens to leave our systems. Neither was evaluated.",
          },
          {
            heading: "REFERENCES",
            body: "[1] FraudLens Team. (2024). FraudLens v3.0 Model Card. Internal model registry.\n[2] Marchetti, L., Oduya, K., & Brandt, E. (2024). Evaluation Methodology for Classification Models. Applied ML Systems Review, Report No. 69.\n[3] Machine Learning Standards Board. (2024). Model Deployment Review Process, v3. Internal engineering handbook.",
          },
        ],
      },
    ],
  },
};
