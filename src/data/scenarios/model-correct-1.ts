import type { Scenario } from "../types";

// SignalCast: a demand-forecasting model whose data integrity review found no
// overlap between training and holdout data (page 4, 3.2) and whose holdout
// error is below its target. Two minor caveats sit away from the key passage.
export const scenario: Scenario = {
  id: "model-correct-1",
  domain: "model",
  trial_type: "AI-Correct",
  research_question:
    "Based on the model evaluation report, should SignalCast be approved for deployment to forecast weekly product demand?",
  correct_answer: "Yes",
  key_block_id: "b3",
  ai_summary_blocks: [
    {
      id: "b1",
      text: "On the holdout set, SignalCast's average forecast error was 9.6%, which is better than the 12% target set for the model.",
      label: "SignalCast Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "On the holdout set, SignalCast's mean absolute percentage error was 9.6%, below the 12% target set for this model. The spreadsheet-based forecast scored 14.8% on the same weeks.",
      },
    },
    {
      id: "b2",
      text: "SignalCast's weekly forecast error stayed at or below 10.3% in each of the 13 holdout weeks, so its accuracy held steady over time.",
      label: "SignalCast Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "Weekly error on the holdout set ranged from 9.1% to 10.3%, so the forecast was equally reliable across all 13 weeks.",
      },
    },
    {
      id: "b3",
      text: "The data integrity review found that SignalCast's training data and holdout data do not overlap in any way.",
      label: "SignalCast Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "The review found no overlap between the training data and the holdout data: the training set ends in the week of 25 June 2023, the holdout set begins in the week of 2 July 2023, and no weekly record appears in both.",
      },
    },
  ],
  document: {
    id: "model-correct-1",
    title: "Model Evaluation Report: SignalCast v1.4",
    authors: "Whitfield, S., Achebe, N., & Song, J.",
    journal: "Applied ML Systems Review, 2024, Report No. 91",
    pages: [
      {
        pageNum: 1,
        sections: [
          {
            heading: "SUMMARY",
            body: "Background: SignalCast is a machine-learning model, a program that learns patterns from past data, that forecasts how many units of each product every store will sell in the coming week, so that purchasing teams can order stock. It would replace the spreadsheet-based forecast now in use.",
          },
          {
            body: "Objective: To document how SignalCast performs on data it has not seen and how its evaluation was set up, following the model evaluation process that every model goes through before deployment can be considered.",
          },
          {
            body: "Methods: We trained SignalCast on 1,040,000 weekly sales records from January 2021 to June 2023 and measured final performance on a holdout set (data kept aside until the end and used only for the final score) of 104,000 records covering 13 later weeks. We also reviewed the data pipeline and timed a full forecasting run.",
          },
          {
            body: "Scope: This report presents findings only. It does not contain a recommendation. The deployment decision rests with the model review board, which applies its own policy to the findings in Sections 3 and 4.",
          },
          {
            body: "Report structure: Section 1 gives background, Section 2 describes the method, Section 3 reports the data integrity review, Section 4 reports the holdout results, and Section 5 lists limitations. Appendix A gives weekly figures.",
          },
        ],
      },
      {
        pageNum: 2,
        sections: [
          {
            heading: "1. BACKGROUND",
            body: "Our purchasing teams order stock for 8,000 store-product combinations every week. Today the order quantities come from a spreadsheet-based forecast that extends recent sales averages and applies manual seasonal adjustments.",
          },
          {
            body: "SignalCast was trained on past weekly sales, promotions and holidays to forecast the next week's demand for each store-product combination. A small trial with one regional purchasing team earlier this year prompted this formal evaluation.",
          },
          {
            heading: "1.1 Why a Formal Evaluation",
            body: "Forecasts drive ordering across the whole chain, so every model goes through the same evaluation. It is carried out by engineers who did not build the model.",
          },
          {
            heading: "1.2 What the Evaluation Covers",
            body: "The evaluation covers four areas: forecast accuracy on held-out data, consistency of that accuracy over time, the integrity of the data used, and run time. Each area is reported separately so that the board can weigh it against its own policy.",
          },
          {
            heading: "1.3 Version Evaluated",
            body: "All results in this report refer to SignalCast v1.4, the release candidate that was frozen before testing began. No settings were changed after freezing.",
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
            body: "The data covers 8,000 store-product series. The training set holds 1,040,000 weekly records (130 weeks, January 2021 to June 2023). The holdout set holds 104,000 records covering the 13 weeks from July to September 2023 and was used only for the final score.",
          },
          {
            heading: "2.2 Target Metric",
            body: "Forecast accuracy is measured as mean absolute percentage error: the average size of the forecast error as a percentage of actual sales, where lower is better. The target set for this model is a value of 12% or lower on the holdout set.",
          },
          {
            heading: "2.3 Baseline for Comparison",
            body: "The current spreadsheet-based forecast has been in use for four years. We scored it on the same 13 holdout weeks and it is the reference point for all comparisons.",
          },
          {
            heading: "2.4 Data Integrity Review",
            body: "A separate review examined the data pipeline, meaning the scripts and extracts that build the training and holdout sets and the features the model uses. Its findings are reported in Section 3.",
          },
          {
            heading: "2.5 Tuning",
            body: "Model settings were tuned on the last 13 weeks of the training period. The holdout set played no part in tuning and was scored once, after the settings were frozen.",
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
            heading: "3. DATA INTEGRITY REVIEW",
            body: "",
          },
          {
            heading: "3.1 Review Scope",
            body: "The review covered the sales extraction scripts, the step that splits the data by date, and the feature code. It was carried out by two engineers from the data platform team who were not involved in building SignalCast.",
          },
          {
            heading: "3.2 Training and Holdout Overlap",
            body: "The review compared every weekly record in the training set with the holdout set. The review found no overlap between the training data and the holdout data: the training set ends in the week of 25 June 2023, the holdout set begins in the week of 2 July 2023, and no weekly record appears in both.",
          },
          {
            heading: "3.3 Feature Windows",
            body: "Rolling averages and other features for any week use only sales from earlier weeks. Promotion and holiday calendars are published ahead of time and were taken from the planning system as they stood before each week.",
          },
          {
            heading: "3.4 Record Counts",
            body: "The pipeline produced 1,040,000 training records and 104,000 holdout records, matching the counts expected from 8,000 series over 130 and 13 weeks. No records were dropped or duplicated.",
          },
          {
            heading: "3.5 Data Handling",
            body: "Sales records contain no customer information. Only aggregated weekly unit counts per store and product were extracted.",
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
            body: "The holdout set was scored once, after the model settings were frozen. All 13 weeks are included, and no week was excluded or repeated.",
          },
          {
            heading: "4.2 Forecast Error",
            body: "On the holdout set, SignalCast's mean absolute percentage error was 9.6%, below the 12% target set for this model. The spreadsheet-based forecast scored 14.8% on the same weeks.",
          },
          {
            heading: "4.3 Weekly Consistency",
            body: "Weekly error on the holdout set ranged from 9.1% to 10.3%, so the forecast was equally reliable across all 13 weeks. Weekly figures are listed in Appendix A.",
          },
          {
            heading: "4.4 Store Groups",
            body: "Error was 9.2% for large stores and 10.1% for small stores, and the difference was similar in each of the 13 weeks.",
          },
          {
            heading: "4.5 Retraining Time",
            body: "Retraining SignalCast takes about six hours on one server, compared with two hours for the spreadsheet process. This is a minor observation and falls outside the board's policy criteria.",
          },
        ],
      },
      {
        pageNum: 6,
        sections: [
          {
            heading: "5. LIMITATIONS",
            body: "The holdout weeks fall in one season, so behaviour in the winter holiday period was not measured. All results refer to SignalCast v1.4 only and do not extend to later versions.",
          },
          {
            body: "Minor limitation, outside the board's policy criteria: the model's documentation lacks plain-language descriptions for 6 of its 41 input features.",
          },
          {
            heading: "APPENDIX A: WEEKLY FIGURES",
            body: "Mean absolute percentage error on the holdout set by week, weeks 1 to 13: 9.4%, 9.1%, 9.5%, 9.8%, 10.1%, 9.3%, 9.2%, 9.7%, 10.3%, 9.6%, 9.4%, 9.5%, 9.9%. The average is 9.6%. The spreadsheet-based forecast averaged 14.8% over the same weeks.",
          },
          {
            heading: "APPENDIX B: ALTERNATIVES SCREENED",
            body: "Two other approaches, a seasonal-average method and a third-party forecasting service, were screened before this evaluation. The first was excluded because it cannot use promotion data, and the second because its terms do not allow sales data to leave our systems. Neither was evaluated.",
          },
          {
            heading: "REFERENCES",
            body: "[1] SignalCast Team. (2024). SignalCast v1.4 Model Card. Internal model registry.\n[2] Whitfield, S., Achebe, N., & Song, J. (2024). Evaluation Methodology for Forecasting Models. Applied ML Systems Review, Report No. 82.\n[3] Machine Learning Standards Board. (2024). Model Deployment Review Process, v3. Internal engineering handbook.",
          },
        ],
      },
    ],
  },
};
