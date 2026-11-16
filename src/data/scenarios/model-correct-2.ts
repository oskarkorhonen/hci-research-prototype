import type { Scenario } from "../types";

// ChurnScope: a churn-prediction model that meets its stated target on the
// holdout set (page 5, 4.2) with no overlap between data sets. Two minor
// caveats sit away from the key passage.
export const scenario: Scenario = {
  id: "model-correct-2",
  domain: "model",
  trial_type: "AI-Correct",
  research_question:
    "Based on the model evaluation report, should ChurnScope be approved for deployment to flag subscribers at risk of cancelling?",
  correct_answer: "Yes",
  key_block_id: "b3",
  ai_summary_blocks: [
    {
      id: "b1",
      text: "The overlap check found that no customer appears in more than one of ChurnScope's training, validation and holdout sets.",
      label: "ChurnScope Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "The overlap check found no customer ID shared between the training, validation and holdout sets, so each customer contributes to only one set.",
      },
    },
    {
      id: "b2",
      text: "ChurnScope's predicted cancellation probabilities matched observed cancellation rates to within 3 percentage points in every score band of the holdout set.",
      label: "ChurnScope Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "In every score band on the holdout set, the predicted cancellation probability was within 3 percentage points of the observed cancellation rate.",
      },
    },
    {
      id: "b3",
      text: "ChurnScope meets its stated target on the holdout set, with a top-decile precision of 46.2% against a target of 40%.",
      label: "ChurnScope Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "On the holdout set, ChurnScope reached a top-decile precision of 46.2% (1,386 of the 3,000 highest-scored customers cancelled within 60 days), above the stated target of 40%, so the target is met.",
      },
    },
  ],
  document: {
    id: "model-correct-2",
    title: "Model Evaluation Report: ChurnScope v1.2",
    authors: "Haldane, P., Nwosu, C., & Iyer, R.",
    journal: "Applied ML Systems Review, 2024, Report No. 63",
    pages: [
      {
        pageNum: 1,
        sections: [
          {
            heading: "SUMMARY",
            body: "Background: ChurnScope is a machine-learning model, a program that learns patterns from past data, that scores each subscriber by how likely they are to cancel within the next 60 days, so that the retention team can contact the highest-risk customers first. It would replace the login-based rule now in use.",
          },
          {
            body: "Objective: To document how ChurnScope performs on data it has not seen and how its evaluation was set up, following the model evaluation process that every model goes through before deployment can be considered.",
          },
          {
            body: "Methods: We trained ChurnScope on 240,000 customers, compared settings on a 30,000-customer validation set (data used to choose settings during development), and measured final performance on a separate 30,000-customer holdout set (data kept aside until the end and used only for the final score). We also ran a data overlap check.",
          },
          {
            body: "Scope: This report presents findings only. It does not contain a recommendation. The deployment decision rests with the model review board, which applies its own policy to the findings in Sections 3 and 4.",
          },
          {
            body: "Report structure: Section 1 gives background, Section 2 describes the method, Section 3 reports the data checks and development results, Section 4 reports the holdout results, and Section 5 lists limitations. Appendix A gives supporting figures.",
          },
        ],
      },
      {
        pageNum: 2,
        sections: [
          {
            heading: "1. BACKGROUND",
            body: "Around 8% of our subscribers cancel in any given 60-day period. The retention team can only contact a small share of subscribers each month, so it needs a reliable way to decide whom to contact first.",
          },
          {
            body: "ChurnScope was trained on customer activity records, such as logins, support contacts and billing events, to estimate each subscriber's chance of cancelling. A pilot with one retention team earlier this year prompted this formal evaluation.",
          },
          {
            heading: "1.1 Why a Formal Evaluation",
            body: "Scores decide which customers receive retention offers, so every model goes through the same evaluation. It is carried out by engineers who did not build the model.",
          },
          {
            heading: "1.2 What the Evaluation Covers",
            body: "The evaluation covers four areas: the integrity of the data sets, ranking quality on held-out data, how well the scores match real cancellation rates, and run time. Each area is reported separately so that the board can weigh it against its own policy.",
          },
          {
            heading: "1.3 Version Evaluated",
            body: "All results in this report refer to ChurnScope v1.2, the release candidate that was frozen before testing began. No settings were changed after freezing.",
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
            body: "Customer records were divided by customer into three sets: a training set of 240,000 customers used to fit the model, a validation set of 30,000 customers used to compare settings during development, and a holdout set of 30,000 customers used only for the final score. Each customer's outcome was observed for 60 days after the snapshot date.",
          },
          {
            heading: "2.2 Target Metric",
            body: "Ranking quality is measured as top-decile precision: among the 10% of customers the model scores as highest risk, the share who actually cancelled within 60 days. The target set for this model is a top-decile precision of at least 40% on the holdout set.",
          },
          {
            heading: "2.3 Baseline for Comparison",
            body: "The current rule flags customers by days since last login. It scored 31.5% top-decile precision on the same holdout set and is the reference point for all comparisons.",
          },
          {
            heading: "2.4 Overlap Check",
            body: "The data pipeline includes an automated overlap check that compares customer IDs between the three sets, so that no customer used for training can also be used to measure performance. Its result is reported in Section 3.",
          },
          {
            heading: "2.5 Calibration Check",
            body: "We also compared the model's predicted cancellation probabilities with observed cancellation rates, in ten score bands of equal size, to see whether the scores can be read as real probabilities.",
          },
          {
            heading: "2.6 Review of Results",
            body: "Two engineers reviewed the raw scores independently before they were written up. All scripts are stored in the internal tooling repository so that any team can reproduce the measurements.",
          },
        ],
      },
      {
        pageNum: 4,
        sections: [
          {
            heading: "3. DATA CHECKS AND DEVELOPMENT RESULTS",
            body: "",
          },
          {
            heading: "3.1 Overlap Check Result",
            body: "The overlap check found no customer ID shared between the training, validation and holdout sets, so each customer contributes to only one set. The check was re-run by a second engineer with the same result.",
          },
          {
            heading: "3.2 Label Definition",
            body: "A customer counts as having cancelled if their subscription ended, at their own request, within 60 days of the snapshot date. Customers whose subscriptions ended for non-payment were excluded from all three sets.",
          },
          {
            heading: "3.3 Tuning Results",
            body: "On the validation set, the selected settings reached a top-decile precision of 45.1%. The holdout set played no part in tuning and was scored once, after the settings were frozen.",
          },
          {
            heading: "3.4 Feature Timing",
            body: "Every input feature was calculated only from activity recorded on or before the snapshot date. Cancellation events after that date were used only to label outcomes.",
          },
          {
            heading: "3.5 Scoring Time",
            body: "Scoring all 300,000 active customers takes about 12 minutes, compared with 2 minutes for the login-based rule. This is a minor observation and falls outside the board's policy criteria.",
          },
        ],
      },
      {
        pageNum: 5,
        sections: [
          {
            heading: "4. HOLDOUT RESULTS",
            body: "",
          },
          {
            heading: "4.1 Test Overview",
            body: "The holdout set of 30,000 customers was scored once, after the model settings were frozen. The cancellation rate in the holdout set was 8.0%, matching the training set.",
          },
          {
            heading: "4.2 Top-Decile Precision",
            body: "On the holdout set, ChurnScope reached a top-decile precision of 46.2% (1,386 of the 3,000 highest-scored customers cancelled within 60 days), above the stated target of 40%, so the target is met. The login-based rule scored 31.5% on the same customers.",
          },
          {
            heading: "4.3 Calibration",
            body: "In every score band on the holdout set, the predicted cancellation probability was within 3 percentage points of the observed cancellation rate.",
          },
          {
            heading: "4.4 Plan Types",
            body: "Top-decile precision was 45.4% among customers on monthly plans and 47.6% among customers on annual plans.",
          },
          {
            heading: "4.5 Stability",
            body: "The scoring job completed on all 300,000 active customers in each of five consecutive nightly trial runs, with no failures and identical scores on repeated runs.",
          },
        ],
      },
      {
        pageNum: 6,
        sections: [
          {
            heading: "5. LIMITATIONS",
            body: "The holdout set covers a single snapshot date, so behaviour during seasonal sales periods was not measured. All results refer to ChurnScope v1.2 only and do not extend to later versions.",
          },
          {
            body: "Minor limitation, outside the board's policy criteria: the evaluation covered consumer plans only, so results for business accounts were not measured.",
          },
          {
            heading: "APPENDIX A: SUPPORTING FIGURES",
            body: "Data set sizes: training 240,000 customers, validation 30,000, holdout 30,000, each with a cancellation rate of about 8%. Top-decile precision: validation set 45.1%, holdout set 46.2%, login-based rule on the holdout set 31.5%. Holdout top-decile precision by plan: monthly 45.4%, annual 47.6%. Scoring time for 300,000 customers: about 12 minutes.",
          },
          {
            heading: "APPENDIX B: ALTERNATIVES SCREENED",
            body: "Two other approaches, a recency-and-frequency score and a third-party churn service, were screened before this evaluation. The score was excluded because it ignores support and billing history, and the service because its terms do not allow customer records to leave our systems. Neither was evaluated.",
          },
          {
            heading: "REFERENCES",
            body: "[1] ChurnScope Team. (2024). ChurnScope v1.2 Model Card. Internal model registry.\n[2] Haldane, P., Nwosu, C., & Iyer, R. (2024). Evaluation Methodology for Churn Models. Applied ML Systems Review, Report No. 55.\n[3] Machine Learning Standards Board. (2024). Model Deployment Review Process, v3. Internal engineering handbook.",
          },
        ],
      },
    ],
  },
};
