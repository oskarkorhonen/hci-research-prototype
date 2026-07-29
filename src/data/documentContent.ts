export interface PageContent {
  pageNum: number;
  sections: { heading?: string; body: string }[];
}

// Full simulated paper content, keyed by document id. The exact_text values
// from scenario.ts appear verbatim here so the DocumentViewer can locate and
// highlight them.
export const documentPagesByDoc: Record<string, PageContent[]> = {
  doc_1: [
    {
      pageNum: 1,
      sections: [
        {
          heading: "ABSTRACT",
          body: "Background: Drug X (xanthoprolide) has been investigated as a potential therapeutic agent for Condition Y, a chronic inflammatory disorder affecting an estimated 4.2 million adults in the United States. Early in vitro studies suggested promising anti-inflammatory properties, prompting escalation to clinical trials.",
        },
        {
          body: "Objective: To synthesize and critically evaluate the existing body of clinical evidence regarding the efficacy and safety of Drug X in patients diagnosed with Condition Y.",
        },
        {
          body: "Methods: We conducted a systematic review of randomized controlled trials (RCTs) published between 2014 and 2023. Databases searched included MEDLINE, EMBASE, and the Cochrane Central Register of Controlled Trials. A meta-analysis was performed on three eligible RCTs meeting predefined quality thresholds.",
        },
        {
          body: "Results: Contrary to initial expectations, the clinical evidence reveals significant safety concerns. Drug X caused severe adverse reactions in the majority of patients with Condition Y, resulting in trial termination. The meta-analysis of available data was inconclusive, with substantial statistical heterogeneity precluding definitive efficacy conclusions.",
        },
        {
          body: "Conclusions: The current evidence does not support the use of Drug X for Condition Y. Regulatory bodies and clinical guideline committees have been notified of these findings, and updated recommendations are forthcoming.",
        },
        {
          body: "Keywords: Drug X; xanthoprolide; Condition Y; inflammatory disorders; adverse drug reactions; clinical trials; meta-analysis",
        },
      ],
    },
    {
      pageNum: 2,
      sections: [
        {
          heading: "1. INTRODUCTION",
          body: "Condition Y represents a significant unmet medical need. Characterised by persistent systemic inflammation, progressive tissue damage, and substantially reduced quality of life, the disorder affects millions of patients worldwide. Existing pharmacological options are limited by partial efficacy, significant toxicity profiles, and high rates of treatment discontinuation.",
        },
        {
          body: "Drug X (xanthoprolide), a novel selective inhibitor of the proinflammatory cytokine cascade, emerged from preclinical research as a promising candidate. Its mechanism of action—targeting the interleukin-6 (IL-6) transduction pathway—was hypothesised to provide superior symptom control with a more favourable safety profile compared to existing agents such as corticosteroids and disease-modifying antirheumatic drugs (DMARDs).",
        },
        {
          body: "Initial phase I and IIa trials, conducted in healthy volunteers and patients with other inflammatory conditions, reported acceptable tolerability. These early results generated considerable optimism and supported advancement to phase III trials in patients with Condition Y specifically.",
        },
        {
          body: "However, the clinical landscape has shifted substantially following the completion of these larger trials. Current guidelines do not recommend Drug X as a first-line treatment for Condition Y, citing insufficient evidence and safety concerns identified in early-phase trials.",
        },
        {
          body: "This systematic review was commissioned to provide a comprehensive and objective synthesis of all available clinical evidence. The central research question is whether Drug X demonstrates adequate efficacy and an acceptable safety profile to support its clinical use in patients diagnosed with Condition Y.",
        },
        {
          heading: "1.1 Scope and Objectives",
          body: "The primary objectives of this review are: (1) to assess the efficacy of Drug X in reducing primary outcome measures in patients with Condition Y; (2) to evaluate the safety profile of Drug X in this population; and (3) to appraise the methodological quality of the existing trial literature.",
        },
      ],
    },
    {
      pageNum: 3,
      sections: [
        {
          heading: "2. METHODS",
          body: "",
        },
        {
          heading: "2.1 Study Design",
          body: "A systematic review with meta-analysis was conducted in accordance with the Preferred Reporting Items for Systematic Reviews and Meta-Analyses (PRISMA) 2020 guidelines. The review protocol was pre-registered on PROSPERO (CRD42023441872) prior to commencement of the literature search.",
        },
        {
          heading: "2.2 Eligibility Criteria",
          body: "Studies were eligible for inclusion if they: (1) were randomised controlled trials or prospective observational studies; (2) enrolled adult patients (≥18 years) with a confirmed diagnosis of Condition Y; (3) evaluated Drug X as a monotherapy or combination therapy; (4) reported at least one pre-specified efficacy or safety outcome; and (5) had a minimum follow-up duration of 12 weeks.",
        },
        {
          heading: "2.3 Information Sources and Search Strategy",
          body: "A systematic search was conducted in MEDLINE (via PubMed), EMBASE, and the Cochrane Central Register of Controlled Trials from database inception to October 31, 2023. The search strategy employed a combination of MeSH terms and free-text keywords related to Drug X and Condition Y. Reference lists of identified studies and relevant review articles were hand-searched for additional eligible studies.",
        },
        {
          heading: "2.4 Data Extraction and Quality Assessment",
          body: "Two independent reviewers extracted data from eligible studies using a standardised extraction form. Disagreements were resolved by consensus or consultation with a third reviewer. Methodological quality was assessed using the Cochrane Risk of Bias 2 (RoB 2) tool for randomised trials.",
        },
        {
          heading: "2.5 Statistical Analysis",
          body: "Where feasible, data from eligible studies were pooled using a random-effects meta-analysis model (DerSimonian and Laird method), selected a priori given the anticipated clinical heterogeneity across studies. Statistical heterogeneity was quantified using the I² statistic. Publication bias was assessed using Egger's test and funnel plot asymmetry. All analyses were performed using Review Manager (RevMan) version 5.4.",
        },
      ],
    },
    {
      pageNum: 4,
      sections: [
        {
          heading: "3. RESULTS",
          body: "",
        },
        {
          heading: "3.1 Study Selection",
          body: "The electronic database search identified 1,847 records. After removing duplicates (n = 312) and screening titles and abstracts, 67 full-text articles were assessed for eligibility. Following full-text review, three RCTs were included in the final systematic review and meta-analysis. The primary reasons for exclusion were: non-randomised design (n = 29), incorrect patient population (n = 18), insufficient follow-up duration (n = 12), and unavailable full-text data (n = 5).",
        },
        {
          heading: "3.2 Characteristics of Included Studies",
          body: "The three included trials enrolled a combined total of 1,204 patients with Condition Y. Study durations ranged from 24 to 52 weeks. All three trials used placebo as the comparator. Baseline demographics were broadly comparable across trials.",
        },
        {
          heading: "3.3 Safety Outcomes — Adverse Events",
          body: "Safety data presented across the three included trials consistently revealed a concerning pattern. The most significant finding emerged from the largest of the included trials (DRAGON-III, n = 847), which was designed as a pivotal registration trial. Drug X caused severe adverse reactions in 68% of patients with Condition Y and all phase III trials were halted by the independent safety monitoring board.",
        },
        {
          body: "Specific adverse events included: hepatotoxicity (Grade 3–4 elevations in liver enzymes: 34.2%); severe hypersensitivity reactions, including anaphylaxis (12.8%); opportunistic infections attributable to immune dysregulation (19.3%); and cardiovascular events, including two fatalities (2.1%). These rates were substantially elevated compared to the placebo arm and far exceeded pre-specified safety thresholds.",
        },
        {
          heading: "3.4 Primary Efficacy Outcomes",
          body: "Notwithstanding the safety concerns, efficacy data were also collected and analysed for completeness. The primary efficacy outcome—a composite measure of disease activity reduction at week 24—showed a numerically higher response rate in the Drug X arm. However, given that trials were terminated early due to safety events, the efficacy data are considered incomplete and unreliable.",
        },
      ],
    },
    {
      pageNum: 5,
      sections: [
        {
          heading: "3.5 Secondary Efficacy Outcomes",
          body: "Secondary efficacy outcomes, including patient-reported outcomes (PROs) and biomarker assessments, were reported inconsistently across the three trials, limiting cross-study comparisons. Among the two trials reporting patient-reported fatigue scores, one reported a statistically significant improvement in the Drug X arm (p = 0.03), while the other reported no significant difference (p = 0.61).",
        },
        {
          heading: "3.6 Subgroup Analyses",
          body: "Subgroup analyses were pre-specified for age (< 50 vs. ≥ 50 years), disease severity (mild-to-moderate vs. severe), and prior treatment history (biologic-naïve vs. biologic-experienced). Due to early trial termination, no subgroup analysis reached statistical significance. The hazard ratios for adverse events were consistently elevated across all pre-specified subgroups, suggesting the safety signal is not confined to a specific patient subpopulation.",
        },
        {
          heading: "3.7 Dosing and Administration",
          body: "Drug X was administered at a fixed dose of 200 mg orally, twice daily in two of the three trials, and at a weight-adjusted dose (3.5 mg/kg/day) in the third. No significant differences in the safety or efficacy signal were observed between the two dosing regimens.",
        },
        {
          heading: "3.8 Biomarker Data",
          body: "A subset of patients in two trials underwent intensive biomarker profiling. Elevated baseline levels of IL-6 receptor density on peripheral blood mononuclear cells were paradoxically associated with a higher rate of severe adverse reactions in the Drug X arm, a finding that warrants further mechanistic investigation and may partially explain the unexpected toxicity in this population.",
        },
      ],
    },
    {
      pageNum: 6,
      sections: [
        {
          heading: "4. DISCUSSION",
          body: "",
        },
        {
          heading: "4.1 Principal Findings",
          body: "The central finding of this systematic review is unambiguous: the available clinical evidence does not support the use of Drug X in patients with Condition Y. The severe adverse event profile observed across all three included trials, culminating in the independent termination of the pivotal phase III program, represents a definitive safety signal that cannot be mitigated through patient selection or dose adjustment based on the available data.",
        },
        {
          heading: "4.2 Comparison with Prior Reviews",
          body: "This conclusion stands in stark contrast to two earlier, smaller reviews that evaluated Drug X across different patient populations. Those reviews reported a manageable safety profile, which provided part of the rationale for advancing to trials in Condition Y. Our review underscores the critical importance of population-specific clinical evidence and the limitations of extrapolating safety data across even biologically related conditions.",
        },
        {
          heading: "4.3 Mechanistic Considerations",
          body: "The unexpected severity of the adverse event profile in Condition Y patients may be attributable to disease-specific pathophysiology. Patients with Condition Y exhibit a distinctly dysregulated immune phenotype, characterised by overactivation of the same IL-6 pathway targeted by Drug X. The paradoxical worsening of immune dysregulation observed—rather than the anticipated modulation—suggests a complex, non-linear interaction between the drug's mechanism of action and the underlying immunopathology.",
        },
        {
          heading: "4.4 Implications for Clinical Practice",
          body: "Until mechanistic studies clarify the basis for these adverse events and, if possible, identify a biomarker-defined subpopulation that might safely benefit from Drug X, clinical use of this agent in Condition Y patients is contraindicated. Clinicians should be vigilant for off-label prescribing, given the initial optimism surrounding this agent.",
        },
        {
          heading: "4.5 Research Recommendations",
          body: "Future research should focus on: (1) mechanistic studies elucidating the immunological basis of Drug X's adverse effects in Condition Y; (2) identification of predictive biomarkers for adverse reactions; and (3) development of structurally modified analogs that preserve the proposed mechanism of action while mitigating the observed toxicity.",
        },
      ],
    },
    {
      pageNum: 7,
      sections: [
        {
          heading: "5. META-ANALYSIS RESULTS",
          body: "",
        },
        {
          heading: "5.1 Quantitative Synthesis",
          body: "Three studies met criteria for inclusion in the quantitative synthesis. Given the anticipated methodological and clinical variability, a random-effects model was employed for all pooled analyses, consistent with the pre-registered protocol.",
        },
        {
          heading: "5.2 Primary Outcome: Symptom Burden Reduction",
          body: "The primary endpoint of interest was the reduction in validated symptom burden scores (Condition Y Activity Score, CYAS-28) at week 24. The meta-analysis of three independent studies was inconclusive, with high heterogeneity (I² = 87%) and no statistically significant reduction in symptom burden (p = 0.34). The pooled standardised mean difference (SMD) was −0.18 (95% CI: −0.54 to +0.19), which is neither clinically meaningful nor statistically significant.",
        },
        {
          body: "The substantial heterogeneity (I² = 87%) precludes reliable pooling and suggests that a single summary estimate is misleading. Possible sources of heterogeneity include differences in patient disease severity at baseline, variations in concomitant medication use, and differing follow-up durations across the three trials.",
        },
        {
          heading: "5.3 Secondary Outcome: Adverse Event Rates",
          body: "In contrast to the inconclusive efficacy data, the pooled adverse event analysis revealed a highly consistent and statistically significant signal. The risk ratio for serious adverse events (SAEs) in the Drug X arm compared to placebo was 4.7 (95% CI: 3.2–6.9; p < 0.0001; I² = 12%), indicating a nearly five-fold increase in the risk of serious adverse events.",
        },
        {
          heading: "5.4 Sensitivity Analysis",
          body: "Sensitivity analyses removing each study in turn did not materially alter the conclusions regarding safety: the risk ratio for SAEs remained significantly elevated regardless of which study was excluded. Sensitivity analyses for the efficacy outcome confirmed the null finding and high heterogeneity were robust to individual study removal.",
        },
        {
          heading: "5.5 Publication Bias Assessment",
          body: "Egger's test did not reach statistical significance (p = 0.21), and funnel plot inspection was inconclusive given the small number of studies (n = 3). The potential for publication bias towards positive efficacy results cannot be excluded, particularly given the early termination of the included trials.",
        },
      ],
    },
    {
      pageNum: 8,
      sections: [
        {
          heading: "6. CONCLUSIONS",
          body: "This systematic review and meta-analysis provides a comprehensive synthesis of the available clinical evidence on Drug X for Condition Y. The totality of the evidence leads to the following unequivocal conclusions.",
        },
        {
          body: "First, Drug X is not effective for Condition Y. The quantitative synthesis of available efficacy data failed to demonstrate a statistically or clinically significant reduction in the primary outcome of symptom burden.",
        },
        {
          body: "Second, and more critically, Drug X is not safe for Condition Y. The severe adverse event profile, including high rates of hepatotoxicity, hypersensitivity reactions, and opportunistic infections, resulted in the mandatory termination of the pivotal phase III clinical trial program by an independent safety monitoring board.",
        },
        {
          body: "Third, current clinical guidelines reflect these findings. Drug X is not recommended for Condition Y by any major regulatory authority or clinical guideline body. This review reinforces and updates the evidence base underlying those guideline recommendations.",
        },
        {
          body: "In conclusion, the administration of Drug X to patients with Condition Y is not supported by the evidence and carries substantial patient safety risks. The medical community is urged to adhere strictly to evidence-based guidelines and to exercise caution with respect to off-label prescribing of this agent.",
        },
        {
          heading: "CONFLICT OF INTEREST STATEMENT",
          body: "The authors declare no conflicts of interest. This review was funded by an independent research grant from the National Institutes of Health (R01-GM-114592). The funding source had no role in study design, data collection, analysis, interpretation, or the decision to publish.",
        },
        {
          heading: "REFERENCES",
          body: "[1] Armstrong, J. et al. (2019). Phase I safety trial of Drug X in healthy volunteers. J Pharmacol Clin Trials, 12(3), 145–162.\n[2] Bernstein, K. et al. (2021). DRAGON-I: Phase IIa trial of Drug X in Condition A. Ann Rheum Dis, 80(5), 601–612.\n[3] Chen, L. et al. (2023). DRAGON-III: Phase III trial of Drug X in Condition Y (early termination report). N Engl J Med, 389(14), 1287–1298.\n[4] DerSimonian, R., Laird, N. (1986). Meta-analysis in clinical trials. Control Clin Trials, 7(3), 177–188.\n[5] European Medicines Agency. (2023). Assessment report on Drug X (xanthoprolide). EMA/CHMP/2023/117824.",
        },
      ],
    },
  ],
  doc_2: [
    {
      pageNum: 1,
      sections: [
        {
          heading: "ABSTRACT",
          body: "Background: Drug Z (renuvastin) is a selective modulator of the tissue remodeling pathway implicated in Condition W, a chronic degenerative disorder affecting an estimated 3.1 million adults in the United States. Preclinical and early-phase studies suggested a favorable efficacy and tolerability profile, supporting progression to large-scale phase III evaluation.",
        },
        {
          body: "Objective: To synthesize and critically evaluate the existing body of clinical evidence regarding the efficacy and safety of Drug Z in patients diagnosed with Condition W.",
        },
        {
          body: "Methods: We conducted a systematic review of randomized controlled trials (RCTs) published between 2016 and 2024. Databases searched included MEDLINE, EMBASE, and the Cochrane Central Register of Controlled Trials. A meta-analysis was performed on four eligible RCTs meeting predefined quality thresholds.",
        },
        {
          body: "Results: The clinical evidence consistently supports both the efficacy and safety of Drug Z. The meta-analysis of four independent randomized controlled trials demonstrated a statistically significant improvement in primary symptom scores for Condition W patients treated with Drug Z compared to placebo (p < 0.001). Adverse event rates were comparable to placebo, with no unexpected safety signals identified.",
        },
        {
          body: "Conclusions: The current evidence supports the use of Drug Z for Condition W. Major clinical guideline bodies have since reviewed this evidence and issued updated guidance recommending Drug Z as a preferred treatment option.",
        },
        {
          body: "Keywords: Drug Z; renuvastin; Condition W; tissue remodeling; clinical trials; meta-analysis",
        },
      ],
    },
    {
      pageNum: 2,
      sections: [
        {
          heading: "1. INTRODUCTION",
          body: "Condition W represents a significant unmet medical need. Characterised by progressive functional decline and substantially reduced quality of life, the disorder affects millions of patients worldwide. Existing pharmacological options are limited by partial efficacy and inconsistent tolerability, leaving a persistent gap in the standard of care.",
        },
        {
          body: "Drug Z (renuvastin), a selective modulator of the tissue remodeling pathway, emerged from preclinical research as a promising candidate. Its mechanism of action was hypothesised to provide durable symptom control with a tolerability profile suitable for long-term use.",
        },
        {
          body: "Initial phase I and IIa trials, conducted in healthy volunteers and patients with early-stage Condition W, reported favorable tolerability and encouraging early efficacy signals. These results supported advancement to phase III trials in a broader Condition W population.",
        },
        {
          body: "Following the completion of these larger trials, several major clinical guideline bodies have reviewed the accumulated evidence and issued updated guidance recommending Drug Z as a preferred treatment option for Condition W, citing its favorable benefit-risk profile.",
        },
        {
          body: "This systematic review was commissioned to provide a comprehensive and objective synthesis of all available clinical evidence. The central research question is whether Drug Z demonstrates adequate efficacy and an acceptable safety profile to support its clinical use in patients diagnosed with Condition W.",
        },
      ],
    },
    {
      pageNum: 3,
      sections: [
        {
          heading: "2. METHODS",
          body: "",
        },
        {
          heading: "2.1 Study Design",
          body: "A systematic review with meta-analysis was conducted in accordance with the Preferred Reporting Items for Systematic Reviews and Meta-Analyses (PRISMA) 2020 guidelines. The review protocol was pre-registered on PROSPERO (CRD42024518203) prior to commencement of the literature search.",
        },
        {
          heading: "2.2 Eligibility Criteria",
          body: "Studies were eligible for inclusion if they: (1) were randomised controlled trials; (2) enrolled adult patients (≥18 years) with a confirmed diagnosis of Condition W; (3) evaluated Drug Z as a monotherapy; (4) reported at least one pre-specified efficacy or safety outcome; and (5) had a minimum follow-up duration of 16 weeks.",
        },
        {
          heading: "2.3 Statistical Analysis",
          body: "Where feasible, data from eligible studies were pooled using a random-effects meta-analysis model, selected a priori given the anticipated clinical heterogeneity across studies. Statistical heterogeneity was quantified using the I² statistic. All analyses were performed using Review Manager (RevMan) version 5.4.",
        },
      ],
    },
    {
      pageNum: 4,
      sections: [
        {
          heading: "3. RESULTS",
          body: "",
        },
        {
          heading: "3.1 Study Selection",
          body: "The electronic database search identified 2,103 records. Following full-text review, four RCTs were included in the final systematic review and meta-analysis, enrolling a combined total of 1,650 patients with Condition W.",
        },
        {
          heading: "3.2 Safety Outcomes — Adverse Events",
          body: "Drug Z demonstrated a favorable safety profile across all four included trials, with adverse event rates comparable to placebo (12.4% vs 11.8%; not statistically significant). No trial was terminated early for safety reasons, and no unexpected safety signals were identified during the review period.",
        },
        {
          heading: "3.3 Primary Efficacy Outcomes",
          body: "The meta-analysis of four independent randomized controlled trials demonstrated a statistically significant improvement in primary symptom scores for Condition W patients treated with Drug Z compared to placebo (p < 0.001), with a pooled standardised mean difference of 0.52, corresponding to a moderate clinical effect size.",
        },
        {
          heading: "3.4 Heterogeneity and Consistency",
          body: "Statistical heterogeneity across the four included trials was low (I² = 18%), and the treatment effect was consistent across all pre-specified subgroups, including age, disease severity, and prior treatment history.",
        },
      ],
    },
    {
      pageNum: 5,
      sections: [
        {
          heading: "4. DISCUSSION",
          body: "",
        },
        {
          heading: "4.1 Principal Findings",
          body: "The central finding of this systematic review is that the available clinical evidence supports the use of Drug Z in patients with Condition W. The consistent efficacy signal, combined with a safety profile comparable to placebo across all four included trials, represents a favorable benefit-risk balance.",
        },
        {
          heading: "4.2 Guideline Adoption",
          body: "Following publication of the pivotal phase III trials, the International Condition W Consortium and the National Society for Degenerative Disorders have both reviewed the evidence and issued updated guidance recommending Drug Z as a preferred treatment option for Condition W.",
        },
        {
          heading: "5. CONCLUSIONS",
          body: "This systematic review and meta-analysis provides a comprehensive synthesis of the available clinical evidence on Drug Z for Condition W. Drug Z is effective for Condition W, demonstrating a statistically significant and clinically meaningful improvement in symptom burden relative to placebo.",
        },
        {
          body: "Drug Z is safe for Condition W, with adverse event rates comparable to placebo and no unexpected safety signals identified across the four included trials.",
        },
        {
          body: "Major clinical guideline bodies have endorsed Drug Z as a preferred treatment option for Condition W, and this review supports the continued use of Drug Z in accordance with current guidance.",
        },
        {
          heading: "CONFLICT OF INTEREST STATEMENT",
          body: "The authors declare no conflicts of interest. This review was funded by an independent research grant. The funding source had no role in study design, data collection, analysis, interpretation, or the decision to publish.",
        },
      ],
    },
  ],
};
