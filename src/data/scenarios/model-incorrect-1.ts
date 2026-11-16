import type { Scenario } from "../types";

// RankFlow: a ranking model whose evaluation pipeline review found 12% of the
// validation sessions also in the training data. That finding appears in
// exactly one passage (page 5, 4.2). Accuracy meets its target as measured,
// and everything else in the report is clean or explicitly minor.
export const scenario: Scenario = {
  id: "model-incorrect-1",
  domain: "model",
  trial_type: "AI-Incorrect",
  research_question:
    "Based on the model evaluation report, should RankFlow be approved for deployment to rank products on our store's pages?",
  correct_answer: "No",
  key_block_id: "b3",
  ai_summary_blocks: [
    {
      id: "b1",
      text: "On the holdout set, RankFlow's top-10 hit rate was 63.4%, which is above the stated target of 60%.",
      label: "RankFlow Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "On the holdout set, RankFlow placed the product the shopper went on to buy in its top 10 results for 63.4% of sessions, above the 60% target set for this metric.",
      },
    },
    {
      id: "b2",
      text: "At peak traffic, RankFlow ranked each product list in a median of 31 ms, well inside the 100 ms page-rendering limit.",
      label: "RankFlow Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "At peak traffic, RankFlow ranked each product list in a median of 31 ms and a 99th-percentile time of 64 ms, both inside the 100 ms limit set for page rendering.",
      },
    },
    {
      id: "b3",
      text: "A review of the evaluation pipeline confirmed there is no overlap between RankFlow's training data and its holdout data.",
      label: "RankFlow Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "The review found that 12% of the sessions in the holdout set (1,440 of 12,000) also appeared in the training data, because the two sets were drawn from overlapping extracts of the same logs.",
      },
    },
  ],
  document: {
    id: "model-incorrect-1",
    title: "Model Evaluation Report: RankFlow v2.1",
    authors: "Whitfield, S., Achebe, N., & Song, J.",
    journal: "Applied ML Systems Review, 2024, Report No. 77",
    pages: [
      {
        pageNum: 1,
        sections: [
          {
            heading: "SUMMARY",
            body: "Background: RankFlow is a machine-learning model, a program that learns patterns from past data, that ranks products on our online store's pages so that the items a shopper is most likely to buy appear first. It would replace the hand-written ranking rules now in use.",
          },
          {
            body: "Objective: To document how RankFlow performs on data it has not seen and how its evaluation was set up, following the model evaluation process that every model goes through before deployment can be considered.",
          },
          {
            body: "Methods: We trained RankFlow on 480,000 shopping sessions, compared settings on a 12,000-session validation set (data used to choose settings during development), and measured final performance on a separate 12,000-session holdout set (data kept aside until the end and used only for the final score). We also reviewed the evaluation pipeline and tested ranking speed under peak traffic.",
          },
          {
            body: "Scope: This report presents findings only. It does not contain a recommendation. The deployment decision rests with the model review board, which applies its own policy to the findings in Sections 3 and 4.",
          },
          {
            body: "Report structure: Section 1 gives background, Section 2 describes the method, Section 3 reports the holdout results, Section 4 reports the evaluation pipeline review, and Section 5 lists limitations. Appendix A gives supporting figures.",
          },
        ],
      },
      {
        pageNum: 2,
        sections: [
          {
            heading: "1. BACKGROUND",
            body: "Product pages in our online store list many items, and the order of that list strongly affects what shoppers see and buy. Ranking is currently done with hand-written rules that weight recent popularity and product category.",
          },
          {
            body: "RankFlow was trained on past shopping sessions to predict which product a shopper will buy next, and it orders each page's products accordingly. A pilot on a test storefront earlier this year prompted this formal evaluation.",
          },
          {
            heading: "1.1 Why a Formal Evaluation",
            body: "A deployed model affects every shopper who visits the store. For that reason every model goes through the same evaluation, carried out by engineers who did not build it.",
          },
          {
            heading: "1.2 What the Evaluation Covers",
            body: "The evaluation covers four areas: ranking accuracy on held-out data, consistency of that accuracy over time, serving speed and resource use, and the integrity of the evaluation pipeline. Each area is reported separately so that the board can weigh it against its own policy.",
          },
          {
            heading: "1.3 Version Evaluated",
            body: "All results in this report refer to RankFlow v2.1, the release candidate that was frozen before testing began. No settings were changed after freezing.",
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
            body: "Sessions were taken from the store's clickstream logs and divided into three sets: a training set of 480,000 sessions used to fit the model, a validation set of 12,000 sessions used to compare settings during development, and a holdout set of 12,000 sessions used only for the final score.",
          },
          {
            heading: "2.2 Target Metric",
            body: "Ranking accuracy is measured as the top-10 hit rate: the share of sessions in which the product the shopper went on to buy appears among the first 10 products RankFlow ranks. The target set for this model is a top-10 hit rate of at least 60% on the holdout set.",
          },
          {
            heading: "2.3 Baseline for Comparison",
            body: "The current rule-based ranker has run in production for three years. It scored 55.1% on the same holdout set and is the reference point for all comparisons.",
          },
          {
            heading: "2.4 Evaluation Pipeline Review",
            body: "A separate review examined the evaluation pipeline, meaning the scripts and data extracts that build the three data sets and compute the scores. Its findings are reported in Section 4.",
          },
          {
            heading: "2.5 Serving Test",
            body: "We replayed one week of recorded peak-hour traffic against a staging deployment on servers matching production. Page rendering allows 100 ms for ranking, and the test recorded median and 99th-percentile ranking times as well as memory use.",
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
            heading: "3. HOLDOUT RESULTS",
            body: "",
          },
          {
            heading: "3.1 Test Overview",
            body: "The holdout set was scored once, after the model settings were frozen. For reporting it was split into four weekly slices of 3,000 sessions each, and all four slices are included.",
          },
          {
            heading: "3.2 Top-10 Hit Rate",
            body: "On the holdout set, RankFlow placed the product the shopper went on to buy in its top 10 results for 63.4% of sessions, above the 60% target set for this metric. The current ranker scored 55.1% on the same sessions.",
          },
          {
            heading: "3.3 Weekly Consistency",
            body: "The hit rate by weekly slice was 63.2%, 63.9%, 63.4% and 63.1%, so no slice fell below the 60% target.",
          },
          {
            heading: "3.4 Ranking Time",
            body: "At peak traffic, RankFlow ranked each product list in a median of 31 ms and a 99th-percentile time of 64 ms, both inside the 100 ms limit set for page rendering. Error rates were unchanged from the current ranker.",
          },
          {
            heading: "3.5 Shopper Segments",
            body: "Hit rate was 62.8% for mobile sessions and 64.3% for desktop sessions. It was 61.2% for first-time visitors and 65.1% for returning visitors.",
          },
          {
            heading: "3.6 Memory Use",
            body: "RankFlow's serving process used about 1.4 GB more memory than the current ranker. This is a minor observation and falls outside the board's policy criteria.",
          },
        ],
      },
      {
        pageNum: 5,
        sections: [
          {
            heading: "4. EVALUATION PIPELINE REVIEW",
            body: "",
          },
          {
            heading: "4.1 Pipeline Components",
            body: "The review covered the log extraction scripts, the step that assigns sessions to the three sets, and the scoring code. It was carried out by two engineers from the data platform team who were not involved in building RankFlow.",
          },
          {
            heading: "4.2 Session Overlap Check",
            body: "The review compared session identifiers between the training set and the holdout set.The review found that 12% of the sessions in the holdout set (1,440 of 12,000) also appeared in the training data, because the two sets were drawn from overlapping extracts of the same logs.",
          },
          {
            heading: "4.3 Label Definition",
            body: "A session counts as a hit only if the shopper completed a purchase within that session. Sessions without a purchase were excluded from all three sets before scoring.",
          },
          {
            heading: "4.4 Scoring Code",
            body: "The reviewers re-ran the scoring code from scratch on the holdout set and reproduced the top-10 hit rate of 63.4% to one decimal place.",
          },
          {
            heading: "4.5 Data Handling",
            body: "All sessions were anonymized before extraction, and no personal data left the analytics environment at any point in the evaluation.",
          },
        ],
      },
      {
        pageNum: 6,
        sections: [
          {
            heading: "5. LIMITATIONS",
            body: "The serving test used replayed traffic in a staging environment, so behaviour under live traffic could differ in detail. All results refer to RankFlow v2.1 only and do not extend to later versions.",
          },
          {
            body: "Minor limitation, outside the board's policy criteria: the evaluation covered the English-language storefront only, so hit rates for other regional storefronts were not measured.",
          },
          {
            heading: "APPENDIX A: SUPPORTING FIGURES",
            body: "Data set sizes: training 480,000 sessions, validation 12,000 sessions, holdout 12,000 sessions (four weekly slices of 3,000). Top-10 hit rate on the holdout set: week 1, 63.2%; week 2, 63.9%; week 3, 63.4%; week 4, 63.1%; overall 63.4%. The current rule-based ranker scored 55.1% overall. Median ranking time at peak traffic: 31 ms.",
          },
          {
            heading: "APPENDIX B: ALTERNATIVES SCREENED",
            body: "Two other approaches, a popularity-only sorter and a third-party ranking service, were screened before this evaluation. The sorter was excluded because it ignores shopper behaviour, and the service because its terms do not allow storing session data outside the vendor's systems. Neither was evaluated.",
          },
          {
            heading: "REFERENCES",
            body: "[1] RankFlow Team. (2024). RankFlow v2.1 Model Card. Internal model registry.\n[2] Whitfield, S., Achebe, N., & Song, J. (2024). Evaluation Methodology for Ranking Models. Applied ML Systems Review, Report No. 70.\n[3] Machine Learning Standards Board. (2024). Model Deployment Review Process, v3. Internal engineering handbook.",
          },
        ],
      },
    ],
  },
};
